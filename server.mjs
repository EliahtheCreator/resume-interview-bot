import http from "node:http";
import crypto from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "public");
const dataDir = path.join(__dirname, "data");
const dbPath = path.join(dataDir, "db.json");
const localNodeModules = path.join(__dirname, "node_modules");

await loadEnv();

const config = {
  port: Number(process.env.PORT || 4317),
  host: process.env.HOST || "127.0.0.1",
  inviteCode: process.env.INVITE_CODE || "demo2026",
  invitedUsers: csv(process.env.INVITED_USERS).map((email) => email.toLowerCase()),
  sessionSecret: process.env.SESSION_SECRET || "local-dev-secret-change-me"
};

const jobs = [
  {
    id: "ai_pm",
    title: "AI 产品经理",
    category: "产品岗",
    open: true,
    description: "考察 AI 产品判断、需求拆解、评估指标、跨团队推进和商业化意识。"
  },
  {
    id: "video_generation_algorithm",
    title: "视频生成算法",
    category: "技术类",
    open: true,
    description: "考察扩散模型、视频生成、评测方法、工程落地和研究判断。"
  },
  {
    id: "recruiting_hr",
    title: "招聘 HR",
    category: "职能类",
    open: true,
    description: "考察岗位理解、候选人评估、招聘漏斗、沟通推进和业务协同。"
  },
  { id: "ai_infra", title: "AI Infra", category: "技术类", open: false },
  { id: "ecommerce_ops", title: "电商运营", category: "运营类", open: false },
  { id: "product_ops", title: "产品运营", category: "运营类", open: false },
  { id: "hardware_sales", title: "硬件销售（算力硬件相关）", category: "市场类", open: false },
  { id: "hrbp", title: "HRBP", category: "职能类", open: false },
  { id: "finance", title: "财务", category: "职能类", open: false }
];

const jobRubrics = {
  ai_pm: {
    role: "AI 产品经理",
    keywords: ["用户", "需求", "指标", "产品", "模型", "评估", "研发", "上线", "体验", "实验", "成本", "延迟", "安全"],
    questions: [
      "你简历里最能代表 AI 产品能力的项目是什么？请讲清楚用户问题、你的方案和结果。",
      "如果你负责一个 AI 功能，从 0 到 1 验证需求时会先看哪些信号？",
      "你会如何设计一个 AI 产品的效果评估指标，避免只看模型指标不看用户价值？",
      "请讲一个你处理过的需求取舍案例，当时牺牲了什么，为什么？",
      "如果研发说模型效果不稳定、业务又催上线，你会怎么推进？"
    ],
    followUps: {
      short: "你能把这个回答补成一个完整案例吗？请按背景、你的动作、结果指标来说。",
      ownership: "这里我还没听清你个人负责的部分。你具体主导或交付了什么？",
      metrics: "这个项目最后怎么证明有效？请补充产品指标、用户指标或实验结果。",
      tradeoff: "当时有没有取舍？比如体验、成本、延迟、模型效果或上线节奏之间怎么平衡？",
      role: "请把它和 AI 产品经理能力连起来：你如何把用户问题转成模型/研发/产品需求？"
    },
    riskLabels: ["模型能力边界判断不足", "指标设计停留在功能层", "跨研发推进不够具体"]
  },
  video_generation_algorithm: {
    role: "视频生成算法",
    keywords: ["模型", "训练", "生成", "视频", "扩散", "评测", "数据", "时序", "一致性", "闪烁", "运动", "采样", "loss", "transformer"],
    questions: [
      "请介绍你最熟悉的视频生成或多模态生成项目，你具体负责了哪一部分？",
      "视频生成相比图像生成，时序一致性通常会遇到哪些问题？你会如何分析？",
      "如果模型生成结果有闪烁、身份漂移或动作不自然，你会怎么定位原因？",
      "你如何评价一个视频生成模型的质量？除了主观打分还会看什么？",
      "如果要把研究方案落到可用产品，你认为最大的工程或算法风险是什么？"
    ],
    followUps: {
      short: "请补充一个具体实验或项目细节，包括数据、模型、指标和你的结论。",
      ownership: "你在实验里具体负责哪一块？是数据、训练、评测、推理优化还是结果分析？",
      metrics: "你用什么指标或观察维度判断视频质量？比如时序一致性、闪烁、动作自然度或主体一致性。",
      tradeoff: "如果质量、速度、显存和稳定性冲突，你会优先优化哪一项？为什么？",
      role: "请更具体说明视频生成里的技术问题，而不是只讲泛泛的 AI 项目经历。"
    },
    riskLabels: ["生成模型基础不够扎实", "缺少视频质量评测意识", "failure case 定位能力不清"]
  },
  recruiting_hr: {
    role: "招聘 HR",
    keywords: ["候选人", "招聘", "岗位", "业务方", "面试", "筛选", "漏斗", "沟通", "offer", "画像", "JD", "渠道", "入职"],
    questions: [
      "请讲一个你负责过的招聘岗位，你如何理解业务需求并转化为筛选标准？",
      "当候选人简历看起来匹配但面试表现一般时，你会如何判断是否继续推进？",
      "你如何提升一个关键岗位的招聘漏斗转化率？请结合具体动作说明。",
      "业务方频繁变化 JD 或评价标准时，你会怎么对齐并推动决策？",
      "请讲一个你识别候选人风险点的案例，你当时看到了哪些信号？"
    ],
    followUps: {
      short: "请补充一个真实招聘案例，包括岗位背景、你的动作、转化结果和复盘。",
      ownership: "这个招聘项目里你个人负责了哪些环节？需求校准、寻访、筛选、沟通还是 offer 推进？",
      metrics: "你当时看哪些招聘数据？比如简历通过率、面试到场率、offer 接受率或招聘周期。",
      tradeoff: "当业务方很急但候选人质量不稳定时，你如何平衡速度、质量和候选人体验？",
      role: "请更具体说明你如何做人才画像和候选人判断，而不是只讲沟通协调。"
    },
    riskLabels: ["岗位理解停留在执行层", "候选人判断缺少证据", "招聘漏斗和业务方管理能力不清"]
  }
};

