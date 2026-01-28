"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18nContext";

export function DashboardClient() {
  const { t } = useI18n();

  return (
    <div className="max-w-5xl mx-auto">
      {/* 欢迎语 */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-2">{t.dashboard.welcome}</h1>
        <p style={{ color: 'var(--text-muted)' }}>{t.dashboard.subtitle}</p>
      </div>

      {/* 核心数据卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="card relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">🔥</div>
          <h3 className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>{t.dashboard.totalBlinks}</h3>
          <p className="text-3xl font-bold mt-2">1,024</p>
          <div className="text-xs mt-2" style={{ color: 'var(--success-color)' }}>{t.dashboard.increase}</div>
        </div>
        <div className="card relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">💰</div>
          <h3 className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>{t.dashboard.volume}</h3>
          <p className="text-3xl font-bold mt-2">420.69</p>
          <div className="text-xs mt-2" style={{ color: 'var(--success-color)' }}>{t.dashboard.allTimeHigh}</div>
        </div>
        <div className="card relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">✨</div>
          <h3 className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>{t.dashboard.vibeScore}</h3>
          <p className="text-3xl font-bold mt-2" style={{ color: 'var(--primary-color)' }}>99.9</p>
          <div className="text-xs mt-2" style={{ color: 'var(--primary-color)', opacity: 0.6 }}>{t.dashboard.maximumVibe}</div>
        </div>
      </div>

      {/* 快捷入口 */}
      <h2 className="text-xl font-bold mb-6">{t.dashboard.quickActions}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/create" className="group">
          <div className="card h-full transition-all hover:border-purple-500 group-hover:scale-105" style={{ background: 'linear-gradient(135deg, rgba(107, 70, 193, 0.15) 0%, rgba(22, 33, 62, 0.5) 100%)', borderColor: 'var(--primary-color)', borderWidth: '1px' }}>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-2xl group-hover:scale-110 transition" style={{ backgroundColor: 'var(--primary-color)', opacity: 0.8 }}>
              🛠
            </div>
            <h3 className="text-2xl font-bold mb-2">{t.dashboard.createNewBlink}</h3>
            <p style={{ color: 'var(--text-muted)' }}>
              {t.dashboard.createDesc}
            </p>
          </div>
        </Link>

        <Link href="/showcase" className="group">
          <div className="card h-full transition-all hover:border-blue-500 group-hover:scale-105" style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(22, 33, 62, 0.5) 100%)', borderColor: 'var(--accent-color)', borderWidth: '1px' }}>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-2xl group-hover:scale-110 transition" style={{ backgroundColor: 'var(--accent-color)', opacity: 0.8 }}>
              🌍
            </div>
            <h3 className="text-2xl font-bold mb-2">{t.dashboard.exploreEcosystem}</h3>
            <p style={{ color: 'var(--text-muted)' }}>
              {t.dashboard.exploreDesc}
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
