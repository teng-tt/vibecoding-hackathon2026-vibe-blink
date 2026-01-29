import { sql } from "@vercel/postgres";

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
      // 验证环境变量
      if (!process.env.POSTGRES_URL && !process.env.POSTGRES_URL_NON_POOLING) {
        console.log("DB_URL是否存在1:", !!process.env.POSTGRES_URL); 
        console.log("DB_URL是否存在2:", !!process.env.POSTGRES_URL_NON_POOLING); 
        console.warn("⚠️  Database: POSTGRES_URL not configured, skipping initialization");
        isInitialized = true;
        return;
      }

      // 检查表是否已存在
      const exists = await tableExists();
      
      if (exists) {
        console.log("✅ Database table 'projects' already exists, skipping initialization");
        isInitialized = true;
        return;
      }

      // 创建项目表（如果不存在）
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
      }
      throw error;
    } finally {
      initializationPromise = null;
    }
  })();

  return initializationPromise;
}

export async function addProject(project: Project): Promise<boolean> {
  try {
    // 确保环境变量存在
    if (!process.env.POSTGRES_URL && !process.env.POSTGRES_URL_NON_POOLING) {
      console.error("Database connection error: POSTGRES_URL not configured");
      return false;
    }

    await sql`
      INSERT INTO projects (id, name, description, wallet, link, volume, txs)
      VALUES (${project.id}, ${project.name}, ${project.description}, ${project.wallet}, ${project.link}, ${project.volume}, ${project.txs})
    `;
    console.log(`Project added successfully: ${project.id}`);
    return true;
  } catch (error) {
    console.error("Error adding project:", error);
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