const resumeQuestionTemplates = {
  ai_pm: [
    "我看到你简历里提到“{snippet}”。请讲清楚这个项目的用户问题、你的产品方案、以及最后用什么指标证明有效。",
    "简历中有“{snippet}”这条经历。你当时怎么把用户需求转成研发或模型侧需求？",
    "围绕“{snippet}”，你怎么设计评估指标？哪些是产品指标，哪些是模型效果指标？",
    "你在“{snippet}”里做过什么取舍？比如体验、成本、延迟、模型效果或上线节奏之间怎么平衡？",
    "如果真实面试官继续追问“{snippet}”的结果可信度，你会用哪些数据或用户反馈证明？"
  ],
  video_generation_algorithm: [
    "我看到你简历里提到“{snippet}”。请展开讲这个项目里的模型、数据、训练或评测部分，你具体负责什么？",
    "围绕“{snippet}”，如果生成结果出现闪烁、身份漂移或动作不自然，你会怎么定位原因？",
    "你在“{snippet}”中怎么评估视频生成质量？请说到具体指标或观察维度。",
    "如果“{snippet}”要从实验走向产品，你认为质量、速度、显存、稳定性之间最大的取舍是什么？",
    "请基于“{snippet}”讲一个 failure case：现象是什么、你怎么分析、最后怎么改。"
  ],
  recruiting_hr: [
    "我看到你简历里提到“{snippet}”。请讲这个招聘项目的岗位背景、筛选标准和最终结果。",
    "围绕“{snippet}”，你当时怎么和业务方对齐人才画像和候选人判断标准？",
    "你在“{snippet}”里看过哪些招聘漏斗数据？比如简历通过率、面试到场率、offer 接受率或招聘周期。",
    "如果“{snippet}”里的业务方很急但候选人质量不稳定，你会怎么平衡速度和质量？",
    "请基于“{snippet}”讲一个你识别候选人风险的例子，你看到了哪些信号？"
  ]
};

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".wasm": "application/wasm",
  ".svg": "image/svg+xml"
};

await ensureDb();

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", `http://${req.headers.host}`);

    if (url.pathname.startsWith("/api/")) {
      await handleApi(req, res, url);
      return;
    }

    await serveStatic(req, res, url);
  } catch (error) {
    console.error(error);
    sendJson(res, 500, { error: "服务器出错了，请稍后再试。", detail: error.message });
  }
});

server.listen(config.port, config.host, () => {
  console.log(`Resume Interview Bot running at http://${config.host}:${config.port}`);
  console.log("Free local mode enabled. No paid API calls are used.");
});

