# SQLite 到 Vercel Postgres 迁移指南

## 迁移完成的更改

本项目已从 SQLite 数据库成功迁移到 Vercel Postgres。以下是所做的更改：

### 1. 包依赖更新 (package.json)
- ❌ 移除: `better-sqlite3` 和 `@types/better-sqlite3`
- ✅ 添加: `@vercel/postgres`

### 2. 数据库模块重构 (lib/db.ts)
- 将所有数据库函数转换为 **异步函数**
- 使用 `@vercel/postgres` 的 `sql` 标签函数进行类型安全的 SQL 查询
- 移除本地文件系统操作（SQLite 文件路径）
- 新增：`initializeDatabase()` 异步函数用于初始化表

### 3. API 路由更新 (app/api/projects/route.ts)
- 添加 `await` 关键字到所有数据库函数调用
- GET、POST、PUT、DELETE 方法都已更新

## 部署步骤

### 1. 安装新的依赖
```bash
npm install
```

### 2. 配置环境变量
在项目根目录创建 `.env.local` 文件：

```bash
# 复制 .env.local.example 作为模板
cp .env.local.example .env.local
```

编辑 `.env.local`，添加你的 Vercel Postgres 连接字符串：
```
POSTGRES_URL=postgresql://user:password@host:5432/database
POSTGRES_URL_NON_POOLING=postgresql://user:password@host:5432/database
```

**获取连接字符串的步骤：**
1. 访问 [Vercel Dashboard](https://vercel.com)
2. 选择你的项目
3. 进入 **Storage** 选项卡
4. 创建新的 Postgres 数据库或使用现有的
5. 点击数据库，复制连接字符串
6. 选择带密码的连接字符串（`POSTGRES_URL`）

### 3. 初始化数据库表
在项目中添加一个初始化脚本来创建表。可以在以下位置调用 `initializeDatabase()`:

```typescript
// 在你的应用启动时调用一次
import { initializeDatabase } from '@/lib/db';

await initializeDatabase();
```

或者在应用级别的布局中调用（仅在开发环境）：

```typescript
// app/layout.tsx (服务器组件)
import { initializeDatabase } from '@/lib/db';

// 仅在开发环境初始化
if (process.env.NODE_ENV === 'development') {
  try {
    await initializeDatabase();
  } catch (error) {
    // 表已存在的错误可以忽略
    if (!error.message?.includes('already exists')) {
      console.error('Failed to initialize database:', error);
    }
  }
}
```

### 4. 本地开发
```bash
npm run dev
```

### 5. 部署到 Vercel
```bash
# 推送到 GitHub（如果使用 Vercel 的 Git 集成）
git add .
git commit -m "chore: migrate from SQLite to Vercel Postgres"
git push

# 或者直接部署
vercel deploy
```

部署时，确保在 Vercel 项目设置中添加环境变量：
- `POSTGRES_URL` - Vercel 会自动创建，或手动添加

## 数据迁移（如有旧数据）

如果你已有本地 SQLite 数据库中的数据，需要迁移它们：

### 导出 SQLite 数据
```bash
# 使用 sqlite3 工具导出为 JSON 或 CSV
sqlite3 data/projects.db "SELECT * FROM projects;" > projects_backup.csv
```

### 导入到 Postgres
创建一个临时导入脚本：

```typescript
// scripts/migrate.ts
import { sql } from '@vercel/postgres';
import fs from 'fs';
import csv from 'csv-parser';

const rows = [];
fs.createReadStream('projects_backup.csv')
  .pipe(csv())
  .on('data', (row) => rows.push(row))
  .on('end', async () => {
    for (const row of rows) {
      await sql`
        INSERT INTO projects (id, name, description, wallet, link, volume, txs)
        VALUES (${row.id}, ${row.name}, ${row.description}, ${row.wallet}, ${row.link}, ${row.volume}, ${row.txs})
      `;
    }
    console.log('Migration completed');
  });
```

## 重要注意事项

1. **异步操作**: 所有数据库函数现在都是异步的，请确保在调用时使用 `await`
2. **错误处理**: 网络请求可能失败，确保实现了适当的错误处理和重试逻辑
3. **连接池**: Vercel Postgres 有连接池限制，生产环境中应该使用 `POSTGRES_URL_NON_POOLING` 用于长连接
4. **成本**: Vercel Postgres 是付费服务，请查看定价并确保在项目设置中添加支付方式

## 常见问题

**Q: 数据库表没有被创建？**
A: 确保在应用启动时调用了 `initializeDatabase()` 函数，并且环境变量正确配置。

**Q: 连接超时错误？**
A: 检查你的 Vercel Postgres 连接字符串是否正确，以及网络连接是否正常。

**Q: 旧的 SQLite 数据文件可以删除吗？**
A: 可以。迁移完成后，可以删除 `data/projects.db` 文件。

## 回滚计划

如果需要回滚到 SQLite:

```bash
# 恢复原始依赖
npm install better-sqlite3@12.6.2 --save
npm install @types/better-sqlite3 --save-dev

# 恢复原始 db.ts（保存备份）
git checkout HEAD -- lib/db.ts

# 恢复原始 API 路由
git checkout HEAD -- app/api/projects/route.ts
```

## 相关资源

- [Vercel Postgres 文档](https://vercel.com/docs/storage/postgres)
- [@vercel/postgres NPM 包](https://www.npmjs.com/package/@vercel/postgres)
- [Vercel 存储文档](https://vercel.com/docs/storage)
