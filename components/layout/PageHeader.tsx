/**
 * 页面头部组件
 */

import { ReactNode } from "react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

interface PageHeaderProps {
  statusText?: string;
  children?: ReactNode;
}

export function PageHeader({ statusText, children }: PageHeaderProps) {
  return (
    <header
      className="h-16 border-b flex items-center justify-between px-6 md:px-8 sticky top-0 z-40"
      style={{
        borderColor: 'var(--border-color)',
        backgroundColor: 'rgba(10, 10, 10, 0.8)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
        ⚡️ Vibe Coding Mode:{' '}
        <span style={{ color: 'var(--success-color)', fontWeight: 'bold' }}>
          {statusText || 'ON'}
        </span>
      </span>
      <div className="flex gap-4 items-center">
        {children}
        <LanguageSwitcher />
        <div
          className="w-8 h-8 rounded-full"
          style={{
            background:
              'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
          }}
        ></div>
      </div>
    </header>
  );
}
