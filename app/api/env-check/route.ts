import { NextResponse } from "next/server";

export async function GET() {
  // 这是在服务器端运行的，不受浏览器安全策略限制
  const dbUrl = process.env.POSTGRES_URL_NON_POOLING;
  
  console.log("----------------------------------");
  console.log("SERVER SIDE LOG CHECK:");
  console.log("POSTGRES_URL_NON_POOLING Length:", dbUrl ? dbUrl.length : "Undefined");
  console.log("----------------------------------");

  return NextResponse.json({
    hasUrl: !!dbUrl,
    urlLength: dbUrl ? dbUrl.length : 0,
    // 为了安全，不要把完整密码返回给前端，只返回是否存在
    message: dbUrl ? "变量读取成功" : "变量读取失败"
  });
}

// 强制动态渲染，防止被缓存
export const dynamic = 'force-dynamic';