async function handleApi(req, res, url) {
  if (req.method === "GET" && url.pathname === "/api/config") {
    sendJson(res, 200, {
      mode: "local_free",
      hasPaidApi: false,
      speechRecognition: "browser",
      apiUsage: []
    });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/jobs") {
    sendJson(res, 200, { jobs });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/auth/login") {
    const body = await readJson(req);
    const email = String(body.email || "").trim().toLowerCase();
    const inviteCode = String(body.inviteCode || "").trim();
    if (!isEmail(email)) {
      sendJson(res, 400, { error: "请输入有效邮箱。" });
      return;
    }
    if (inviteCode !== config.inviteCode) {
      sendJson(res, 401, { error: "邀请码不正确。" });
      return;
    }
    if (config.invitedUsers.length && !config.invitedUsers.includes(email)) {
      sendJson(res, 403, { error: "这个邮箱还不在白名单里。" });
      return;
    }

    const db = await readDb();
    db.users[email] = db.users[email] || { email, createdAt: new Date().toISOString() };
    await writeDb(db);
    sendJson(res, 200, { token: signToken({ email }), email });
    return;
  }

  const user = authenticate(req);
  if (!user) {
    sendJson(res, 401, { error: "请先登录。" });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/history") {
    const db = await readDb();
    const history = Object.values(db.interviews)
      .filter((item) => item.email === user.email && item.status === "complete" && item.report)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .map((item) => summarizeInterview(item));
    sendJson(res, 200, { history });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/interviews/start") {
    const body = await readJson(req, 18 * 1024 * 1024);
    await startInterview(req, res, user, body);
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/interviews/answer") {
    const body = await readJson(req, 32 * 1024 * 1024);
    await answerInterview(req, res, user, body);
    return;
  }

  sendJson(res, 404, { error: "接口不存在。" });
}

async function startInterview(req, res, user, body) {
  const job = jobs.find((item) => item.id === body.jobId);
  if (!job || !job.open) {
    sendJson(res, 400, { error: "这个岗位暂时还不能面试。等我吸收完这方面的知识再来考察你。" });
    return;
  }

  const resume = body.resume || {};
  if (!resume.name || !resume.base64) {
    sendJson(res, 400, { error: "请上传 PDF 简历。" });
    return;
  }

  const providedText = normalizeResumeText(resume.text);
  const pdfBytes = Buffer.from(String(resume.base64), "base64");
  const resumeText = providedText || await extractPdfText(pdfBytes);
  if (!resumeText || resumeText.trim().length < 80) {
    sendJson(res, 422, {
      code: "NEEDS_OCR",
      error: "没有从 PDF 中读到足够文本。可以启动本地 OCR 识别扫描版简历。"
    });
    return;
  }

  const db = await readDb();
  const resumeAnalysis = await analyzeResume(job, resumeText);
  const interview = {
    id: crypto.randomUUID(),
    email: user.email,
    jobId: job.id,
    jobTitle: job.title,
    resumeName: String(resume.name).slice(0, 160),
    resumeText: resumeText.slice(0, 12000),
    resumeAnalysis,
    status: "in_progress",
    createdAt: new Date().toISOString(),
    startedAt: new Date().toISOString(),
    mainQuestionsAsked: 0,
    currentTurnId: "intro",
    turns: [
      {
        id: "intro",
        kind: "self_intro",
        mainNumber: 0,
        question: "请用 1-2 分钟做一个自我介绍。重点讲你的经历主线、最相关的项目，以及你为什么适合这个岗位。",
        answer: "",
        transcript: "",
        createdAt: new Date().toISOString()
      }
    ],
    report: null
  };

  db.interviews[interview.id] = interview;
  await writeDb(db);
  sendJson(res, 200, { interview: clientInterview(interview) });
}

async function answerInterview(req, res, user, body) {
  const db = await readDb();
  const interview = db.interviews[String(body.interviewId || "")];
  if (!interview || interview.email !== user.email) {
    sendJson(res, 404, { error: "没有找到这场面试。" });
    return;
  }
  if (interview.status === "complete") {
    sendJson(res, 200, { interview: clientInterview(interview) });
    return;
  }

  const currentTurn = interview.turns.find((turn) => turn.id === interview.currentTurnId);
  if (!currentTurn) {
    sendJson(res, 400, { error: "面试状态异常，请重新开始。" });
    return;
  }

  const transcript = normalizeTranscript(body.transcript);
  if (!transcript) {
    sendJson(res, 400, { error: "没有收到有效转写文本，请重新回答这一题。" });
    return;
  }
  currentTurn.transcript = transcript;
  currentTurn.answer = transcript;
  currentTurn.answeredAt = new Date().toISOString();

  const nextTurn = await decideNextTurn(interview, currentTurn);
  if (nextTurn) {
    interview.turns.push(nextTurn);
    interview.currentTurnId = nextTurn.id;
  } else {
    interview.status = "complete";
    interview.completedAt = new Date().toISOString();
    interview.report = await generateReport(interview);
  }

  db.interviews[interview.id] = interview;
  await writeDb(db);
  sendJson(res, 200, { interview: clientInterview(interview), transcript });
}

