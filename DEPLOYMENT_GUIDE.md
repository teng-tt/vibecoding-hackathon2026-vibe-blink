# Vercel 部署检查清单

## ✅ 部署前检查

### 1. 环境变量配置

在 Vercel Dashboard 中确保已设置以下环境变量：

```
POSTGRES_URL=postgresql://user:password@host:5432/database
POSTGRES_URL_NON_POOLING=postgresql://user:password@host:5432/database
```

**获取方式**:
1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 进入你的项目
3. 进入 `Settings` → `Environment Variables`
4. 添加以上两个环境变量

### 2. 数据库连接验证

在本地测试环境中验证连接：

```bash
# 1. 确保 .env.local 包含正确的 Postgres 连接字符串
cat .env.local | grep POSTGRES_URL

# 2. 运行开发服务器
npm run dev

# 3. 测试创建项目
# 访问 http://localhost:3000/create
# 填写表单并尝试生成项目
```

### 3. 构建验证

```bash
# 确保本地构建成功
npm run build

# 检查是否有 TypeScript 错误
npm run lint
```

---

## 🐛 故障排查

### 问题: "Error: Failed to save project"

**原因**: 数据库连接失败或环境变量未设置

**解决方案**:

#### 检查 1: 验证环境变量
```bash
# 1. 确保 Vercel Dashboard 中已设置环境变量
# 进入 Settings → Environment Variables

# 2. 验证变量值（不要显示完整密码）
# 检查连接字符串格式：postgresql://user:password@host:5432/database
```

#### 检查 2: 查看 Vercel 日志
```bash
# 1. 安装 Vercel CLI
npm install -g vercel

# 2. 登录 Vercel
vercel login

# 3. 查看实时日志
vercel logs [your-project-name] --follow
```

#### 检查 3: 重新部署
```bash
# 推送代码更改后，Vercel 会自动部署
git add .
git commit -m "Fix database error handling"
git push origin main

# 在 Vercel Dashboard 中监控部署进度
```

### 问题: "Database connection error: POSTGRES_URL not configured"

**原因**: 环境变量未正确设置

**解决方案**:

1. **在 Vercel Dashboard 中**:
   - 进入 `Settings` → `Environment Variables`
   - 检查是否同时有 `POSTGRES_URL` 和 `POSTGRES_URL_NON_POOLING`
   - 确保值不为空且格式正确

2. **验证连接字符串格式**:
   ```
   正确格式: postgresql://user:password@host:5432/database
   ❌ 错误格式: postgres://...（缺少 'sql'）
   ❌ 错误格式: mysql://...（错误的数据库类型）
   ```

3. **重新部署**:
   ```bash
   # 在 Vercel Dashboard 中点击 "Redeploy"
   # 或使用 CLI
   vercel deploy --prod
   ```

### 问题: "Table 'projects' does not exist"

**原因**: 数据库表初始化失败

**解决方案**:

1. **确保初始化代码正确执行**:
   - `initializeDatabase()` 现已在每个 API 端点中调用
   - 第一次请求会自动创建表

2. **手动初始化（可选）**:
   - 在 Vercel Postgres 管理界面中运行 SQL：
   ```sql
   CREATE TABLE IF NOT EXISTS projects (
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

---

## 📊 监控和调试

### 查看 Vercel 日志

```bash
# 安装 Vercel CLI
npm install -g vercel

# 查看实时日志
vercel logs your-project-name --follow

# 查看特定日期的日志
vercel logs your-project-name --since 1h
```

### 检查数据库连接

```bash
# 在项目中创建临时调试脚本（仅用于测试）
# 创建文件: lib/test-db.ts

import { initializeDatabase, addProject } from "./db";

export async function testDatabaseConnection() {
  try {
    await initializeDatabase();
    console.log("✅ Database connection successful");
    console.log("✅ Table created/verified");
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    return false;
  }
}
```

### API 测试

```bash
# 使用 curl 测试 API
curl -X POST https://your-app.vercel.app/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Project",
    "description": "Test Description",
    "wallet": "TEST_WALLET",
    "link": "https://example.com",
    "volume": 100,
    "txs": 10
  }'
```

---

## ✅ 部署成功验证

完成以下步骤确保部署成功：

- [ ] 环境变量已在 Vercel Dashboard 中设置
- [ ] `npm run build` 本地构建成功
- [ ] 代码已推送到 GitHub
- [ ] Vercel 部署完成（检查 Dashboard）
- [ ] 访问网站无 404 错误
- [ ] 能够访问 `/create` 页面
- [ ] 能够填写表单并提交
- [ ] 项目已成功保存到数据库
- [ ] 能够在 `/showcase` 中查看创建的项目

---

## 🔗 有用链接

- [Vercel Environment Variables Docs](https://vercel.com/docs/projects/environment-variables)
- [Vercel Postgres Documentation](https://vercel.com/docs/storage/vercel-postgres)
- [Vercel CLI Reference](https://vercel.com/docs/cli)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)

---

## 📞 需要帮助?

如果问题仍未解决，请尝试以下步骤：

1. **查看完整错误日志**:
   - 在 Vercel Dashboard 中查看部署日志
   - 检查浏览器控制台（F12）中的网络错误

2. **重新部署**:
   ```bash
   # 强制重新部署
   git commit --allow-empty -m "Force redeploy"
   git push origin main
   ```

3. **联系支持**:
   - Vercel Support: https://vercel.com/support
   - 提供错误日志和部署 ID
