"use client";

import { useEffect } from "react";
import Sidebar from "./Sidebar";
import { I18nProvider } from "@/lib/i18nContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { initializeDatabase } from "@/lib/db";

export default function RootLayoutClient({ children }: { children: React.ReactNode }) {
  // 在客户端挂载时初始化数据库
  useEffect(() => {
    // 仅在浏览器中执行一次
    const initDB = async () => {
      try {
        await initializeDatabase();
      } catch (error) {
        console.error("Database initialization error:", error);
      }
    };
    initDB();
  }, []); // 仅在组件挂载时执行一次

  return (
    <I18nProvider>
      <div className="flex min-h-screen">
        {/* 侧边栏 */}
        <Sidebar />

        {/* 主内容区域 - 留出左侧和底部的空隙 */}
        <main className="flex-1 md:ml-64 pb-24 md:pb-0 relative">
          {/* 顶部统一 Header */}
          <header className="h-16 border-b flex items-center justify-between px-6 md:px-8 sticky top-0 z-40" style={{ borderColor: 'var(--border-color)', backgroundColor: 'rgba(10, 10, 10, 0.8)', backdropFilter: 'blur(8px)' }}>
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>⚡️ Vibe Coding Mode: <span style={{ color: 'var(--success-color)', fontWeight: 'bold' }}>ON</span></span>
            <div className="flex gap-4 items-center">
              <LanguageSwitcher />
              <div className="w-8 h-8 rounded-full" style={{ background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))' }}></div>
            </div>
          </header>

          {/* 页面内容注入点 */}
          <div className="p-6 md:p-12">
            {children}
          </div>
        </main>
      </div>
    </I18nProvider>
  );
}