async function decideNextTurn(interview, currentTurn) {
  const job = jobs.find((item) => item.id === interview.jobId);

  if (currentTurn.kind === "self_intro") {
    const question = await generateBusinessQuestion(interview, 1);
    interview.mainQuestionsAsked = 1;
    return makeTurn("business", 1, question);
  }

  if (currentTurn.kind === "business") {
    const shouldAskFollowUp = await generateFollowUp(interview, currentTurn);
    if (shouldAskFollowUp?.question) {
      return makeTurn("follow_up", currentTurn.mainNumber, shouldAskFollowUp.question, currentTurn.id);
    }
    if (interview.mainQuestionsAsked < 5) {
      const nextNumber = interview.mainQuestionsAsked + 1;
      const question = await generateBusinessQuestion(interview, nextNumber);
      interview.mainQuestionsAsked = nextNumber;
      return makeTurn("business", nextNumber, question);
    }
    return makeTurn(
      "logistics",
      6,
      "最后确认三个现实安排：你可实习时长是多久、最快什么时候可以到岗、每周可以出勤几天？"
    );
  }

  if (currentTurn.kind === "follow_up") {
    if (interview.mainQuestionsAsked < 5) {
      const nextNumber = interview.mainQuestionsAsked + 1;
      const question = await generateBusinessQuestion(interview, nextNumber);
      interview.mainQuestionsAsked = nextNumber;
      return makeTurn("business", nextNumber, question);
    }
    return makeTurn(
      "logistics",
      6,
      "最后确认三个现实安排：你可实习时长是多久、最快什么时候可以到岗、每周可以出勤几天？"
    );
  }

  if (currentTurn.kind === "logistics") {
    return null;
  }

  return makeTurn("business", 1, getRubric(job.id).questions[0]);
}

function makeTurn(kind, mainNumber, question, parentTurnId = null) {
  return {
    id: crypto.randomUUID(),
    kind,
    mainNumber,
    parentTurnId,
    question,
    answer: "",
    transcript: "",
    createdAt: new Date().toISOString()
  };
}

async function analyzeResume(job, resumeText) {
  const text = resumeText.replace(/\s+/g, " ").trim();
  const rubric = getRubric(job.id);
  return {
    summary: `本地解析已读取 ${text.length} 个字符。面试会围绕 ${job.title} 的岗位能力、项目经历和简历可信细节提问。`,
    strengths: pickResumeSignals(text, rubric.keywords),
    resumeSnippets: pickResumeSnippets(text, rubric.keywords),
    metrics: extractMetricSnippets(text),
    concerns: ["简历中的成果指标、个人贡献边界和项目细节需要在回答中进一步验证"],
    suggestedFocus: ["最近项目", "个人负责部分", "量化结果", "岗位匹配度"],
    excerpt: text.slice(0, 1600)
  };
}

async function generateBusinessQuestion(interview, questionNumber) {
  const resumeQuestion = generateResumeBasedQuestion(interview, questionNumber);
  if (resumeQuestion) return resumeQuestion;
  const questions = getRubric(interview.jobId).questions;
  return questions[(questionNumber - 1) % questions.length];
}

async function generateFollowUp(interview, turn) {
  const rubric = getRubric(interview.jobId);
  const answer = (turn.answer || "").trim();
  if (answer.length < 70 || /不知道|不清楚|没想过|没有|随便|参与了一些/.test(answer)) {
    return { question: rubric.followUps.short };
  }
  if (!/我负责|我主导|我设计|我推进|我分析|我搭建|我优化|我的/.test(answer)) {
    return { question: rubric.followUps.ownership };
  }
  if (!/[0-9]|%|百分|提升|降低|增长|转化|留存|时长|成本|效率|准确率|召回|周期|通过率/.test(answer)) {
    return { question: rubric.followUps.metrics };
  }
  if (!/取舍|权衡|优先级|风险|原因|因为|所以|方案|对比|判断|选择/.test(answer)) {
    return { question: rubric.followUps.tradeoff };
  }
  if (countKeywordHits(answer, rubric.keywords) < 2) {
    return { question: rubric.followUps.role };
  }
  return { question: "" };
}

async function generateReport(interview) {
  return generateLocalReport(interview);
}

