# Vibe Blink Factory - Vercel 部署检查脚本 (Windows PowerShell)
# Usage: .\check-deployment.ps1

Write-Host "🔍 Vibe Blink Factory - Vercel 部署检查" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# 检查 Git 状态
Write-Host "1️⃣ 检查 Git 状态..." -ForegroundColor Yellow
if (Test-Path ".git") {
  $gitStatus = git status --porcelain
  if ($gitStatus) {
    Write-Host "⚠️  有未提交的更改:" -ForegroundColor Yellow
    Write-Host $gitStatus -ForegroundColor Gray
  } else {
    Write-Host "✅ Git 仓库是干净的" -ForegroundColor Green
  }
} else {
  Write-Host "❌ 不是一个 Git 仓库" -ForegroundColor Red
}
Write-Host ""

# 检查 Node.js 版本
Write-Host "2️⃣ 检查 Node.js 版本..." -ForegroundColor Yellow
$nodeVersion = node -v 2>$null
if ($nodeVersion) {
  Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} else {
  Write-Host "❌ 未找到 Node.js" -ForegroundColor Red
}
Write-Host ""

# 检查环境变量
Write-Host "3️⃣ 检查环境变量..." -ForegroundColor Yellow
if (Test-Path ".env.local") {
  Write-Host "✅ .env.local 文件存在" -ForegroundColor Green
  $envContent = Get-Content ".env.local"
  
  if ($envContent -match "POSTGRES_URL") {
    Write-Host "  ✅ POSTGRES_URL 已设置" -ForegroundColor Green
  } else {
    Write-Host "  ❌ POSTGRES_URL 未设置" -ForegroundColor Red
  }
  
  if ($envContent -match "POSTGRES_URL_NON_POOLING") {
    Write-Host "  ✅ POSTGRES_URL_NON_POOLING 已设置" -ForegroundColor Green
  } else {
    Write-Host "  ❌ POSTGRES_URL_NON_POOLING 未设置" -ForegroundColor Red
  }
} else {
  Write-Host "⚠️  .env.local 文件不存在（本地测试可能失败）" -ForegroundColor Yellow
}
Write-Host ""

# 检查依赖安装
Write-Host "4️⃣ 检查依赖..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
  Write-Host "✅ node_modules 目录存在" -ForegroundColor Green
} else {
  Write-Host "⚠️  node_modules 目录不存在，请运行: npm install" -ForegroundColor Yellow
}
Write-Host ""

# 检查构建
Write-Host "5️⃣ 检查构建..." -ForegroundColor Yellow
$buildOutput = npm run build 2>&1 | Out-String
if ($LASTEXITCODE -eq 0) {
  Write-Host "✅ 构建成功" -ForegroundColor Green
} else {
  Write-Host "❌ 构建失败" -ForegroundColor Red
  Write-Host "   运行 'npm run build' 查看错误" -ForegroundColor Gray
}
Write-Host ""

# 检查 TypeScript/Lint
Write-Host "6️⃣ 检查 TypeScript..." -ForegroundColor Yellow
$lintOutput = npm run lint 2>&1 | Out-String
if ($LASTEXITCODE -eq 0) {
  Write-Host "✅ Lint 检查通过" -ForegroundColor Green
} else {
  Write-Host "⚠️  Lint 检查发现问题（可能只是警告）" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "================================" -ForegroundColor Cyan
Write-Host "✅ 检查完成！" -ForegroundColor Green
Write-Host ""
Write-Host "📝 后续步骤：" -ForegroundColor Cyan
Write-Host "1. 确保所有检查都显示 ✅" -ForegroundColor White
Write-Host "2. 提交更改: git add . && git commit -m 'Fix deployment issues'" -ForegroundColor White
Write-Host "3. 推送代码: git push origin main" -ForegroundColor White
Write-Host "4. 在 Vercel Dashboard 中检查部署状态" -ForegroundColor White
Write-Host "5. 验证环境变量已在 Vercel 中设置" -ForegroundColor White
Write-Host ""
Write-Host "🔗 相关文档: DEPLOYMENT_GUIDE.md" -ForegroundColor Cyan
