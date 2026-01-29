# 🚀 快速部署指南

## 问题排查步骤

如果遇到 "Error: Failed to save project"，请按以下步骤操作：

### 第 1 步：验证环境变量

在 Vercel Dashboard 中：
1. 进入你的项目 → **Settings**
2. 左侧菜单选择 **Environment Variables**
3. 确保同时存在以下两个变量：

```
✅ POSTGRES_URL
✅ POSTGRES_URL_NON_POOLING
```

如果缺少任何一个，请添加它们。连接字符串应该是这样的格式：
```
postgresql://user:password@host:5432/database
```

### 第 2 步：检查部署日志

```powershell
# 如果已安装 Vercel CLI，查看实时日志
vercel logs your-project-name --follow

# 如果未安装，可以在 Vercel Dashboard 查看：
# 1. 进入项目
# 2. 选择 "Deployments" 标签页
# 3. 点击最新的部署
# 4. 查看构建和函数日志
```

### 第 3 步：强制重新部署

```powershell
# 在本地仓库中
git commit --allow-empty -m "Force redeploy"
git push origin main

# 或者在 Vercel Dashboard 中点击 "Redeploy" 按钮
```

### 第 4 步：本地测试（可选）

```powershell
# 1. 复制环境文件
cp .env.local.example .env.local

# 2. 在 .env.local 中填入 Postgres 连接字符串
# POSTGRES_URL=postgresql://...
# POSTGRES_URL_NON_POOLING=postgresql://...

# 3. 安装依赖
npm install

# 4. 启动开发服务器
npm run dev

# 5. 访问 http://localhost:3000/create
# 6. 尝试创建项目，检查是否成功保存
```

---

## 改进点总结

### ✅ 已修复的问题

1. **数据库自动初始化**
   - 每个 API 端点都会自动调用 `initializeDatabase()`
   - 确保表存在后再尝试操作

2. **更好的错误处理**
   - 后端返回详细的错误信息
   - 前端显示具体的错误消息而不是通用提示

3. **环境变量验证**
   - 检查 `POSTGRES_URL` 是否已配置
   - 提供清晰的错误提示

4. **前端改进**
   - 显示错误消息而不是 alert
   - 提示用户检查 Vercel 环境变量

5. **文档完善**
   - 添加 `DEPLOYMENT_GUIDE.md` 详细部署指南
   - 提供检查脚本方便诊断

---

## 关键文件修改

| 文件 | 修改内容 |
|------|---------|
| `app/api/projects/route.ts` | 添加数据库初始化，改进错误处理 |
| `app/create/page.tsx` | 改进前端错误显示 |
| `lib/db.ts` | 增强 `addProject` 的错误提示 |
| `DEPLOYMENT_GUIDE.md` | ✨ 新建部署指南文档 |
| `check-deployment.sh` | ✨ 新建检查脚本（Linux/Mac） |
| `check-deployment.ps1` | ✨ 新建检查脚本（Windows） |

---

## 常见问题

### Q: 部署后仍然显示错误？

**A**: 
1. 刷新浏览器（清除缓存）
2. 在 Vercel Dashboard 中强制重新部署
3. 等待 2-3 分钟让缓存生效

### Q: 如何验证数据库连接是否正确？

**A**:
```powershell
# 在 Vercel Postgres 管理界面中运行 SQL
SELECT COUNT(*) FROM projects;

# 如果返回 0，说明表存在但无数据（正常）
# 如果报错说表不存在，请刷新页面或重新部署
```

### Q: 本地测试成功，但 Vercel 部署失败？

**A**: 环境变量不同步
1. 确认 `.env.local` 包含测试的连接字符串
2. 在 Vercel Dashboard 中的环境变量必须完全相同
3. 重新部署以应用新的环境变量

### Q: 如何检查 Vercel 是否正确读取了环境变量？

**A**: 查看部署日志
```powershell
# 看是否有 "Database initialized successfully" 的日志
vercel logs your-project-name --follow

# 或者创建一个测试路由来打印环境变量（生产环境不推荐）
```

---

## 下一步

1. ✅ 推送代码到 GitHub
2. ✅ 在 Vercel Dashboard 验证环境变量
3. ✅ 检查部署日志
4. ✅ 访问部署的 URL 测试
5. ✅ 尝试创建项目并验证数据被保存

---

## 联系支持

如果问题仍未解决：

1. **查看完整日志**:
   ```powershell
   vercel logs your-project-name --follow
   ```

2. **提交 GitHub Issue** 并包含：
   - 错误信息的完整日志
   - Vercel 部署 ID
   - 环境变量配置（隐去密码）

3. **Vercel 官方支持**: https://vercel.com/support

---

**最后更新**: 2026-01-29
**状态**: ✅ 已修复 "Failed to save project" 错误
