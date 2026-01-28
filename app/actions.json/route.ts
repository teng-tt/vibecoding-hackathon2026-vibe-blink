import { ACTIONS_CORS_HEADERS, ActionsJson } from "@solana/actions";

export const GET = async () => {
  const payload: ActionsJson = {
    rules: [
      {
        pathPattern: "/api/actions/multitool", // 匹配我们上面的路由
        apiPath: "/api/actions/multitool",
      },
      // 允许所有子路径也匹配（以防万一）
      {
        pathPattern: "/api/actions/multitool/**",
        apiPath: "/api/actions/multitool/**",
      }
    ],
  };

  return Response.json(payload, {
    headers: ACTIONS_CORS_HEADERS,
  });
};

export const OPTIONS = GET;