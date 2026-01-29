// 翻译资源
export const translations = {
  en: {
    // 导航
    nav: {
      dashboard: "Dashboard",
      factory: "Factory",
      showcase: "Showcase",
      network: "Network",
      wallet: "Wallet",
      notConnected: "Not Connected",
      devnet: "Devnet",
    },
    
    // 侧边栏
    sidebar: {
      title: "VibeBlink",
      subtitle: "Solana Hackathon 2026",
    },

    // Header
    header: {
      vibeMode: "Vibe Coding Mode",
      on: "ON",
    },

    // 首页仪表板
    dashboard: {
      welcome: "Welcome back, Degen 🚀",
      subtitle: "This is your Vibe Blink Control Center. What do you want to do today?",
      totalBlinks: "Total Blinks",
      volume: "Volume (SOL)",
      vibeScore: "Vibe Score",
      increase: "↗ +12% since yesterday",
      allTimeHigh: "↗ All Time High",
      maximumVibe: "Maximum Vibe",
      quickActions: "Quick Actions",
      createNewBlink: "Create New Blink",
      createDesc: "Create a new interactive component. Support rating, rewards and prediction features. Generate sharing links with one click.",
      exploreEcosystem: "Explore Ecosystem",
      exploreDesc: "View popular projects created by the community. Real-time data tracking to discover the next Alpha.",
    },

    // Create 页面
    create: {
      title: "🚀 Blinks Generation Factory",
      subtitle: "Enter project information to generate a unique Blinks link with rating, rewards and prediction features.",
      projectName: "Project Name",
      projectNamePlaceholder: "e.g. Super Degen DAO",
      projectDesc: "Description",
      projectDescPlaceholder: "e.g. The fastest trading bot on Solana",
      walletAddress: "Wallet Address (SOL)",
      walletPlaceholder: "Wallet Address for receiving rewards",
      generateBtn: "⚡️ Generate Blinks Link",
      success: "🎉 Success!",
      successDesc: "Copy the link below and share on Twitter:",
      preview: "👉 Click to preview",
    },

    // Showcase 页面
    showcase: {
      title: "🌍 Vibe Ecosystem",
      stats: "Community created",
      blinks: "Blinks",
      volume: "SOL total volume",
      newProject: "+ Launch New Project",
      liveOnDevnet: "Live on Devnet",
      totalVolume: "Total Volume",
      interactions: "Interactions",
      interact: "⚡️ Interact",
      share: "Share",
    },

    // 通用
    common: {
      loading: "Loading...",
      error: "Error",
      success: "Success",
      cancel: "Cancel",
      save: "Save",
      delete: "Delete",
    },
  },

  zh: {
    // 导航
    nav: {
      dashboard: "仪表板",
      factory: "工厂",
      showcase: "展示",
      network: "网络",
      wallet: "钱包",
      notConnected: "未连接",
      devnet: "测试网",
    },

    // 侧边栏
    sidebar: {
      title: "VibeBlink",
      subtitle: "Solana 黑客松 2026",
    },

    // Header
    header: {
      vibeMode: "Vibe 编码模式",
      on: "开启",
    },

    // 首页仪表板
    dashboard: {
      welcome: "欢迎回来，Degen 🚀",
      subtitle: "这是你的 Vibe Blink 控制中心。今天想搞点什么事？",
      totalBlinks: "总 Blinks 数",
      volume: "交易量 (SOL)",
      vibeScore: "Vibe 评分",
      increase: "↗ 相比昨天增长 12%",
      allTimeHigh: "↗ 历史新高",
      maximumVibe: "最大Vibe",
      quickActions: "快捷入口",
      createNewBlink: "创建新 Blink",
      createDesc: "创建一个新的交互组件。支持评分、打赏和预测功能。一键生成分享链接。",
      exploreEcosystem: "探索生态",
      exploreDesc: "查看社区创建的热门项目。实时数据追踪，发现下一个 Alpha。",
    },

    // Create 页面
    create: {
      title: "🚀 Blinks 生成工厂",
      subtitle: "输入项目信息，一键生成带有评分、打赏、预测功能的专属 Blinks 链接。",
      projectName: "项目名称",
      projectNamePlaceholder: "例如: Super Degen DAO",
      projectDesc: "一句话介绍",
      projectDescPlaceholder: "例如: Solana 上最快的交易机器人",
      walletAddress: "收款钱包地址 (SOL)",
      walletPlaceholder: "接收打赏的 Wallet Address",
      generateBtn: "⚡️ 生成 Blinks 链接",
      success: "🎉 生成成功!",
      successDesc: "复制下方链接发推：",
      preview: "👉 点击预览效果",
    },

    // Showcase 页面
    showcase: {
      title: "🌍 Vibe 生态展示墙",
      stats: "社区共创建",
      blinks: "个 Blinks",
      volume: "SOL 总交易量",
      newProject: "+ 发起新项目",
      liveOnDevnet: "测试网上线",
      totalVolume: "总交易量",
      interactions: "交互次数",
      interact: "⚡️ 交互",
      share: "分享",
    },

    // 通用
    common: {
      loading: "加载中...",
      error: "错误",
      success: "成功",
      cancel: "取消",
      save: "保存",
      delete: "删除",
    },
  },
};

export type Language = "en" | "zh";
export type TranslationKey = typeof translations.en;

export const getTranslation = (lang: Language): TranslationKey => {
  return translations[lang] || translations.en;
};

export const defaultLanguage: Language = "zh";
