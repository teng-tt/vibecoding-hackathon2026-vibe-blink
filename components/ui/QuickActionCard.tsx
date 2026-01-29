/**
 * 快捷入口卡片组件
 */

import Link from "next/link";

interface QuickActionCardProps {
  title: string;
  description: string;
  emoji: string;
  href: string;
  gradient?: {
    from: string;
    to: string;
  };
}

export function QuickActionCard({
  title,
  description,
  emoji,
  href,
  gradient,
}: QuickActionCardProps) {
  return (
    <Link href={href} className="group">
      <div
        className="card h-full transition-all hover:border-purple-500 group-hover:scale-105"
        style={{
          background: gradient
            ? `linear-gradient(135deg, ${gradient.from} 0%, ${gradient.to} 100%)`
            : 'linear-gradient(135deg, rgba(107, 70, 193, 0.15) 0%, rgba(22, 33, 62, 0.5) 100%)',
          borderColor: 'var(--primary-color)',
          borderWidth: '1px',
        }}
      >
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-2xl group-hover:scale-110 transition"
          style={{
            backgroundColor: 'var(--primary-color)',
            opacity: 0.8,
          }}
        >
          {emoji}
        </div>
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <p style={{ color: 'var(--text-muted)' }}>{description}</p>
      </div>
    </Link>
  );
}
