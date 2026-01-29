/**
 * API 客户端工具函数
 */

import { API_ENDPOINTS } from "./constants";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(
      response.status,
      data.error || "API request failed",
      data.details
    );
  }

  return data;
}

export const apiClient = {
  async get<T>(url: string): Promise<T> {
    const response = await fetch(url, { method: "GET" });
    return handleResponse<T>(response);
  },

  async post<T>(url: string, data: any): Promise<T> {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse<T>(response);
  },

  async put<T>(url: string, data: any): Promise<T> {
    const response = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse<T>(response);
  },

  async delete<T>(url: string): Promise<T> {
    const response = await fetch(url, { method: "DELETE" });
    return handleResponse<T>(response);
  },
};
