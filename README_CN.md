# 🚀 Vibe Blink Factory

**零代码生成 Solana Blinks 的工厂** — 一个强大的Blinks无代码生成平台，让任何人都能在 10 秒内为项目生成专属的交互组件，并直接分享到推特，在推特进行零跳转直接交互！

![Solana](https://img.shields.io/badge/Solana-000000?style=for-the-badge&logo=solana&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

---

## ✨ 核心特性

### ✅ No-Code（零代码）
- 填写简单的表单即刻生成
- 无需任何编程知识
- 支持中英文界面

### ✅ Dynamic（动态多功能）
- **评分系统** — 用户为项目评分（1-5 分）
- **打赏系统** — 支持 SOL 转账打赏
- **预测冠军** — 用户预测谁是项目冠军
- 单一 API 处理所有逻辑

### ✅ Persistence（数据持久化）
- 基于 **Vercel Postgres** 的可靠数据存储
- 项目信息实时同步
- 历史数据完整追踪

### ✅ Shareable（社交分享）
- 一键生成 Solana Actions 链接
- 通过 **Dialect** 直接交互
- Twitter / X 完美适配

---

## 🌐 赛道信息

- **赛道**: Consumer & Entertainment / Alpha Tools
- **网络**: Solana Devnet（请切换钱包测试）
- **2026 Solana Vibe Coding Hackathon** 官方参赛项目

---

## 📋 功能概览

### 🎯 三大功能模块

#### 1️⃣ **Blinks 生成工厂** (`/create`)
在短短 10 秒内，轻松创建属于你的交互组件：
- 输入项目名称
- 添加项目描述
- 设置钱包地址
- 一键生成 Solana Actions 链接
- 获得 Dialect 深层链接用于推特分享

**样例生成流程**:
```
输入表单数据
   ↓
调用 /api/actions/multitool
   ↓
构建 Solana Actions URL
   ↓
生成 Dialect 分享链接
   ↓
保存到 Vercel Postgres
```

#### 2️⃣ **Vibe 生态展示** (`/showcase`)
探索社区项目与预测冠军：
- 实时显示所有生成的 Blinks
- 显示交互统计（交易量、交互次数、预测投票）
- 支持直接在页面中测试
- 排序与过滤功能

#### 3️⃣ **仪表板** (`/`)
一览无遗的项目管理中心：
- 📊 实时统计数据（总 Blinks、总交易量、Vibe 评分）
- 🔥 热门项目推荐
- ⚡️ 快速入口导航
- 💰 收益追踪

---

## 🛠 技术栈

### 前端
- **Next.js 16** — React 同构框架
- **React 19** — UI 组件库
- **TypeScript** — 类型安全
- **Tailwind CSS 4** — 样式框架

### 后端
- **Next.js API Routes** — RESTful API
- **Vercel Postgres** — 关系型数据库
- **Solana Web3.js** — 区块链交互
- **Solana Actions** — 标准 Actions 实现

### 部署
- **Vercel** — 一键部署
- **Solana Devnet** — 测试网络

---

## 🚀 快速开始

### 前置要求
- Node.js 18+
- npm / yarn / pnpm
- Solana 钱包（推荐 Phantom）
- Vercel 账号（可选，用于数据库）

### 安装步骤

#### 1. 克隆仓库
```bash
git clone https://github.com/teng-tt/vibecoding-hackathon2026-vibe-blink
cd vibe-blink
```

#### 2. 安装依赖
```bash
npm install
# 或
yarn install
# 或
pnpm install
```

#### 3. 配置环境变量

复制 `.env.local.example` 到 `.env.local`：
```bash
cp .env.local.example .env.local
```

在 `.env.local` 中填写你的 Postgres 连接信息：
```env
# Vercel Postgres 连接配置
# 从 Vercel Dashboard 获取以下信息：
# 1. 进入 Projects -> 选择你的项目
# 2. 进入 Storage 选项卡
# 3. 创建新的 Postgres 数据库或使用现有的
# 4. 点击数据库，复制连接字符串

POSTGRES_URL=postgresql://user:password@host:5432/database
POSTGRES_URL_NON_POOLING=postgresql://user:password@host:5432/database
```

#### 4. 初始化数据库

在 `/app/api/projects/route.ts` 中首次调用时会自动初始化，或手动运行：

```bash
npm run db:init
```

#### 5. 启动开发服务器
```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

---

## 📚 API 文档

### 核心 API 端点

#### `GET/POST /api/projects`
获取或创建项目

**请求示例**:
```bash
# 获取所有项目
curl http://localhost:3000/api/projects

# 创建项目
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "id": "project-123",
    "name": "My Awesome Project",
    "description": "A cool Solana project",
    "wallet": "YourSolanaWallet...",
    "link": "https://dial.to/?action=solana-action:...",
    "volume": 100.5,
    "txs": 42
  }'
