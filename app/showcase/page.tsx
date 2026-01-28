"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18nContext";

// 预埋的“热门项目”数据 (假装社区很活跃)
const MOCK_PROJECTS = [
  {
    id: "mock-1",
    name: "Pedro's Pizza DAO",
    desc: "给 Solana 基金会开发者买披萨的专项基金。",
    volume: 125.4,
    txs: 420,
    link: "#", // 实际交互时会动态生成
    wallet: "Pedro..."
  },
  {
    id: "mock-2",
    name: "Solana Vibe Check",
    desc: "检测你的钱包含金量，不够 Degen 不许入内。",
    volume: 88.2,
    txs: 69,
    link: "#",
    wallet: "Vibe..."
  },
  {
    id: "mock-3",
    name: "Cat Detachment Force",
    desc: "为了对抗 Dog Coin 而建立的猫咪联盟。",
    volume: 450.1,
    txs: 1337,
    link: "#",
    wallet: "Meow..."
  },
];

export default function Showcase() {
  const { t } = useI18n();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        // 从数据库获取用户创建的项目
        const response = await fetch("/api/projects");
        const dbProjects = await response.json();
        
        const baseUrl = window.location.origin;
        
        // 为 Mock 项目生成 Dial.to 链接
        const enrichedMockProjects = MOCK_PROJECTS.map(p => {
          const params = new URLSearchParams({
            name: p.name,
            desc: p.desc,
            wallet: "你的收款地址"
          });
          const actionUrl = `${baseUrl}/api/actions/multitool?${params.toString()}`;
          return {
            ...p,
            link: `https://dial.to/?action=solana-action:${encodeURIComponent(actionUrl)}&cluster=devnet`
          };
        });

        // 合并数据库项目和 Mock 项目
        setProjects([...dbProjects, ...enrichedMockProjects]);
      } catch (error) {
        console.error("Error fetching projects:", error);
        // 即使出错也显示 Mock 项目
        const baseUrl = window.location.origin;
        const enrichedMockProjects = MOCK_PROJECTS.map(p => {
          const params = new URLSearchParams({
            name: p.name,
            desc: p.desc,
            wallet: "你的收款地址"
          });
          const actionUrl = `${baseUrl}/api/actions/multitool?${params.toString()}`;
          return {
            ...p,
            link: `https://dial.to/?action=solana-action:${encodeURIComponent(actionUrl)}&cluster=devnet`
          };
        });
        setProjects(enrichedMockProjects);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
      <div className="max-w-6xl mx-auto">
        
        {/* 头部导航 */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold" style={{ background: 'linear-gradient(135deg, var(--success-color), var(--accent-color))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {t.showcase.title}
            </h1>
            <p className="mt-2" style={{ color: 'var(--text-muted)' }}>
              {t.showcase.stats} {420 + projects.length} {t.showcase.blinks} • {t.showcase.volume} {(1024.5 + projects.length * 0.1).toFixed(2)} SOL
            </p>
          </div>
          <Link href="/create">
            <button className="btn btn-primary font-bold py-3 px-6 rounded-full">
              {t.showcase.newProject}
            </button>
          </Link>
        </div>

        {/* 项目网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p, index) => (
            <div key={p.id} className="card rounded-xl overflow-hidden hover:border-purple-500 transition-all hover:shadow-2xl hover:shadow-purple-900/20 group" style={{ borderColor: 'var(--border-color)', padding: 0 }}>
              
              {/* 动态封面图 */}
              <div className="h-32 relative overflow-hidden" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                <img 
                    src={`https://placehold.co/600x400/1e1e1e/FFFFFF/png?text=${encodeURIComponent(p.name)}`}
                    alt={p.name}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition"
                />
                <div className="absolute top-2 right-2 px-2 py-1 rounded text-xs font-mono" style={{ backgroundColor: 'rgba(10, 10, 10, 0.6)', color: 'var(--success-color)' }}>
                  {t.showcase.liveOnDevnet}
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold truncate pr-2">{p.name}</h3>
                </div>
                
                <p className="text-sm h-10 line-clamp-2 mb-4" style={{ color: 'var(--text-muted)' }}>
                  {p.desc}
                </p>

                {/* 假数据统计 */}
                <div className="grid grid-cols-2 gap-4 mb-6 p-3 rounded-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
                    <div>
                        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{t.showcase.totalVolume}</div>
                        <div className="font-mono font-bold" style={{ color: 'var(--success-color)' }}>◎ {p.volume || (Math.random() * 100).toFixed(1)}</div>
                    </div>
                    <div>
                        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{t.showcase.interactions}</div>
                        <div className="font-mono font-bold" style={{ color: 'var(--accent-color)' }}>{p.txs || Math.floor(Math.random() * 500)}</div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <a 
                        href={p.link} 
                        target="_blank" 
                        className="flex-1 text-center py-2 rounded font-bold transition flex items-center justify-center gap-2"
                        style={{ backgroundColor: 'var(--primary-color)', color: 'var(--text-primary)' }}
                    >
                        <span>{t.showcase.interact}</span>
                    </a>
                    
                    {/* Share Button */}
                    <a
                        href={`https://twitter.com/intent/tweet?text=Check out ${p.name} on Solana!&url=${encodeURIComponent(p.link)}`}
                        target="_blank"
                        className="px-3 rounded flex items-center justify-center transition"
                        style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
                    >
                        🐦
                    </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
  );
}