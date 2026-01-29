import {
  ACTIONS_CORS_HEADERS,
  ActionPostRequest,
  createPostResponse,
  ActionPostResponse,
} from "@solana/actions";
import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  LAMPORTS_PER_SOL,
  TransactionInstruction,
} from "@solana/web3.js";

// 使用公共且稳定的 Devnet 节点
const RPC_URL = "https://api.devnet.solana.com";
const connection = new Connection(RPC_URL, "confirmed");

// --- 辅助函数：解析 URL 参数 ---
function getParams(reqUrl: string) {
  const url = new URL(reqUrl);
  const name = url.searchParams.get("name") || "Unknow Project";
  const desc = url.searchParams.get("desc") || "Vibe Coding";
  // 保底钱包：如果 URL 里没有钱包，用这个防止报错 (这是个随机生成的有效 Devnet 地址)
  const wallet = url.searchParams.get("wallet") || "37EVtbgGUGacASByYRfbhpKoMFAzHWPSyHyuqsv3PHz5"; 
  const baseUrl = url.origin;
  
  // 构造透传参数字符串
  const queryStr = `&name=${encodeURIComponent(name)}&desc=${encodeURIComponent(desc)}&wallet=${encodeURIComponent(wallet)}`;
  
  return { url, name, desc, wallet, queryStr, baseUrl };
}

// --- 构造 Metadata ---
function getMetadata(mode: string, reqUrl: string) {
  const { name, desc, queryStr, baseUrl } = getParams(reqUrl);
  const baseApi = `${baseUrl}/api/actions/multitool`;
  const image = `https://placehold.co/1000x500/1e1e1e/FFFFFF/png?text=${encodeURIComponent(name)}`;

  // 这里的 type 定义是为了绕过 TS 检查
  const TX: any = "transaction";

  const commonActions = {
    rate: [
      { type: TX, label: "1分", href: `${baseApi}?action=tx_rate&score=1${queryStr}` },
      { type: TX, label: "5分", href: `${baseApi}?action=tx_rate&score=5${queryStr}` },
      { type: TX, label: "🔙 Menu", href: `${baseApi}?action=nav_menu${queryStr}` },
    ],
    tip: [
      { 
        type: TX, label: "打赏 SOL", 
        href: `${baseApi}?action=tx_tip&amount={amount}${queryStr}`,
        parameters: [{ name: "amount", label: "SOL Amount", required: true }]
      },
      { type: TX, label: "🔙 Menu", href: `${baseApi}?action=nav_menu${queryStr}` },
    ],
    predict: [
      { type: TX, label: "Yes (看涨)", href: `${baseApi}?action=tx_predict&side=yes${queryStr}` },
      { type: TX, label: "No (看跌)", href: `${baseApi}?action=tx_predict&side=no${queryStr}` },
      { type: TX, label: "🔙 Menu", href: `${baseApi}?action=nav_menu${queryStr}` },
    ],
    menu: [
      { type: TX, label: "🌟 评分", href: `${baseApi}?action=nav_rate${queryStr}` },
      { type: TX, label: "💰 打赏", href: `${baseApi}?action=nav_tip${queryStr}` },
      { type: TX, label: "🎲 预测", href: `${baseApi}?action=nav_predict${queryStr}` },
    ]
  };

  let currentActions = commonActions.menu;
  let title = `⚡️ ${name}`;
  let label = "Menu";

  if (mode === "rate") { currentActions = commonActions.rate; title = `🌟 Rate: ${name}`; label = "Rate"; }
  if (mode === "tip") { currentActions = commonActions.tip; title = `💰 Tip: ${name}`; label = "Tip"; }
  if (mode === "predict") { currentActions = commonActions.predict; title = `🎲 Predict: ${name}`; label = "Predict"; }

  return {
    type: "action" as const, // 根节点必须有 type
    icon: image,
    title: title,
    description: desc,
    label: label,
    links: { actions: currentActions }
  };
}

// --- API Methods ---

export const GET = async (req: Request) => {
  return Response.json(getMetadata("menu", req.url), { headers: ACTIONS_CORS_HEADERS });
};

export const OPTIONS = async () => {
  return new Response(null, { headers: ACTIONS_CORS_HEADERS });
};

export const POST = async (req: Request) => {
  try {
    const { url, wallet, queryStr, name } = getParams(req.url);
    const action = url.searchParams.get("action");
    const body: ActionPostRequest = await req.json();

    // 1. 软解析 Account (防止未连接钱包时直接崩盘)
    let account: PublicKey | null = null;
    try {
      if (body.account) account = new PublicKey(body.account);
    } catch (e) { /* ignore */ }

    // 2. 解析目标收款钱包
    let targetPubkey: PublicKey;
    try {
      targetPubkey = new PublicKey(wallet);
    } catch (e) {
      targetPubkey = new PublicKey("37EVtbgGUGacASByYRfbhpKoMFAzHWPSyHyuqsv3PHz5"); // Fallback
    }

    // === 逻辑分支 A: 纯导航 (无需钱包签名) ===
    if (action?.startsWith("nav_")) {
      const targetMode = action.replace("nav_", "");
      const payload = {
        type: "action",
        message: "Loading...",
        links: {
          next: {
            type: "inline",
            action: getMetadata(targetMode, req.url) as any
          }
        }
      };
      return Response.json(payload, { headers: ACTIONS_CORS_HEADERS });
    }

    // === 逻辑分支 B: 交易 (必须有钱包) ===
    
    if (!account) {
      return Response.json({ error: "Wallet not connected!" }, { status: 400, headers: ACTIONS_CORS_HEADERS });
    }

    const transaction = new Transaction();
    let message = "Vibe +1";

    // 构建指令
    if (action === "tx_rate") {
      const score = url.searchParams.get("score");
      transaction.add(new TransactionInstruction({
        keys: [{ pubkey: account, isSigner: true, isWritable: true }],
        data: Buffer.from(`${name} Rate: ${score}`, "utf-8"),
        programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcQb"),
      }));
      message = `Rated: ${score}/5`;
    } 
    else if (action === "tx_tip") {
      const amount = parseFloat(url.searchParams.get("amount") || "0.1");
      transaction.add(SystemProgram.transfer({
        fromPubkey: account,
        toPubkey: targetPubkey,
        lamports: amount * LAMPORTS_PER_SOL,
      }));
      message = `Tipped ${amount} SOL`;
    }
    else if (action === "tx_predict") {
      const side = url.searchParams.get("side");
      transaction.add(SystemProgram.transfer({
        fromPubkey: account,
        toPubkey: targetPubkey,
        lamports: 0.01 * LAMPORTS_PER_SOL,
      }));
      transaction.add(new TransactionInstruction({
        keys: [{ pubkey: account, isSigner: true, isWritable: true }],
        data: Buffer.from(`${name} Bet: ${side}`, "utf-8"),
        programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcQb"),
      }));
      message = `Bet placed on ${side}`;
    }

    // 关键：构建交易
    transaction.feePayer = account;
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;

    // 手动序列化 payload，避免 createPostResponse 的兼容性问题
    const payload: ActionPostResponse = {
      type: "transaction",
      transaction: transaction.serialize({ requireAllSignatures: false, verifySignatures: false }).toString("base64"),
      message: message,
      links: {
        next: {
          type: "inline",
          action: getMetadata("menu", req.url) as any
        }
      }
    };

    return Response.json(payload, { headers: ACTIONS_CORS_HEADERS });

  } catch (error) {
    console.error(error);
    return Response.json({ error: "Transaction Failed" }, { status: 500, headers: ACTIONS_CORS_HEADERS });
  }
};