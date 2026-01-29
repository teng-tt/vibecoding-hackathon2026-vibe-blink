/**
 * Sidebar 布局组件
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18nContext";
import { Navigation } from "@/components/ui/Navigation";

export function SidebarLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { t } = useI18n();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 z-50"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border-color)',
        }}
      >
        <div className="p-6">
          <h1
            className="text-2xl font-bold"
            style={{
              background:
                'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {t.sidebar.title}
          </h1>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            {t.sidebar.subtitle}
          </p>
        </div>

        <Navigation />

        {/* Bottom Status Bar */}
        <div
          className="p-4"
          style={{ borderTop: '1px solid var(--border-color)' }}
        >
          <div
            className="rounded p-3"
            style={{
              backgroundColor: 'rgba(10, 10, 10, 0.5)',
              border: '1px solid var(--border-color)',
            }}
          >
            <div className="flex items-center justify-between text-xs mb-2">
              <span style={{ color: 'var(--text-muted)' }}>{t.nav.network}</span>
              <span
                className="font-mono"
                style={{ color: 'var(--success-color)' }}
              >
                ● {t.nav.devnet}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span style={{ color: 'var(--text-muted)' }}>{t.nav.wallet}</span>
              <span
                className="font-mono"
                style={{ color: 'var(--text-secondary)' }}
              >
                {t.nav.notConnected}
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      {children}

      {/* Mobile Bottom Navigation */}
      <Navigation />
    </>
  );
}
