import Database from "better-sqlite3";
import path from "path";

// 获取数据库文件路径
const dbPath = path.join(process.cwd(), "data", "projects.db");

// 确保 data 目录存在
import { mkdirSync } from "fs";
mkdirSync(path.dirname(dbPath), { recursive: true });

// 创建或打开数据库
let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(dbPath);
    db.pragma("journal_mode = WAL");
    initializeDatabase();
  }
  return db;
}

function initializeDatabase() {
  const database = getDb();
  
  // 创建项目表
  database.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      wallet TEXT,
      link TEXT,
      volume REAL,
      txs INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

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

export function addProject(project: Project): boolean {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO projects (id, name, description, wallet, link, volume, txs)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  
  try {
    stmt.run(
      project.id,
      project.name,
      project.description,
      project.wallet,
      project.link,
      project.volume,
      project.txs
    );
    return true;
  } catch (error) {
    console.error("Error adding project:", error);
    return false;
  }
}

export function getAllProjects(): Project[] {
  const db = getDb();
  const stmt = db.prepare(`
    SELECT * FROM projects ORDER BY created_at DESC
  `);
  
  return stmt.all() as Project[];
}

export function getProjectById(id: string): Project | null {
  const db = getDb();
  const stmt = db.prepare(`
    SELECT * FROM projects WHERE id = ?
  `);
  
  return (stmt.get(id) as Project) || null;
}

export function deleteProject(id: string): boolean {
  const db = getDb();
  const stmt = db.prepare(`
    DELETE FROM projects WHERE id = ?
  `);
  
  try {
    stmt.run(id);
    return true;
  } catch (error) {
    console.error("Error deleting project:", error);
    return false;
  }
}

export function updateProject(id: string, updates: Partial<Project>): boolean {
  const db = getDb();
  const allowedFields = ["name", "description", "wallet", "link", "volume", "txs"];
  const fields = Object.keys(updates).filter(key => allowedFields.includes(key));
  
  if (fields.length === 0) return true;

  const setClause = fields.map(field => `${field} = ?`).join(", ");
  const values = fields.map(field => (updates as any)[field]);
  
  const stmt = db.prepare(`
    UPDATE projects SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?
  `);
  
  try {
    stmt.run(...values, id);
    return true;
  } catch (error) {
    console.error("Error updating project:", error);
    return false;
  }
}