function generateLocalReport(interview) {
  const rubric = getRubric(interview.jobId);
  const answeredTurns = interview.turns.filter((turn) => turn.answer);
  const businessTurns = answeredTurns.filter((turn) => ["business", "follow_up"].includes(turn.kind));
  const allText = answeredTurns.map((turn) => turn.answer).join(" ");
  const avgLength = businessTurns.length
    ? businessTurns.reduce((sum, turn) => sum + turn.answer.length, 0) / businessTurns.length
    : 0;

  const evidenceScore = scoreEvidence(allText);
  const structureScore = scoreStructure(allText, avgLength);
  const roleScore = scoreRoleFit(rubric, allText);
  const clarityScore = scoreClarity(answeredTurns, avgLength);
  const credibilityScore = scoreCredibility(interview.resumeText, allText);

  const weightedScores = {
    professionalAbility: clamp(Math.round(14 + roleScore * 0.16 + evidenceScore * 0.06), 8, 30),
    projectBusinessUnderstanding: clamp(Math.round(12 + evidenceScore * 0.09 + structureScore * 0.07), 7, 25),
    problemAnalysis: clamp(Math.round(9 + structureScore * 0.08 + evidenceScore * 0.03), 5, 20),
    communicationClarity: clamp(Math.round(7 + clarityScore * 0.08), 4, 15),
    resumeCredibility: clamp(Math.round(4 + credibilityScore * 0.06), 3, 10)
  };

  const totalScore = Object.values(weightedScores).reduce((sum, value) => sum + value, 0);
  const logistics = extractLogistics(interview);
  const missingMetrics = !/[0-9]|%|百分|提升|降低|增长|转化|留存|时长|成本|效率|准确率|召回/.test(allText);
  const weakOwnership = !/我负责|我主导|我设计|我推进|我分析|我搭建|我优化|我的/.test(allText);
  const weakTradeoff = !/取舍|权衡|优先级|风险|原因|因为|所以|方案|对比|判断/.test(allText);

  return {
    totalScore,
    weightedScores,
    dimensionComments: {
      professionalAbility: commentByScore(weightedScores.professionalAbility, 30, "专业能力"),
      projectBusinessUnderstanding: commentByScore(weightedScores.projectBusinessUnderstanding, 25, "项目/业务理解"),
      problemAnalysis: commentByScore(weightedScores.problemAnalysis, 20, "问题分析能力"),
      communicationClarity: commentByScore(weightedScores.communicationClarity, 15, "表达清晰度"),
      resumeCredibility: commentByScore(weightedScores.resumeCredibility, 10, "简历可信度")
    },
    highlights: buildHighlights({ totalScore, missingMetrics, weakOwnership, weakTradeoff, allText }),
    improvementAdvice: buildAdvice({ missingMetrics, weakOwnership, weakTradeoff, avgLength }),
    risks: buildRisks({ missingMetrics, weakOwnership, weakTradeoff, logistics, rubric, allText }),
    interviewerConcerns: buildInterviewerConcerns({ missingMetrics, weakOwnership, weakTradeoff, rubric }),
    logistics,
    answeredTurns: answeredTurns.length,
    reportMode: "free_local_rule_based",
    roleRubric: rubric.role
  };
}

async function extractPdfText(bytes) {
  try {
    const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
    const doc = await pdfjs.getDocument({ data: new Uint8Array(bytes), disableWorker: true }).promise;
    const pageTexts = [];
    for (let pageNumber = 1; pageNumber <= doc.numPages; pageNumber += 1) {
      const page = await doc.getPage(pageNumber);
      const content = await page.getTextContent();
      pageTexts.push(content.items.map((item) => item.str).join(" "));
    }
    return pageTexts.join("\n").replace(/\s+/g, " ").trim();
  } catch (error) {
    throw new Error(`PDF 解析失败：${error.message}`);
  }
}

async function serveStatic(req, res, url) {
  const pathname = decodeURIComponent(url.pathname);
  if (pathname.startsWith("/vendor/")) {
    await serveVendor(res, pathname);
    return;
  }

  const safePath = pathname === "/" ? "/index.html" : pathname;
  const filePath = path.normalize(path.join(publicDir, safePath));
  if (!filePath.startsWith(publicDir)) {
    sendText(res, 403, "Forbidden");
    return;
  }

  try {
    const file = await fs.readFile(filePath);
    const ext = path.extname(filePath);
    res.writeHead(200, { "Content-Type": mimeTypes[ext] || "application/octet-stream" });
    res.end(file);
  } catch {
    const index = await fs.readFile(path.join(publicDir, "index.html"));
    res.writeHead(200, { "Content-Type": mimeTypes[".html"] });
    res.end(index);
  }
}

