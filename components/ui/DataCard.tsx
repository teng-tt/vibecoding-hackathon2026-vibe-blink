/**
 * 数据卡片组件
 */

import React from "react";

interface DataCardProps {
  label: string;
  value: string | number;
  emoji: string;
  trend?: {
    label: string;
    color: string;
  };
}

export function DataCard({ label, value, emoji, trend }: DataCardProps) {
  return (
    <div className="card relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">{emoji}</div>
      <h3 className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
        {label}
      </h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
      {trend && (
        <div className="text-xs mt-2" style={{ color: trend.color }}>
          {trend.label}
        </div>
      )}
    </div>
  );
}
