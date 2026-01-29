import { sql, createClient } from "@vercel/postgres";

export interface Project {
  id: string;
  name: string;
  description: string;
  wallet: string;
  link: string;
  volume: number;
  txs: number;
  created_at?: string;
  updated_at?: string;
}

// 全局初始化标志 - 仅在程序启动时初始化一次
let isInitialized = false;
let initializationPromise: Promise<void> | null = null;

/**
 * 诊断并修复连接字符串配置
 * Vercel 生成了 POSTGRES_URL, PRISMA_DATABASE_URL, DATABASE_URL 三个环境变量
 * 我们需要确保使用正确的池连接字符串
 */
function ensureCorrectConnectionString() {
  const postgresUrl = process.env.POSTGRES_URL;
  const prismaUrl = process.env.PRISMA_DATABASE_URL;
  const databaseUrl = process.env.DATABASE_URL;
  const postgresUrlNonPooling = process.env.POSTGRES_URL_NON_POOLING;

  // 检查哪些变量已配置
  const configuredVars = {
    POSTGRES_URL: postgresUrl,
    PRISMA_DATABASE_URL: prismaUrl,
    DATABASE_URL: databaseUrl,
    POSTGRES_URL_NON_POOLING: postgresUrlNonPooling
  };

  console.log("📊 Database connection configuration detected:");
  Object.entries(configuredVars).forEach(([key, value]) => {
    if (value) {
      const preview = value.substring(0, 50) + "...";
      console.log(`   ✓ ${key}: ${preview}`);
    }
  });

  // 如果都没有配置，返回
  if (!postgresUrl && !prismaUrl && !databaseUrl) {
    console.warn("⚠️ No database URL configured");
    return;
  }

  // 检查连接字符串类型（池 vs 非池）
  const isPooling = (url: string) => {
    return url?.includes("pooling_mode") || 
           url?.includes(":6543") ||  // Vercel Postgres 池端口
           url?.includes("pooler");
  };

  const isNonPooling = (url: string) => {
    return url?.includes(":5432") ||  // 标准 PostgreSQL 端口
           url?.includes("localhost") || 
           url?.includes("sslmode=require");
  };

  // 验证 POSTGRES_URL 是正确的类型
  if (postgresUrl) {
    if (isNonPooling(postgresUrl) && !isPooling(postgresUrl)) {
      console.warn("⚠️ POSTGRES_URL appears to be a non-pooling connection!");
      
      // 尝试从其他变量中找到正确的池连接
      if (prismaUrl && isPooling(prismaUrl)) {
        console.warn("   ℹ️ Using PRISMA_DATABASE_URL instead (appears to be pooled)");
        process.env.POSTGRES_URL = prismaUrl;
      } else if (databaseUrl && isPooling(databaseUrl)) {
        console.warn("   ℹ️ Using DATABASE_URL instead (appears to be pooled)");
        process.env.POSTGRES_URL = databaseUrl;
      } else if (postgresUrlNonPooling) {
        console.warn("   ℹ️ Swapping with POSTGRES_URL_NON_POOLING");
        const temp = process.env.POSTGRES_URL;
        process.env.POSTGRES_URL = postgresUrlNonPooling;
        process.env.POSTGRES_URL_NON_POOLING = temp;
      }
    } else if (isPooling(postgresUrl)) {
      console.log("✅ POSTGRES_URL is correctly configured as a pooled connection");
    }
  }
}

/**
 * 检查数据库表是否已存在
 */
async function tableExists(): Promise<boolean> {
  try {
    await sql`SELECT 1 FROM projects LIMIT 1`;
    return true;
  } catch (error) {
    // 表不存在会抛出错误
    return false;
  }
}

/**
 * 初始化数据库表（仅执行一次，且仅在表不存在时创建）
 */
