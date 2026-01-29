/**
 * 应用常量定义
 */

export const APP_NAME = "Vibe Blink Factory";
export const APP_VERSION = "0.1.0";
export const APP_DESCRIPTION = "Generate Zero-Code Solana Blinks - Create interactive onchain actions without writing code";

export const ROUTES = {
  HOME: "/",
  DASHBOARD: "/",
  CREATE: "/create",
  SHOWCASE: "/showcase",
} as const;

export const API_ENDPOINTS = {
  PROJECTS: "/api/v1/projects",
  PROJECT_BY_ID: (id: string) => `/api/v1/projects?id=${id}`,
  ACTIONS: "/api/actions/multitool",
} as const;

export const THEME_COLORS = {
  primary: "var(--primary-color)",
  secondary: "var(--secondary-color)",
  success: "var(--success-color)",
  warning: "var(--warning-color)",
  danger: "var(--danger-color)",
  background: {
    primary: "var(--bg-primary)",
    secondary: "var(--bg-secondary)",
  },
  text: {
    primary: "var(--text-primary)",
    secondary: "var(--text-secondary)",
    muted: "var(--text-muted)",
  },
  border: "var(--border-color)",
} as const;

export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  DEFAULT_OFFSET: 0,
} as const;
