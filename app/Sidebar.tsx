"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18nContext";

export default function Sidebar() {
  const pathname = usePathname();
  const { t } = useI18n();

  const navItems = [
    { name: t.nav.dashboard, path: "/", icon: "⚡️" },
    { name: t.nav.factory, path: "/create", icon: "🛠" },
    { name: t.nav.showcase, path: "/showcase", icon: "🌍" },
  ];

  return (
    <>
      <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 z-50" style={{ backgroundColor: 'var(--bg-secondary)', borderRight: '1px solid var(--border-color)' }}>
        <div className="p-6">
          <h1 className="text-2xl font-bold" style={{ background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {t.sidebar.title}
          </h1>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{t.sidebar.subtitle}</p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link key={item.path} href={item.path}>
                <div
                  className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer"
                  style={{
                    backgroundColor: isActive ? 'rgba(107, 70, 193, 0.15)' : 'transparent',
                    color: isActive ? 'var(--primary-color)' : 'var(--text-muted)',
                    border: isActive ? '1px solid var(--primary-color)' : '1px solid transparent'
                  }}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* 底部状态栏 */}
        <div className="p-4" style={{ borderTop: '1px solid var(--border-color)' }}>
          <div className="rounded p-3" style={{ backgroundColor: 'rgba(10, 10, 10, 0.5)', border: '1px solid var(--border-color)' }}>
            <div className="flex items-center justify-between text-xs mb-2">
              <span style={{ color: 'var(--text-muted)' }}>{t.nav.network}</span>
              <span className="font-mono" style={{ color: 'var(--success-color)' }}>● {t.nav.devnet}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span style={{ color: 'var(--text-muted)' }}>{t.nav.wallet}</span>
              <span className="font-mono" style={{ color: 'var(--text-secondary)' }}>{t.nav.notConnected}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* === Mobile Bottom Nav === */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-around p-3 pb-6" style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)' }}>
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link key={item.path} href={item.path}>
              <div className="flex flex-col items-center gap-1" style={{ color: isActive ? 'var(--primary-color)' : 'var(--text-muted)' }}>
                <span className="text-2xl">{item.icon}</span>
                <span className="text-[10px] font-bold">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>
    </>
  );
}