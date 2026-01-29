/**
 * 项目类型定义
 */

export interface Project {
  id: string;
  name: string;
  description: string;
  wallet: string;
  link: string;
  volume: number;
  txs: number;
  created_at?: string;
  updated_at?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: string;
}

export interface I18nTranslations {
  nav: {
    dashboard: string;
    factory: string;
    showcase: string;
  };
  sidebar: {
    title: string;
    subtitle: string;
  };
  dashboard: {
    welcome: string;
    subtitle: string;
    totalBlinks: string;
    increase: string;
    volume: string;
    allTimeHigh: string;
    vibeScore: string;
    maximumVibe: string;
    quickActions: string;
    createNewBlink: string;
    createDesc: string;
  };
  create: {
    title: string;
    form: {
      name: string;
      description: string;
      wallet: string;
      link: string;
      volume: string;
      txs: string;
      submit: string;
      cancel: string;
    };
  };
  showcase: {
    title: string;
    search: string;
    noResults: string;
  };
}