```

#### `GET /api/actions/multitool`
获取 Solana Actions 元数据

**URL 参数**:
- `name` — 项目名称
- `desc` — 项目描述
- `wallet` — 钱包地址
- `action` — 操作类型（`nav_menu`, `tx_rate`, `tx_tip`, `tx_predict`）

**响应示例**:
```json
{
  "type": "action",
  "icon": "https://...",
  "title": "🌟 评价: My Project",
  "description": "A cool Solana project",
  "label": "Rate",
  "links": {
    "actions": [
      {
        "type": "post",
        "label": "1分",
        "href": "https://..."
      }
    ]
  }
}
```

#### `POST /api/actions/multitool`
执行交易操作

**支持的操作**:
- `tx_rate` — 提交评分
- `tx_tip` — 发送打赏
- `tx_predict` — 预测项目冠军

---

## 📂 项目结构

```
vibe-blink/
├── app/                              # Next.js 应用目录
│   ├── DashboardClient.tsx          # 仪表板组件
│   ├── Sidebar.tsx                  # 侧边栏导航
│   ├── RootLayoutClient.tsx         # 根布局客户端
│   ├── layout.tsx                   # 根布局
│   ├── page.tsx                     # 首页
│   ├── globals.css                  # 全局样式
│   ├── create/
│   │   └── page.tsx                 # Blinks 生成工厂页面
│   ├── showcase/
│   │   └── page.tsx                 # 生态展示页面
│   └── api/
│       ├── actions/
│       │   └── multitool/
│       │       └── route.ts         # Solana Actions 处理核心
│       └── projects/
│           └── route.ts             # 项目管理 API
├── lib/
│   ├── db.ts                        # 数据库操作函数
│   ├── i18n.ts                      # 国际化翻译资源
│   └── i18nContext.tsx              # i18n 上下文提供者
├── components/
│   └── LanguageSwitcher.tsx         # 语言切换器
├── public/                          # 静态资源
├── package.json                     # 项目依赖
├── tsconfig.json                    # TypeScript 配置
├── next.config.ts                   # Next.js 配置
├── tailwind.config.ts               # Tailwind 配置
└── .env.local.example               # 环境变量模板
```

---

## 🔄 工作流程

### 用户生成 Blink 的完整流程

```
┌─────────────────────────────────────┐
│  用户访问 /create                    │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  填写表单                            │
│  - 项目名称                         │
│  - 项目描述                         │
│  - 钱包地址                         │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  点击"生成 Blinks 链接"              │
│  调用 handleGenerate()              │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  构建 API 参数并调用                  │
│  /api/actions/multitool             │
│  生成 Solana Actions URL             │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  通过 /api/projects POST             │
│  将项目保存到 Postgres              │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  返回 Dialect 深层链接               │
│  https://dial.to/?action=...         │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  用户复制链接分享到推特              │
│  其他用户点击可直接交互              │
└─────────────────────────────────────┘
```

### 用户交互 Blink 的完整流程

```
┌──────────────────────────────────┐
│  用户在推特点击 Blinks           │
└──────────────┬───────────────────┘
               │
               ▼
┌──────────────────────────────────┐
│  Dialect 解析 Actions URL         │
│  显示可用操作选项                │
└──────────────┬───────────────────┘
               │
               ▼
┌──────────────────────────────────┐
│  用户选择操作                    │
│  - 评分 (1-5 分)               │
│  - 打赏 (SOL 转账)             │
│  - 预测冠军 (预测项目冠军)      │
└──────────────┬───────────────────┘
               │
               ▼
┌──────────────────────────────────┐
│  Dialect 调用                    │
│  /api/actions/multitool (POST)   │
│  传递用户操作和签名              │
└──────────────┬───────────────────┘
               │
               ▼
