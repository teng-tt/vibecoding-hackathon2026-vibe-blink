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

// --- 辅助函数：解析 URL 参数 ---
function getParams(reqUrl: string) {
  const url = new URL(reqUrl);
  const name = url.searchParams.get("name") || "未命名项目";
  const desc = url.searchParams.get("desc") || "Vibe Coding Project";
  const wallet = url.searchParams.get("wallet") || "37EVtbgGUGacASByYRfbhpKoMFAzHWPSyHyuqsv3PHz5"; 
  const baseUrl = url.origin;
  const queryStr = `&name=${encodeURIComponent(name)}&desc=${encodeURIComponent(desc)}&wallet=${encodeURIComponent(wallet)}`;
  return { url, name, desc, wallet, queryStr, baseUrl: url.origin };
}

// 获取元数据
function getMetadata(mode: string, reqUrl: string) {
  const { name, desc, queryStr, baseUrl } = getParams(reqUrl);
  const baseApi = `${baseUrl}/api/actions/multitool`;
  const dynamicImage = `https://placehold.co/1000x500/1e1e1e/FFFFFF/png?text=${encodeURIComponent(name)}`;

  // 通用按钮类型定义 (使用 as any 绕过 TS 检查，防止 build 报错)
  const TX_TYPE = "transaction" as any; 

  if (mode === "rate") {
    return {
      type: "action" as const,
      icon: dynamicImage,
      title: `🌟 评价: ${name}`,
      description: desc,
      label: "Rate",
      links: {
        actions: [
          { type: TX_TYPE, label: "1分", href: `${baseApi}?action=tx_rate&score=1${queryStr}` },
          { type: "transaction" as any, label: "5分", href: `${baseApi}?action=tx_rate&score=5${queryStr}` },
          { type: TX_TYPE, label: "🔙 返回", href: `${baseApi}?action=nav_menu${queryStr}` },
        ],
      },
    };
  }

  if (mode === "tip") {
    return {
      type: "action" as const,
      icon: dynamicImage,
      title: `💰 打赏给: ${name}`,
      description: `支持一下 ${name} 的开发者 (Devnet)`,
      label: "Tip",
      links: {
        actions: [
          {
            type: TX_TYPE,
            label: "确认打赏",
            href: `${baseApi}?action=tx_tip&amount={amount}${queryStr}`,
            parameters: [{ name: "amount", label: "输入金额", required: true }],
          },
          { type: TX_TYPE, label: "🔙 返回", href: `${baseApi}?action=nav_menu${queryStr}` },
        ],
      },
    };
  }

  if (mode === "predict") {
    return {
      type: "action" as const,
      icon: dynamicImage,
      title: `🎲 预测: ${name}`,
      description: `你觉得 ${name} 会赢吗？`,
      label: "Predict",
      links: {
        actions: [
          { type: TX_TYPE, label: "看涨 (Yes)", href: `${baseApi}?action=tx_predict&side=yes${queryStr}` },
          { type: TX_TYPE, label: "看跌 (No)", href: `${baseApi}?action=tx_predict&side=no${queryStr}` },
          { type: TX_TYPE, label: "🔙 返回", href: `${baseApi}?action=nav_menu${queryStr}` },
        ],
      },
    };
  }

  // 主菜单
  return {
    type: "action" as const,
    icon: dynamicImage,
    title: `⚡️ ${name}`,
    description: desc,
    label: "Menu",
    links: {
      actions: [
        // 这里的按钮实际上是导航，但在 Action 标准里通常也标记为 transaction 或 action
        { type: TX_TYPE, label: "🌟 评分", href: `${baseApi}?action=nav_rate${queryStr}` },
        { type: TX_TYPE, label: "💰 打赏", href: `${baseApi}?action=nav_tip${queryStr}` },
        { type: TX_TYPE, label: "🎲 预测", href: `${baseApi}?action=nav_predict${queryStr}` },
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
    const { url, wallet, queryStr, name } = getParams(req.url);
    const action = url.searchParams.get("action");
    const body: ActionPostRequest = await req.json();
    
    // 🔥 修复：软解析 Account，防止未连钱包时崩盘
    let account: PublicKey | null = null;
    try {
        if (body.account) {
            account = new PublicKey(body.account);
        }
    } catch (err) {
        // 忽略错误，account 保持为 null
    }

    const connection = new Connection(RPC_URL);

    // 解析收款地址
    let targetPubkey: PublicKey;
    try {
        targetPubkey = new PublicKey(wallet);
    } catch (e) {
        targetPubkey = new PublicKey("37EVtbgGUGacASByYRfbhpKoMFAzHWPSyHyuqsv3PHz5"); 
    }

    // === 分支 1: 纯导航 (Navigation) ===
    if (action?.startsWith("nav_")) {
      // 导航不需要 account，直接放行
      const targetMode = action.replace("nav_", "");
      
      const payload = {
        type: "action",
        message: "加载中...",
        links: {
          next: {
            type: "inline",
            action: getMetadata(targetMode, req.url) as any,
          },
        },
      };

      return Response.json(payload, { headers: ACTIONS_CORS_HEADERS });
    }

    // === 分支 2: 交易构建 (Transaction) ===
    
    // 🔥 修复：如果是交易操作，必须检查 Account
    if (!account) {
        return Response.json(
            { error: "请先连接钱包！(Account missing)" }, 
            { status: 400, headers: ACTIONS_CORS_HEADERS }
        );
    }

    const transaction = new Transaction();
    let message = "交互成功！";

    if (action === "tx_rate") {
      const score = url.searchParams.get("score");
      transaction.add(
        new TransactionInstruction({
          keys: [{ pubkey: account, isSigner: true, isWritable: true }],
          data: Buffer.from(`${name} Rate: ${score}/5`, "utf-8"),
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
          toPubkey: targetPubkey,
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
        type: "transaction",
        transaction,
        message: message,
        links: {
            next: {
                type: "inline",
                action: getMetadata("menu", req.url) as any
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