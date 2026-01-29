#!/bin/bash

# Vibe Blink Factory - Vercel 部署检查脚本
# Usage: bash check-deployment.sh

echo "🔍 Vibe Blink Factory - Vercel 部署检查"
echo "=================================="
echo ""

# 检查 Git 状态
echo "1️⃣ 检查 Git 状态..."
if [ -d ".git" ]; then
  if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  有未提交的更改："
    git status --short
    echo ""
  else
    echo "✅ Git 仓库是干净的"
    echo ""
  fi
else
  echo "❌ 不是一个 Git 仓库"
  echo ""
fi

# 检查 Node.js 版本
echo "2️⃣ 检查 Node.js 版本..."
if command -v node &> /dev/null; then
  NODE_VERSION=$(node -v)
  echo "✅ Node.js: $NODE_VERSION"
  echo ""
else
  echo "❌ 未找到 Node.js"
  echo ""
fi

# 检查环境变量
echo "3️⃣ 检查环境变量..."
if [ -f ".env.local" ]; then
  echo "✅ .env.local 文件存在"
  if grep -q "POSTGRES_URL" .env.local; then
    echo "  ✅ POSTGRES_URL 已设置"
  else
    echo "  ❌ POSTGRES_URL 未设置"
  fi
  if grep -q "POSTGRES_URL_NON_POOLING" .env.local; then
    echo "  ✅ POSTGRES_URL_NON_POOLING 已设置"
  else
    echo "  ❌ POSTGRES_URL_NON_POOLING 未设置"
  fi
  echo ""
else
  echo "⚠️  .env.local 文件不存在（本地测试可能失败）"
  echo ""
fi

# 检查依赖安装
echo "4️⃣ 检查依赖..."
if [ -d "node_modules" ]; then
  echo "✅ node_modules 目录存在"
  echo ""
else
  echo "⚠️  node_modules 目录不存在，请运行: npm install"
  echo ""
fi

# 检查构建
echo "5️⃣ 检查构建..."
if npm run build > /dev/null 2>&1; then
  echo "✅ 构建成功"
  echo ""
else
  echo "❌ 构建失败"
  echo "   运行 'npm run build' 查看错误"
  echo ""
fi

# 检查 TypeScript
echo "6️⃣ 检查 TypeScript..."
if npm run lint > /dev/null 2>&1; then
  echo "✅ Lint 检查通过"
  echo ""
else
  echo "⚠️  Lint 检查发现问题（可能只是警告）"
  echo ""
fi

echo "=================================="
echo "✅ 检查完成！"
echo ""
echo "📝 后续步骤："
echo "1. 确保所有检查都显示 ✅"
echo "2. 提交更改: git add . && git commit -m 'Fix deployment issues'"
echo "3. 推送代码: git push origin main"
echo "4. 在 Vercel Dashboard 中检查部署状态"
echo "5. 验证环境变量已在 Vercel 中设置"
echo ""
echo "🔗 相关文档: DEPLOYMENT_GUIDE.md"