┌──────────────────────────────────┐
│  后端处理交易                    │
│  - 生成交易指令                 │
│  - 返回序列化交易               │
└──────────────┬───────────────────┘
               │
               ▼
┌──────────────────────────────────┐
│  用户钱包（Phantom等）签名        │
│  返回签名的交易                  │
└──────────────┬───────────────────┘
               │
               ▼
┌──────────────────────────────────┐
│  后端广播交易到 Devnet           │
│  等待交易确认                    │
└──────────────┬───────────────────┘
               │
               ▼
┌──────────────────────────────────┐
│  交易成功                        │
│  返回交易签名给用户              │
└──────────────────────────────────┘
```

---

## 🌍 国际化（i18n）

项目支持完整的**中英文**双语界面：

### 支持的语言
- 🇨🇳 简体中文 (zh)
- 🇺🇸 English (en)

### 翻译文件位置
[lib/i18n.ts](lib/i18n.ts) — 包含所有 UI 文本的翻译

### 使用方式
```tsx
import { useI18n } from "@/lib/i18nContext";

export default function MyComponent() {
  const { t } = useI18n();
  return <h1>{t.dashboard.welcome}</h1>;
}
```

---

## 🔧 开发指南

### 添加新的 Actions 操作

在 [app/api/actions/multitool/route.ts](app/api/actions/multitool/route.ts) 中：

```typescript
// 1. 在 getMetadata 中添加新的模式
if (mode === "new_action") {
  return {
    type: "action",
    title: "New Action",
    links: {
      actions: [
        { type: "post", label: "Action 1", href: "..." },
      ],
    },
  };
}

// 2. 在 POST 处理器中实现业务逻辑
if (action === "tx_new_action") {
  // 构建交易指令
  // 返回交易
}
```

### 添加新页面

1. 在 `app/` 目录下创建新文件夹
2. 添加 `page.tsx` 文件
3. 导入 `useI18n` hook 获取翻译
4. 在 [lib/i18n.ts](lib/i18n.ts) 中添加翻译文本

### 修改数据库模式

编辑 [lib/db.ts](lib/db.ts) 中的 `initializeDatabase()` 函数：

```typescript
export async function initializeDatabase() {
  await sql`
    CREATE TABLE IF NOT EXISTS your_table (
      id TEXT PRIMARY KEY,
      -- 添加你的字段
    )
  `;
}
```

---

## 📊 数据库架构

### Projects 表

```sql
CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  wallet TEXT,
  link TEXT,
  volume NUMERIC,
  txs INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**字段说明**:
- `id` — 项目唯一标识
- `name` — 项目名称
- `description` — 项目描述
- `wallet` — 项目方钱包地址
- `link` — 生成的 Solana Actions 链接
- `volume` — 交易总额 (SOL)
- `txs` — 交易次数
- `created_at` — 创建时间
- `updated_at` — 更新时间

---

## 🧪 测试

### 本地测试

确保钱包网络设置为 **Devnet**：

```bash
# 1. 启动开发服务器
npm run dev

# 2. 打开浏览器
http://localhost:3000

# 3. 测试 Blinks 生成
- 进入 /create
- 填写表单
- 生成链接

# 4. 测试 Blinks 交互
- 进入 /showcase
- 点击"交互"按钮
- 在 Dialect 中完成交易
```

### 网络验证