async function serveVendor(res, pathname) {
  const vendorMap = {
    "/vendor/pdf.min.mjs": path.join(localNodeModules, "pdfjs-dist", "build", "pdf.min.mjs"),
    "/vendor/pdf.worker.min.mjs": path.join(localNodeModules, "pdfjs-dist", "build", "pdf.worker.min.mjs"),
    "/vendor/tesseract.min.js": path.join(localNodeModules, "tesseract.js", "dist", "tesseract.min.js"),
    "/vendor/tesseract-worker.min.js": path.join(localNodeModules, "tesseract.js", "dist", "worker.min.js")
  };

  let filePath = vendorMap[pathname];
  if (!filePath && pathname.startsWith("/vendor/tesseract-core/")) {
    const relative = pathname.replace("/vendor/tesseract-core/", "");
    filePath = path.normalize(path.join(localNodeModules, "tesseract.js-core", relative));
    const coreRoot = path.join(localNodeModules, "tesseract.js-core");
    if (!filePath.startsWith(coreRoot)) {
      sendText(res, 403, "Forbidden");
      return;
    }
  }

  if (!filePath) {
    sendText(res, 404, "Not found");
    return;
  }

  try {
    const file = await fs.readFile(filePath);
    const ext = path.extname(filePath);
    res.writeHead(200, { "Content-Type": mimeTypes[ext] || "application/octet-stream" });
    res.end(file);
  } catch {
    sendText(res, 404, "Not found");
  }
}

async function readJson(req, limit = 2 * 1024 * 1024) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > limit) throw new Error("请求体太大。");
    chunks.push(chunk);
  }
  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function sendJson(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}

function sendText(res, status, body) {
  res.writeHead(status, { "Content-Type": "text/plain; charset=utf-8" });
  res.end(body);
}

function signToken(payload) {
  const body = Buffer.from(JSON.stringify({ ...payload, exp: Date.now() + 1000 * 60 * 60 * 24 * 30 })).toString("base64url");
  const sig = crypto.createHmac("sha256", config.sessionSecret).update(body).digest("base64url");
  return `${body}.${sig}`;
}

function authenticate(req) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = crypto.createHmac("sha256", config.sessionSecret).update(body).digest("base64url");
  const sigBuffer = Buffer.from(sig);
  const expectedBuffer = Buffer.from(expected);
  if (sigBuffer.length !== expectedBuffer.length) return null;
  if (!crypto.timingSafeEqual(sigBuffer, expectedBuffer)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

async function ensureDb() {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    await fs.access(dbPath);
  } catch {
    await writeDb({ users: {}, interviews: {} });
  }
}

async function readDb() {
  return JSON.parse(await fs.readFile(dbPath, "utf8"));
}

async function writeDb(db) {
  await fs.writeFile(dbPath, JSON.stringify(db, null, 2));
}

async function loadEnv() {
  const envPath = path.join(__dirname, ".env.local");
  try {
    const text = await fs.readFile(envPath, "utf8");
    for (const line of text.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
      const [key, ...rest] = trimmed.split("=");
      if (!process.env[key]) {
        process.env[key] = rest.join("=").replace(/^["']|["']$/g, "");
      }
    }
  } catch {
    // .env.local is optional.
  }
}

function clientInterview(interview) {
  return {
    id: interview.id,
    jobId: interview.jobId,
    jobTitle: interview.jobTitle,
    resumeName: interview.resumeName,
    resumeAnalysis: interview.resumeAnalysis,
    status: interview.status,
    createdAt: interview.createdAt,
    currentTurnId: interview.currentTurnId,
    turns: interview.turns.map((turn) => ({
      id: turn.id,
      kind: turn.kind,
      mainNumber: turn.mainNumber,
      question: turn.question,
      answer: turn.answer,
      answeredAt: turn.answeredAt
    })),
    report: interview.report
  };
}

function summarizeInterview(interview) {
  return {
    id: interview.id,
    jobTitle: interview.jobTitle,
    resumeName: interview.resumeName,
    status: interview.status,
    createdAt: interview.createdAt,
    totalScore: interview.report?.totalScore ?? null,
    report: interview.report
  };
}

function compactTurn(turn) {
  return {
    kind: turn.kind,
    mainNumber: turn.mainNumber,
    question: turn.question,
    answer: turn.answer
  };
}

function normalizeTranscript(value) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, 6000);
}

function normalizeResumeText(value) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, 12000);
}

function pickResumeSignals(text, keywords) {
  const hits = keywords.filter((keyword) => text.toLowerCase().includes(keyword.toLowerCase()));
  if (!hits.length) {
    return ["简历已成功解析，后续会通过回答验证项目经历和岗位匹配度"];
  }
  return hits.slice(0, 5).map((keyword) => `简历中出现了与“${keyword}”相关的经历线索`);
}

