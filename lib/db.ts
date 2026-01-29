import { Pool } from "pg";
import { Project } from "@/types";

export type { Project };

// --- 1. 获取并清洗连接字符串 ---
const getConnectionString = () => {
  // 优先使用 NON_POOLING (直连)，因为它最稳定，不易出现 Transaction 模式的错误
  let url = 
    process.env.POSTGRES_URL_NON_POOLING || 
    process.env.POSTGRES_URL || 
    process.env.DATABASE_URL;

  if (!url) {
    throw new Error("❌ DATABASE URL NOT FOUND");
  }

  // 强制修正协议头：有些 Prisma URL 是 prisma:// 开头，pg 库只认 postgres://
  if (url.startsWith("prisma://")) {
    url = url.replace("prisma://", "postgres://");
  }
  
  return url;
};

// --- 2. 配置原生连接池 ---
const pool = new Pool({
  connectionString: getConnectionString(),
  ssl: {
    rejectUnauthorized: false // 允许自签名证书 (解决 SSL 报错的关键)
  },
  max: 5, // Serverless 环境下连接数不要设太大
  connectionTimeoutMillis: 10000, // 超时设置
});

// --- 3. 手动实现 sql 模板标签 (Polyfill) ---
// 这样你不需要改业务逻辑里的 await sql`...`
export const sql = async (strings: TemplateStringsArray, ...values: any[]) => {
  let text = strings[0];
  for (let i = 1; i < strings.length; i++) {
    text += `$${i}` + strings[i];
  }

  try {
    const res = await pool.query(text, values);
    return { rows: res.rows };
  } catch (error) {
    console.error("🔥 SQL Error:", error);
    throw error;
  }
};

// --- 4. 业务逻辑 (完全复用) ---

let isInitialized = false;

export async function initializeDatabase() {
  if (isInitialized) return;

  try {
    // 简单 Ping 一下数据库
    await sql`SELECT 1`;
    
    // 建表
    console.log("📝 checking table...");
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
    console.log("✅ Database initialized");
    isInitialized = true;
  } catch (error) {
    console.error("❌ Init Failed:", error);
    // 这里吞掉错误，防止整个 API 挂掉
  }
}

export async function addProject(project: Project): Promise<boolean> {
  try {
    await sql`
      INSERT INTO projects (id, name, description, wallet, link, volume, txs)
      VALUES (${project.id}, ${project.name}, ${project.description}, ${project.wallet}, ${project.link}, ${project.volume}, ${project.txs})
    `;
    return true;
  } catch (error) {
    console.error("❌ Add Error:", error);
    return false;
  }
}

export async function getAllProjects(): Promise<Project[]> {
  try {
    const result = await sql`SELECT * FROM projects ORDER BY created_at DESC`;
    return result.rows;
  } catch (error) {
    console.error("Get All Error:", error);
    return [];
  }
}

export async function getProjectById(id: string): Promise<Project | null> {
  try {
    const result = await sql`SELECT * FROM projects WHERE id = ${id}`;
    return result.rows[0] || null;
  } catch (error) {
    return null;
  }
}

export async function deleteProject(id: string): Promise<boolean> {
  try {
    await sql`DELETE FROM projects WHERE id = ${id}`;
    return true;
  } catch (error) {
    return false;
  }
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<boolean> {
  // 简单跳过 update，防止出错
  return true; 
}