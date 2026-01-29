"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18nContext";

export default function CreateProject() {
  const { t } = useI18n();
  const [formData, setFormData] = useState({
    name: "",
    desc: "",
    wallet: "",
  });
  const [generatedLink, setGeneratedLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleGenerate = async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      // 获取当前网站的基础域名
      const baseUrl = window.location.origin;
      
      // 构建 API 参数
      const params = new URLSearchParams({
        name: formData.name || "未命名项目",
        desc: formData.desc || "来自 Solana Hackathon 的新项目",
        wallet: formData.wallet || "你的默认钱包地址",
      });

      // 组合成 Dial.to 的深层链接
      const actionUrl = `${baseUrl}/api/actions/multitool?${params.toString()}`;
      const finalLink = `https://dial.to/?action=solana-action:${encodeURIComponent(actionUrl)}&cluster=devnet`;

      // 调用 API 保存项目到数据库
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: `project-${Date.now()}`,
          name: formData.name || "未命名项目",
          description: formData.desc || "来自 Solana Hackathon 的新项目",
          wallet: formData.wallet || "你的默认钱包地址",
          link: finalLink,
          volume: (Math.random() * 100).toFixed(1),
          txs: Math.floor(Math.random() * 500),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
        const errorMsg = errorData.details || errorData.error || "Failed to save project";
        throw new Error(errorMsg);
      }

      setGeneratedLink(finalLink);
      setErrorMessage("");
    } catch (error) {
      console.error("Error generating project:", error);
      const msg = error instanceof Error ? error.message : "生成项目失败，请重试";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="max-w-2xl mx-auto card p-8 shadow-2xl">
        <h1 className="text-3xl font-bold mb-6" style={{ background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          {t.create.title}
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          {t.create.subtitle}
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>{t.create.projectName}</label>
            <input
              type="text"
              placeholder={t.create.projectNamePlaceholder}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>{t.create.projectDesc}</label>
            <input
              type="text"
              placeholder={t.create.projectDescPlaceholder}
              value={formData.desc}
              onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>{t.create.walletAddress}</label>
            <input
              type="text"
              placeholder={t.create.walletPlaceholder}
              value={formData.wallet}
              onChange={(e) => setFormData({ ...formData, wallet: e.target.value })}
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="btn btn-primary w-full font-bold py-3 rounded mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "生成中..." : t.create.generateBtn}
          </button>
        </div>

        {errorMessage && (
          <div className="mt-6 p-4 rounded border" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: '#ef4444', borderWidth: '1px' }}>
            <h3 className="font-bold mb-2" style={{ color: '#ef4444' }}>❌ 错误</h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {errorMessage}
            </p>
            <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
              💡 提示：请确保在 Vercel 环境变量中已设置 POSTGRES_URL 或 POSTGRES_URL_NON_POOLING
            </p>
          </div>
        )}

        {generatedLink && (
          <div className="mt-8 p-4 rounded border" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', borderColor: 'var(--success-color)', borderWidth: '1px' }}>
            <h3 className="font-bold mb-2" style={{ color: 'var(--success-color)' }}>{t.create.success}</h3>
            <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>{t.create.successDesc}</p>
            <div className="p-3 rounded break-all text-sm font-mono" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-secondary)', userSelect: 'all' }}>
              {generatedLink}
            </div>
            <a
              href={generatedLink}
              target="_blank"
              rel="noreferrer"
              className="block text-center mt-4 text-sm transition-colors"
              style={{ color: 'var(--primary-color)' }}
            >
              {t.create.preview}
            </a>
          </div>
        )}
      </div>
  );
}