export async function initializeDatabase() {
  // 如果已初始化，直接返回
  if (isInitialized) {
    return;
  }

  // 如果正在初始化，等待完成
  if (initializationPromise) {
    return initializationPromise;
  }

  // 开始初始化
  initializationPromise = (async () => {
    try {
      // 检查是否运行在服务器环境
      if (typeof window !== 'undefined') {
        console.warn("⚠️ Database initialization called from client-side, skipping");
        isInitialized = true;
        return;
      }

      // 诊断并修复连接字符串配置
      ensureCorrectConnectionString();

      // 检查环境变量
      if (!process.env.POSTGRES_URL) {
        console.warn("⚠️ POSTGRES_URL environment variable not configured, skipping initialization");
        isInitialized = true;
        return;
      }

      // 尝试检查表是否存在（这会验证数据库连接）
      const exists = await tableExists();
      
      if (exists) {
        console.log("✅ Database table 'projects' already exists, skipping initialization");
        isInitialized = true;
        return;
      }

      // 创建项目表（如果不存在）
      console.log("📝 Creating database table 'projects'...");
      await sql`
        CREATE TABLE IF NOT EXISTS projects (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT,
          wallet TEXT,
          link TEXT,
          volume NUMERIC,
          txs INTEGER,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;
      console.log("✅ Database table 'projects' created successfully");
      isInitialized = true;
    } catch (error) {
      console.error("❌ Error initializing database:", error);
      if (error instanceof Error) {
        console.error("Details:", error.message);
        
        // 针对不同的错误类型提供明确的诊断信息
        if (error.message.includes("invalid_connection_string")) {
          console.error("⚠️ CRITICAL: Connection string configuration error!");
          console.error("");
          console.error("   This usually means POSTGRES_URL is a direct connection instead of pooled.");
          console.error("");
          console.error("   In Vercel, you should have multiple database URLs:");
          console.error("   • POSTGRES_URL - should be pooled (contains :6543 or pooler)");
          console.error("   • POSTGRES_URL_NON_POOLING - direct connection (contains :5432)");
          console.error("   • DATABASE_URL / PRISMA_DATABASE_URL - aliases");
          console.error("");
          console.error("   ACTION: Check your Vercel environment variables are correctly assigned");
          console.error("   Usually Vercel auto-assigns POSTGRES_URL as the correct pooled connection.");
          console.error("   If not, manually swap them in Settings > Environment Variables.");
        } else if (error.message.includes("missing_connection_string")) {
          console.error("⚠️ Database connection string is missing!");
          console.error("   POSTGRES_URL environment variable is not set in Vercel.");
          console.error("   Check: Vercel Dashboard > Settings > Environment Variables");
        } else if (error.message.includes("ECONNREFUSED") || 
                   error.message.includes("cannot find") ||
                   error.message.includes("not found")) {
          console.error("⚠️ Database connection failed - verify network and credentials");
        }
      }
      // 不抛出错误，允许应用继续运行（实际操作会在运行时触发更明确的错误）
      isInitialized = true;
    } finally {
      initializationPromise = null;
    }
  })();

  return initializationPromise;
}

export async function addProject(project: Project): Promise<boolean> {
  try {
    await sql`
      INSERT INTO projects (id, name, description, wallet, link, volume, txs)
      VALUES (${project.id}, ${project.name}, ${project.description}, ${project.wallet}, ${project.link}, ${project.volume}, ${project.txs})
    `;
    console.log(`✅ Project added successfully: ${project.id}`);
    return true;
  } catch (error) {
    console.error("❌ Error adding project:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
    }
    return false;
  }
}

export async function getAllProjects(): Promise<Project[]> {
  try {
    const result = await sql<Project>`
      SELECT * FROM projects ORDER BY created_at DESC
    `;
    return result.rows;
  } catch (error) {
    console.error("Error getting all projects:", error);
    return [];
  }
}

export async function getProjectById(id: string): Promise<Project | null> {
  try {
    const result = await sql<Project>`
      SELECT * FROM projects WHERE id = ${id}
    `;
    return result.rows[0] || null;
  } catch (error) {
    console.error("Error getting project by id:", error);
    return null;
  }
}

export async function deleteProject(id: string): Promise<boolean> {
  try {
    await sql`
      DELETE FROM projects WHERE id = ${id}
    `;
    return true;
  } catch (error) {
    console.error("Error deleting project:", error);
    return false;
  }
}

export async function updateProject(
  id: string,
  updates: Partial<Project>
): Promise<boolean> {
  try {
    const allowedFields = ["name", "description", "wallet", "link", "volume", "txs"];
    const fields = Object.keys(updates).filter((key) =>
      allowedFields.includes(key)
    );

    if (fields.length === 0) return true;

    // 构建动态SQL UPDATE语句
    const setClauses: string[] = [];
    const values: any[] = [];

    for (const field of fields) {
      setClauses.push(`${field} = $${values.length + 1}`);
      values.push((updates as any)[field]);
    }

    values.push(id);

    const query = `
      UPDATE projects 
      SET ${setClauses.join(", ")}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $${values.length}
    `;

    await sql.query(query, values);
    return true;
  } catch (error) {
    console.error("Error updating project:", error);
    return false;
  }
}
