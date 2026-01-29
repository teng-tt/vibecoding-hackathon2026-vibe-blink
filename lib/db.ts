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

// 初始化数据库表
export async function initializeDatabase() {
  try {
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
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
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