在 Solana Explorer 上验证交易：
- Devnet: [https://explorer.solana.com/?cluster=devnet](https://explorer.solana.com/?cluster=devnet)

---

## 🚀 部署

### 部署到 Vercel

这是推荐的部署方式（内置 Postgres 支持）：

#### 1. 连接 GitHub 仓库
```bash
git push origin main
```

#### 2. 在 Vercel 中创建项目
- 访问 [vercel.com](https://vercel.com)
- 点击 "New Project"
- 选择你的 GitHub 仓库
- 点击 "Import"

#### 3. 配置环境变量
在 Vercel Dashboard 中，设置以下环境变量：
```
POSTGRES_URL=postgresql://user:password@host:5432/database
POSTGRES_URL_NON_POOLING=postgresql://user:password@host:5432/database
```

#### 4. 部署
```bash
# Vercel 会自动部署你的主分支
# 后续所有推送都会自动部署
```

### 部署到其他平台

需要 Node.js 18+ 的任何平台都支持，如：
- Railway
- Render
- Fly.io
- 自托管服务器

---

## 📝 环境变量

### 必需变量

| 变量名 | 描述 | 示例 |
|--------|------|------|
| `POSTGRES_URL` | Postgres 连接字符串（含密码） | `postgresql://user:pass@host:5432/db` |
| `POSTGRES_URL_NON_POOLING` | Postgres 非池化连接字符串 | `postgresql://user:pass@host:5432/db` |

### 可选变量

| 变量名 | 描述 | 默认值 |
|--------|------|--------|
| `NEXT_PUBLIC_SOLANA_NETWORK` | Solana 网络 | `devnet` |
| `NEXT_PUBLIC_APP_NAME` | 应用名称 | `Vibe Blink Factory` |

---

## 🐛 故障排查

### 数据库连接错误
```
错误: Failed to initialize database
```
**解决方案**:
1. 检查 `.env.local` 中的连接字符串是否正确
2. 确保 Vercel Postgres 数据库在线
3. 尝试使用非池化连接字符串 (`POSTGRES_URL_NON_POOLING`)

### Solana Actions 链接失效
```
错误: Invalid action URL
```
**解决方案**:
1. 检查应用是否在 HTTPS 上运行（Solana Actions 要求）
2. 验证 URL 参数编码是否正确
3. 在 Dialect 中手动测试链接

### 交易失败
```
错误: Transaction simulation failed
```
**解决方案**:
1. 确保钱包在 Devnet 上有足够的 SOL
2. 检查后端日志获取详细错误信息
3. 验证交易指令构建是否正确

---

## 📚 相关资源

### Solana 文档
- [Solana Actions](https://solana.com/developers/guides/solana-actions) — Actions 标准文档
- [Solana Web3.js](https://solana-labs.github.io/solana-web3.js/) — Web3.js API 参考
- [Solana Cookbook](https://solanacookbook.com/) — 开发技巧和示例

### 工具和服务
- [Dialect](https://www.dialect.to/) — Actions 执行引擎
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) — 数据库文档
- [Phantom Wallet](https://phantom.app/) — Solana 钱包

### 社区
- [Solana GitHub](https://github.com/solana-labs)
- [Solana Discord](https://discord.gg/solana)
- [Solana Twitter](https://twitter.com/solana)

---

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

### 贡献步骤
1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

---

## 👥 致谢

感谢以下项目和团队的支持：

- 🎯 **Solana Labs** — 提供 Solana Actions 标准和生态
- 🚀 **Vercel** — 提供 Next.js 框架和数据库服务
- 💬 **Dialect** — 提供 Actions 执行引擎
- 🏆 **2026 Solana Vibe Coding Hackathon** — 官方赛事支持
- 🌍 **Solana 中文社区** — 社区支持和反馈

特别感谢：
- [@trendsdotfun](https://twitter.com/trendsdotfun)
- [@solana_zh](https://twitter.com/solana_zh)
- [@Pedromiranda](https://twitter.com/Pedromiranda)
- [@mablemeibao](https://twitter.com/mablemeibao)
- [@0xSunNFT](https://twitter.com/0xSunNFT)

---

## 📧 联系方式

有任何问题或建议？

- 📝 GitHub Issues: [提交 Issue](https://github.com/teng-tt/vibecoding-hackathon2026-vibe-blink/issues)
- 💌 Email: davidthx1@gmail.com
- 🐦 Twitter: [@YourHandle](https://x.com/ttt81082918)

---

## 🎮 快速链接

| 功能 | 链接 | 描述 |
|------|------|------|
| 🏠 仪表板 | `/` | 项目管理中心 |
| ⚡ 生成工厂 | `/create` | 创建新的 Blinks |
| 🌍 生态展示 | `/showcase` | 浏览社区项目 |
| 🔗 API 文档 | `/api/projects` | REST API 端点 |
| 📊 Actions | `/api/actions/multitool` | Solana Actions 处理 |

---

**Made with ❤️ for the Solana ecosystem** 🚀

⚡️ Vibe Coding Challenge 2026 | #Solana #VibeCoding #Blinks #BuildInPublic
