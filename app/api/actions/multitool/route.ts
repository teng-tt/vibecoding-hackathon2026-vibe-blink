import {
  ActionPostResponse,
  createPostResponse,
  ActionGetResponse,
  ActionPostRequest,
  ACTIONS_CORS_HEADERS,
} from "@solana/actions";
import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
  TransactionInstruction,
} from "@solana/web3.js";

const RPC_URL = clusterApiUrl("devnet"); 
// ⚠️ 注意：这里不需要硬编码 TREASURY_ADDRESS 了，我们将从 URL 获取

// --- 辅助函数：解析 URL 参数并保持透传 ---
function getParams(reqUrl: string) {
  const url = new URL(reqUrl);
  const name = url.searchParams.get("name") || "未命名项目";
  const desc = url.searchParams.get("desc") || "Vibe Coding Project";
  const wallet = url.searchParams.get("wallet") || "你的默认钱包地址(回退)"; 
  
  // 构建一个查询字符串，用于附加到所有后续链接中，保持状态
  const queryStr = `&name=${encodeURIComponent(name)}&desc=${encodeURIComponent(desc)}&wallet=${encodeURIComponent(wallet)}`;
  
  return { url, name, desc, wallet, queryStr, baseUrl: url.origin };
}

function getMetadata(mode: string, reqUrl: string): ActionGetResponse {
  const { name, desc, queryStr, baseUrl } = getParams(reqUrl);
  const baseApi = `${baseUrl}/api/actions/multitool`;
  
  // 动态生成包含项目名称的图片
  const dynamicImage = `https://placehold.co/1000x500/1e1e1e/FFFFFF/png?text=${encodeURIComponent(name)}`;

  // 1. 评分模式
  if (mode === "rate") {
    return {
      icon: dynamicImage,
      title: `🌟 评价: ${name}`,
      description: desc,
      label: "Rate",
      links: {
        actions: [
          // 注意：我们在 href 后面加上了 queryStr，确保参数传递下去
          { type: "action", label: "1分", href: `${baseApi}?action=tx_rate&score=1${queryStr}` },
          { type: "action", label: "5分", href: `${baseApi}?action=tx_rate&score=5${queryStr}` },
          { type: "action", label: "🔙 返回", href: `${baseApi}?action=nav_menu${queryStr}` },
        ],
      },
    };
  }

  // 2. 打赏模式
  if (mode === "tip") {
    return {
      icon: dynamicImage,
      title: `💰 打赏给: ${name}`,
      description: `支持一下 ${name} 的开发者 (Devnet)`,
      label: "Tip",
      links: {
        actions: [
          {
            type: "action",
            label: "确认打赏",
            href: `${baseApi}?action=tx_tip&amount={amount}${queryStr}`,
            parameters: [{ name: "amount", label: "输入金额", required: true }],
          },
          { type: "action", label: "🔙 返回", href: `${baseApi}?action=nav_menu${queryStr}` },
        ],
      },
    };
  }

  // 3. 预测模式
  if (mode === "predict") {
    return {
      icon: dynamicImage,
      title: `🎲 预测: ${name}`,
      description: `你觉得 ${name} 会赢吗？`,
      label: "Predict",
      links: {
        actions: [
          { type: "action", label: "看涨 (Yes)", href: `${baseApi}?action=tx_predict&side=yes${queryStr}` },
          { type: "action", label: "看跌 (No)", href: `${baseApi}?action=tx_predict&side=no${queryStr}` },
          { type: "action", label: "🔙 返回", href: `${baseApi}?action=nav_menu${queryStr}` },
        ],
      },
    };
  }

  // 0. 主菜单
  return {
    icon: dynamicImage,
    title: `⚡️ ${name}`, // 标题动态化
    description: desc,   // 描述动态化
    label: "Menu",
    links: {
      actions: [
        { type: "action", label: "🌟 评分", href: `${baseApi}?action=nav_rate${queryStr}` },
        { type: "action", label: "💰 打赏", href: `${baseApi}?action=nav_tip${queryStr}` },
        { type: "action", label: "🎲 预测", href: `${baseApi}?action=nav_predict${queryStr}` },
      ],
    },
  };
}

export const GET = async (req: Request) => {
  return Response.json(getMetadata("menu", req.url), {
    headers: ACTIONS_CORS_HEADERS,
  });
};

export const OPTIONS = async () => {
  return new Response(null, { headers: ACTIONS_CORS_HEADERS });
};

export const POST = async (req: Request) => {
  try {
    const { url, wallet, queryStr, name } = getParams(req.url); // 获取动态参数
    const action = url.searchParams.get("action");
    const body: ActionPostRequest = await req.json();
    const account = new PublicKey(body.account);
    const connection = new Connection(RPC_URL);

    // 动态设置收款地址！
    let targetPubkey: PublicKey;
    try {
        targetPubkey = new PublicKey(wallet);
    } catch (e) {
        // 如果 URL 里的钱包地址无效，回退到一个默认地址（防止崩盘）
        targetPubkey = new PublicKey("你的备用钱包地址"); 
    }

    // === 分支 1: 纯导航 ===
    if (action?.startsWith("nav_")) {
      const targetMode = action.replace("nav_", "");
      return Response.json({
        type: "action",
        message: "加载中...",
        links: {
          next: {
            type: "inline",
            action: getMetadata(targetMode, req.url), // 传入 req.url 以保留参数
          },
        },
      }, { headers: ACTIONS_CORS_HEADERS });
    }

    // === 分支 2: 交易构建 ===
    const transaction = new Transaction();
    let message = "交互成功！";

    if (action === "tx_rate") {
      const score = url.searchParams.get("score");
      transaction.add(
        new TransactionInstruction({
          keys: [{ pubkey: account, isSigner: true, isWritable: true }],
          data: Buffer.from(`${name} Rate: ${score}/5`, "utf-8"), // 把项目名记入链上
          programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcQb"),
        })
      );
      message = `已给 ${name} 打分: ${score}`;
    }

    else if (action === "tx_tip") {
      const amount = parseFloat(url.searchParams.get("amount") || "0");
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: account,
          toPubkey: targetPubkey, // 钱打给 URL 参数里的人
          lamports: amount * LAMPORTS_PER_SOL,
        })
      );
      message = `成功打赏给 ${name}`;
    }

    else if (action === "tx_predict") {
      const side = url.searchParams.get("side");
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: account,
          toPubkey: targetPubkey,
          lamports: 0.01 * LAMPORTS_PER_SOL,
        })
      );
      transaction.add(
        new TransactionInstruction({
            keys: [{ pubkey: account, isSigner: true, isWritable: true }],
            data: Buffer.from(`${name} Predict: ${side}`, "utf-8"),
            programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcQb"),
          })
      );
      message = `已预测 ${name}: ${side}`;
    }

    transaction.feePayer = account;
    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

    const payload: ActionPostResponse = await createPostResponse({
      fields: {
        transaction,
        message: message,
        links: {
            next: {
                type: "inline",
                action: getMetadata("menu", req.url) // 完成后跳回带参数的主菜单
            }
        }
      },
    });

    return Response.json(payload, { headers: ACTIONS_CORS_HEADERS });

  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "交互失败" },
      { status: 400, headers: ACTIONS_CORS_HEADERS }
    );
  }
};