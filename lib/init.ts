/**
 * 数据库初始化启动文件
 * 在应用启动时调用，确保数据库表存在
 */

import { initializeDatabase } from "@/lib/db";

// 应用启动时初始化数据库（仅执行一次）
export async function initializeApp() {
  try {
    console.log("🚀 Initializing application...");
    await initializeDatabase();
    console.log("✅ Application initialized successfully");
  } catch (error) {
    console.error("❌ Failed to initialize application:", error);
    // 不抛出错误，允许应用继续运行，但记录警告
    if (error instanceof Error) {
      console.error("Details:", error.message);
    }
  }
}

// 如果直接运行此文件
if (require.main === module) {
  initializeApp().catch(console.error);
}