function pickResumeSnippets(text, keywords) {
  const sentences = splitResumeSentences(text);
  const scored = sentences
    .map((sentence) => ({
      sentence: cleanSnippet(sentence),
      score: scoreResumeSentence(sentence, keywords)
    }))
    .filter((item) => item.sentence.length >= 12 && item.score > 0)
    .sort((a, b) => b.score - a.score);

  const snippets = [];
  for (const item of scored) {
    if (snippets.some((snippet) => isSimilarSnippet(snippet, item.sentence))) continue;
    snippets.push(item.sentence);
    if (snippets.length >= 5) break;
  }
  return snippets.length ? snippets : [cleanSnippet(text.slice(0, 90))].filter(Boolean);
}

function splitResumeSentences(text) {
  return String(text || "")
    .replace(/\s+/g, " ")
    .split(/(?<=[。！？!?])|[\n\r]+| {2,}|[;；]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function scoreResumeSentence(sentence, keywords) {
  let score = 0;
  score += countKeywordHits(sentence, keywords) * 5;
  if (/项目|经历|负责|主导|参与|设计|搭建|优化|推进|研究|开发|运营|招聘/.test(sentence)) score += 4;
  if (/[0-9]|%|百分|提升|降低|增长|转化|留存|成本|效率|准确率|召回|周期|通过率/.test(sentence)) score += 4;
  if (/AI|模型|产品|算法|视频|生成|候选人|业务方|指标|用户|数据/i.test(sentence)) score += 2;
  return score;
}

function cleanSnippet(value) {
  const compact = String(value || "")
    .replace(/\s+/g, " ")
    .replace(/^[,，。；;：:\-—\s]+/, "")
    .trim();
  return truncateSnippet(compact, 90);
}

function truncateSnippet(value, maxLength) {
  if (value.length <= maxLength) return value;
  const slice = value.slice(0, maxLength);
  const boundary = Math.max(
    slice.lastIndexOf(" "),
    slice.lastIndexOf("，"),
    slice.lastIndexOf("。"),
    slice.lastIndexOf("、"),
    slice.lastIndexOf(","),
    slice.lastIndexOf(".")
  );
  if (boundary >= 36) return slice.slice(0, boundary).trim();
  return slice.trim();
}

function isSimilarSnippet(a, b) {
  return a.includes(b.slice(0, 24)) || b.includes(a.slice(0, 24));
}

function extractMetricSnippets(text) {
  return splitResumeSentences(text)
    .filter((sentence) => /[0-9]|%|百分|提升|降低|增长|转化|留存|成本|效率|准确率|召回|周期|通过率/.test(sentence))
    .map(cleanSnippet)
    .slice(0, 4);
}

function generateResumeBasedQuestion(interview, questionNumber) {
  const snippets = interview.resumeAnalysis?.resumeSnippets || [];
  if (!snippets.length) return "";
  const templates = resumeQuestionTemplates[interview.jobId] || resumeQuestionTemplates.ai_pm;
  const template = templates[(questionNumber - 1) % templates.length];
  const snippet = snippets[(questionNumber - 1) % snippets.length];
  return template.replace("{snippet}", snippet);
}

function scoreEvidence(text) {
  const patterns = [
    /[0-9]/,
    /%|百分|提升|降低|增长|转化|留存|成本|效率|准确率|召回/,
    /项目|案例|用户|业务|指标|数据|结果|上线|复盘/,
    /负责|主导|设计|推进|分析|优化|搭建|协调/
  ];
  return patterns.reduce((score, pattern) => score + (pattern.test(text) ? 25 : 0), 0);
}

function scoreStructure(text, avgLength) {
  const patterns = [/背景|目标|问题|原因/, /方案|动作|步骤|方法/, /结果|影响|指标|收益/, /风险|取舍|权衡|优先级|复盘/];
  const base = patterns.reduce((score, pattern) => score + (pattern.test(text) ? 18 : 0), 0);
  return clamp(base + Math.min(28, Math.round(avgLength / 8)), 0, 100);
}

function scoreRoleFit(rubric, text) {
  const hits = countKeywordHits(text, rubric.keywords);
  return clamp(Math.round((hits / rubric.keywords.length) * 100), 0, 100);
}

function scoreClarity(turns, avgLength) {
  if (!turns.length) return 0;
  const veryShort = turns.filter((turn) => turn.answer.length < 30).length;
  const filler = turns.filter((turn) => /嗯|然后然后|就是就是|不知道|不清楚/.test(turn.answer)).length;
  return clamp(Math.round(70 + Math.min(20, avgLength / 12) - veryShort * 8 - filler * 5), 0, 100);
}

function scoreCredibility(resumeText, answerText) {
  const resumeTerms = String(resumeText || "")
    .split(/[\s,，。；;：:、/()（）|+-]+/)
    .filter((term) => term.length >= 2)
    .slice(0, 180);
  if (!resumeTerms.length) return 45;
  const hits = new Set(resumeTerms.filter((term) => answerText.includes(term)));
  return clamp(45 + hits.size * 3, 0, 100);
}

function commentByScore(score, max, label) {
  const ratio = score / max;
  if (ratio >= 0.82) return `${label}表现较好，回答中已经有较明确的证据和岗位相关信息。`;
  if (ratio >= 0.62) return `${label}达到基础要求，但还需要补充更具体的案例、指标和判断过程。`;
  return `${label}目前偏弱，回答容易显得空泛，建议准备更完整的项目细节和量化结果。`;
}

function buildHighlights({ totalScore, missingMetrics, weakOwnership, weakTradeoff, allText }) {
  const items = [];
  if (totalScore >= 75) items.push("整体回答完成度不错，能够围绕岗位问题持续作答。");
  if (!missingMetrics) items.push("回答中出现了数据或指标意识，这是面试里比较重要的加分点。");
  if (!weakOwnership) items.push("你有意识强调自己的负责部分，比只讲团队成果更有说服力。");
  if (!weakTradeoff) items.push("回答里出现了取舍、原因或风险判断，说明不是只在复述经历。");
  if (/项目|用户|业务|模型|招聘|候选人/.test(allText)) items.push("回答中包含和目标岗位相关的关键词，可以继续展开成更强的案例。");
  return items.length ? items.slice(0, 4) : ["你完成了完整面试流程，已经有材料可以继续打磨。"];
}

function buildAdvice({ missingMetrics, weakOwnership, weakTradeoff, avgLength }) {
  const items = [];
  if (avgLength < 70) items.push("每道题尽量用“背景-行动-结果”讲满一个完整案例，避免回答过短。");
  if (missingMetrics) items.push("给每个项目补一个量化指标，例如转化率、效率、成本、准确率、周期或规模。");
  if (weakOwnership) items.push("明确讲“我负责了什么”，不要只说团队做了什么。");
  if (weakTradeoff) items.push("准备至少一个取舍案例，说明为什么这么判断、放弃了什么、承担了什么风险。");
  items.push("真实面试前，把最核心项目准备成 90 秒版本和 3 分钟版本各一版。");
  return items.slice(0, 5);
}

function buildRisks({ missingMetrics, weakOwnership, weakTradeoff, logistics, rubric, allText }) {
  const items = [];
  if (missingMetrics) items.push("劣势风险：如果缺少量化结果，面试官可能认为你的项目影响力不够清晰。");
  if (weakOwnership) items.push("可信度风险：如果个人贡献边界不清，真实面试中容易被追问到答不上来。");
  if (weakTradeoff) items.push("入职后风险：如果缺少取舍和风险意识，可能在复杂项目里依赖他人拆解问题。");
  if (!logistics.rawAnswer) items.push("现实安排风险：可实习时长、到岗时间和每周出勤没有讲清楚，会影响后续匹配判断。");
  if (countKeywordHits(allText, rubric.keywords) < 2) {
    items.push(`岗位风险：${rubric.riskLabels[0]}。`);
  }
  if (!items.length) items.push("主要风险不在基础表达，而在真实面试中能否持续提供更深的项目细节。");
  return items;
}

function buildInterviewerConcerns({ missingMetrics, weakOwnership, weakTradeoff, rubric }) {
  const concerns = [];
  if (weakOwnership) concerns.push("你在项目里的个人贡献边界到底有多大");
  if (missingMetrics) concerns.push("你提到的成果是否有可靠指标支撑");
  if (weakTradeoff) concerns.push("你遇到复杂问题时是否能独立做取舍和判断");
  concerns.push(rubric.riskLabels[0]);
  if (!concerns.length) concerns.push("你能否在下一轮继续讲出更细的项目过程、失败案例和反思");
  return `如果我是面试官，我会继续确认：${concerns.join("；")}。`;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function getRubric(jobId) {
  return jobRubrics[jobId] || jobRubrics.ai_pm;
}

function countKeywordHits(text, keywords) {
  return keywords.filter((keyword) => text.includes(keyword)).length;
}

function extractLogistics(interview) {
  const logistics = interview.turns.find((turn) => turn.kind === "logistics");
  return {
    rawAnswer: logistics?.answer || "",
    note: "请从候选人的原话里确认可实习时长、最快到岗时间和每周出勤天数。"
  };
}

function csv(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
