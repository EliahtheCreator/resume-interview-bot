const STORAGE = {
  history: "rib_pages_history"
};

const jobs = [
  { id: "ai_pm", title: "AI 产品经理", category: "产品岗", open: true, description: "考察 AI 产品判断、需求拆解、评估指标、跨团队推进和商业化意识。" },
  { id: "video_generation_algorithm", title: "视频生成算法", category: "技术类", open: true, description: "考察扩散模型、视频生成、评测方法、工程落地和研究判断。" },
  { id: "recruiting_hr", title: "招聘 HR", category: "职能类", open: true, description: "考察岗位理解、候选人评估、招聘漏斗、沟通推进和业务协同。" },
  { id: "ai_infra", title: "AI Infra", category: "技术类", open: false },
  { id: "ecommerce_ops", title: "电商运营", category: "运营类", open: false },
  { id: "product_ops", title: "产品运营", category: "运营类", open: false },
  { id: "hardware_sales", title: "硬件销售（算力硬件相关）", category: "市场类", open: false },
  { id: "hrbp", title: "HRBP", category: "职能类", open: false },
  { id: "finance", title: "财务", category: "职能类", open: false }
];

const rubrics = {
  ai_pm: {
    role: "AI 产品经理",
    keywords: ["用户", "需求", "指标", "产品", "模型", "评估", "研发", "上线", "体验", "实验", "成本", "延迟", "安全", "AI"],
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

const state = {
  selectedJobId: "",
  resumeFile: null,
  interview: null,
  recognition: null,
  finalTranscript: "",
  interimTranscript: "",
  submitAfterRecognitionStop: false,
  submitFallbackTimer: null,
  isSubmittingAnswer: false,
  timer: null,
  secondsLeft: 120,
  isRecording: false
};

const els = {
  modeBadge: $("#mode-badge"),
  setupView: $("#setup-view"),
  resumePreviewView: $("#resume-preview-view"),
  interviewView: $("#interview-view"),
  reportView: $("#report-view"),
  jobGrid: $("#job-grid"),
  resumeFile: $("#resume-file"),
  fileLabel: $("#file-label"),
  startBtn: $("#start-btn"),
  questionMeta: $("#question-meta"),
  questionText: $("#question-text"),
  timer: $("#timer"),
  meterFill: $("#meter-fill"),
  recordBtn: $("#record-btn"),
  recordHint: $("#record-hint"),
  wave: $("#wave"),
  turnList: $("#turn-list"),
  reportContent: $("#report-content"),
  resumePreviewContent: $("#resume-preview-content"),
  confirmInterviewBtn: $("#confirm-interview-btn"),
  backSetupBtn: $("#back-setup-btn"),
  exportReportBtn: $("#export-report-btn"),
  historyList: $("#history-list"),
  newInterviewBtn: $("#new-interview-btn"),
  toast: $("#toast")
};

boot();

function boot() {
  registerServiceWorker();
  bindEvents();
  els.modeBadge.textContent = "GitHub Pages 静态版";
  showSetup();
}

function bindEvents() {
  els.resumeFile.addEventListener("change", onResumeSelected);
  els.startBtn.addEventListener("click", parseResumeAndPreview);
  els.confirmInterviewBtn.addEventListener("click", () => {
    showView("interview");
    renderInterview();
    toast("面试已开始。");
  });
  els.backSetupBtn.addEventListener("click", showSetup);
  els.recordBtn.addEventListener("click", toggleRecording);
  els.newInterviewBtn.addEventListener("click", showSetup);
  els.exportReportBtn.addEventListener("click", exportCurrentReport);
}

function showSetup() {
  showView("setup");
  renderJobs();
  renderHistory(getHistory());
}

function renderJobs() {
  els.jobGrid.innerHTML = jobs.map((job) => {
    const selected = job.id === state.selectedJobId ? "selected" : "";
    const locked = job.open ? "" : "locked";
    const description = job.open ? job.description : "等我吸收完这方面的知识再来考察你";
    return `<article class="job-option ${selected} ${locked}" data-job-id="${job.id}">
      <div><span class="tag">${escapeHtml(job.category)}</span><h3>${escapeHtml(job.title)}</h3><p>${escapeHtml(description)}</p></div>
    </article>`;
  }).join("");

  document.querySelectorAll(".job-option").forEach((item) => {
    item.addEventListener("click", () => {
      const job = jobs.find((entry) => entry.id === item.dataset.jobId);
      if (!job.open) return toast("等我吸收完这方面的知识再来考察你");
      state.selectedJobId = job.id;
      renderJobs();
      updateStartButton();
    });
  });
}

function onResumeSelected() {
  const file = els.resumeFile.files[0];
  if (!file) return;
  if (file.type !== "application/pdf") {
    els.resumeFile.value = "";
    return toast("第一版只支持 PDF 简历。");
  }
  state.resumeFile = file;
  els.fileLabel.textContent = file.name;
  updateStartButton();
}

function updateStartButton() {
  els.startBtn.disabled = !(state.selectedJobId && state.resumeFile);
}

async function parseResumeAndPreview() {
  try {
    els.startBtn.disabled = true;
    els.startBtn.textContent = "正在解析简历...";
    const job = jobs.find((item) => item.id === state.selectedJobId);
    const resumeText = await extractResumeText(state.resumeFile);
    if (resumeText.length < 80) throw new Error("没有识别到足够简历文字。请换一份更清晰的 PDF。");
    const resumeAnalysis = analyzeResume(job, resumeText);
    state.interview = createInterview(job, state.resumeFile.name, resumeText, resumeAnalysis);
    renderResumePreview();
    showView("resumePreview");
    toast("简历解析完成。请先确认解析结果。");
  } catch (error) {
    toast(error.message);
  } finally {
    els.startBtn.textContent = "解析简历";
    updateStartButton();
  }
}

async function extractResumeText(file) {
  const pdfjsLib = await import("https://cdn.jsdelivr.net/npm/pdfjs-dist@5.6.205/build/pdf.min.mjs");
  pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdn.jsdelivr.net/npm/pdfjs-dist@5.6.205/build/pdf.worker.min.mjs";
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
  const pageTexts = [];
  for (let i = 1; i <= pdf.numPages; i += 1) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    pageTexts.push(content.items.map((item) => item.str).join(" "));
  }
  const text = pageTexts.join("\n").replace(/\s+/g, " ").trim();
  if (text.length >= 80) return text;
  toast("这份 PDF 像扫描件，正在启动 OCR。首次加载会慢一些。");
  return await extractPdfTextWithOcr(pdf);
}

async function extractPdfTextWithOcr(pdf) {
  await loadScript("https://cdn.jsdelivr.net/npm/tesseract.js@7.0.0/dist/tesseract.min.js");
  const worker = await Tesseract.createWorker("chi_sim+eng", 1, {
    logger: (message) => {
      if (message.status === "recognizing text") {
        els.startBtn.textContent = `OCR 识别中 ${Math.round((message.progress || 0) * 100)}%`;
      } else if (message.status) {
        els.startBtn.textContent = `OCR ${message.status}`;
      }
    }
  });
  const texts = [];
  const pageCount = Math.min(pdf.numPages, 4);
  try {
    for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
      els.startBtn.textContent = `OCR 第 ${pageNumber}/${pageCount} 页`;
      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 2 });
      const canvas = document.createElement("canvas");
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      await page.render({ canvasContext: canvas.getContext("2d", { willReadFrequently: true }), viewport }).promise;
      const result = await worker.recognize(canvas);
      texts.push(result.data.text || "");
    }
  } finally {
    await worker.terminate();
  }
  return texts.join("\n").replace(/\s+/g, " ").trim();
}

function createInterview(job, resumeName, resumeText, resumeAnalysis) {
  return {
    id: crypto.randomUUID(),
    jobId: job.id,
    jobTitle: job.title,
    resumeName,
    resumeText: resumeText.slice(0, 12000),
    resumeAnalysis,
    status: "in_progress",
    createdAt: new Date().toISOString(),
    mainQuestionsAsked: 0,
    currentTurnId: "intro",
    turns: [{
      id: "intro",
      kind: "self_intro",
      mainNumber: 0,
      question: "请用 1-2 分钟做一个自我介绍。重点讲你的经历主线、最相关的项目，以及你为什么适合这个岗位。",
      answer: "",
      createdAt: new Date().toISOString()
    }],
    report: null
  };
}

function renderResumePreview() {
  const analysis = state.interview.resumeAnalysis;
  els.resumePreviewContent.innerHTML = `
    <section class="report-block"><h3>${escapeHtml(state.interview.jobTitle)} · ${escapeHtml(state.interview.resumeName)}</h3><p class="muted">${escapeHtml(analysis.summary)}</p></section>
    ${previewList("识别到的岗位相关线索", analysis.strengths)}
    ${previewList("将用于提问的简历片段", analysis.resumeSnippets)}
    ${previewList("识别到的指标/结果", analysis.metrics)}
    ${previewList("面试会重点验证", analysis.suggestedFocus)}
    ${previewList("需要留意的疑点", analysis.concerns)}
    <section class="report-block"><h3>文本摘录</h3><div class="preview-excerpt">${escapeHtml(analysis.excerpt || "暂无摘录。")}</div></section>`;
}

function previewList(title, items) {
  const list = Array.isArray(items) && items.length ? items : ["暂无。"];
  return `<section class="report-block"><h3>${escapeHtml(title)}</h3><ul>${list.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section>`;
}

function renderInterview() {
  const turn = getCurrentTurn();
  if (!turn) return;
  els.questionMeta.textContent = labelTurn(turn);
  els.questionText.textContent = turn.question;
  renderTurns();
  resetTimer();
}

function renderTurns() {
  const answered = state.interview.turns.filter((turn) => turn.answer);
  els.turnList.innerHTML = answered.length ? answered.map((turn) => `
    <article class="turn-item"><h3>${escapeHtml(labelTurn(turn))}</h3><p><strong>问：</strong>${escapeHtml(turn.question)}</p><p><strong>答：</strong>${escapeHtml(turn.answer)}</p></article>
  `).join("") : `<p class="muted">完成第一段语音后，这里会显示转写结果。</p>`;
}

async function toggleRecording() {
  state.isRecording ? stopRecording() : await startRecording();
}

async function startRecording() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return toast("当前浏览器不支持语音识别。请用 Chrome 试一下。");
  try {
    state.finalTranscript = "";
    state.interimTranscript = "";
    state.submitAfterRecognitionStop = false;
    const recognition = new SpeechRecognition();
    recognition.lang = "zh-CN";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.addEventListener("result", (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const text = event.results[i][0]?.transcript || "";
        event.results[i].isFinal ? state.finalTranscript += text : interim += text;
      }
      state.interimTranscript = interim;
      const preview = `${state.finalTranscript}${state.interimTranscript}`.trim();
      els.recordHint.textContent = preview ? `正在识别：${preview.slice(-80)}` : "正在识别语音。你可以提前提交，到 2 分钟会自动提交。";
    });
    recognition.addEventListener("end", () => {
      if (state.submitAfterRecognitionStop) return submitTranscript();
      if (state.isRecording && state.secondsLeft > 0) recognition.start();
    });
    recognition.addEventListener("error", (event) => {
      if (event.error !== "no-speech") toast(`语音识别失败：${event.error}`);
    });
    state.recognition = recognition;
    recognition.start();
    state.isRecording = true;
    els.recordBtn.textContent = "结束并提交";
    els.wave.classList.add("active");
    els.recordHint.textContent = "正在识别语音。你可以提前提交，到 2 分钟会自动提交。";
    startTimer();
  } catch {
    toast("无法启动语音识别，请检查浏览器麦克风权限。");
  }
}

function stopRecording() {
  if (!state.recognition || !state.isRecording) return;
  state.isRecording = false;
  state.submitAfterRecognitionStop = true;
  clearInterval(state.timer);
  clearTimeout(state.submitFallbackTimer);
  els.recordBtn.disabled = true;
  els.recordBtn.textContent = "正在提交...";
  els.wave.classList.remove("active");
  state.submitFallbackTimer = setTimeout(() => {
    if (state.submitAfterRecognitionStop) submitTranscript();
  }, 1200);
  try {
    state.recognition.stop();
  } catch {
    submitTranscript();
  }
}

function submitTranscript() {
  if (state.isSubmittingAnswer) return;
  state.isSubmittingAnswer = true;
  state.submitAfterRecognitionStop = false;
  clearTimeout(state.submitFallbackTimer);
  try {
    const transcript = `${state.finalTranscript}${state.interimTranscript}`.trim();
    if (!transcript) throw new Error("没有识别到有效语音，请重新回答这一题。");
    const turn = getCurrentTurn();
    turn.answer = transcript;
    turn.answeredAt = new Date().toISOString();
    advanceInterview(turn);
    state.interview.status === "complete" ? finishInterview() : renderInterview();
  } catch (error) {
    toast(error.message);
  } finally {
    els.recordBtn.disabled = false;
    els.recordBtn.textContent = "开始录音";
    els.recordHint.textContent = "每题最多 2 分钟。到时会自动结束并提交。";
    state.recognition = null;
    state.submitAfterRecognitionStop = false;
    state.isSubmittingAnswer = false;
  }
}

function advanceInterview(turn) {
  if (turn.kind === "self_intro") {
    state.interview.mainQuestionsAsked = 1;
    return addTurn("business", 1, generateBusinessQuestion(state.interview, 1));
  }
  if (turn.kind === "business") {
    const followUp = generateFollowUp(state.interview, turn);
    if (followUp) return addTurn("follow_up", turn.mainNumber, followUp, turn.id);
    if (state.interview.mainQuestionsAsked < 5) {
      const next = state.interview.mainQuestionsAsked + 1;
      state.interview.mainQuestionsAsked = next;
      return addTurn("business", next, generateBusinessQuestion(state.interview, next));
    }
    return addTurn("logistics", 6, "最后确认三个现实安排：你可实习时长是多久、最快什么时候可以到岗、每周可以出勤几天？");
  }
  if (turn.kind === "follow_up") {
    if (state.interview.mainQuestionsAsked < 5) {
      const next = state.interview.mainQuestionsAsked + 1;
      state.interview.mainQuestionsAsked = next;
      return addTurn("business", next, generateBusinessQuestion(state.interview, next));
    }
    return addTurn("logistics", 6, "最后确认三个现实安排：你可实习时长是多久、最快什么时候可以到岗、每周可以出勤几天？");
  }
  if (turn.kind === "logistics") {
    state.interview.status = "complete";
    state.interview.completedAt = new Date().toISOString();
    state.interview.report = generateReport(state.interview);
  }
}

function addTurn(kind, mainNumber, question, parentTurnId = null) {
  const turn = { id: crypto.randomUUID(), kind, mainNumber, parentTurnId, question, answer: "", createdAt: new Date().toISOString() };
  state.interview.turns.push(turn);
  state.interview.currentTurnId = turn.id;
}

function finishInterview() {
  saveHistory(state.interview);
  renderReport(state.interview.report);
  showView("report");
}

function analyzeResume(job, resumeText) {
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

function generateBusinessQuestion(interview, questionNumber) {
  const snippets = interview.resumeAnalysis?.resumeSnippets || [];
  if (snippets.length) {
    const templates = resumeQuestionTemplates[interview.jobId] || resumeQuestionTemplates.ai_pm;
    return templates[(questionNumber - 1) % templates.length].replace("{snippet}", snippets[(questionNumber - 1) % snippets.length]);
  }
  return getRubric(interview.jobId).questions[(questionNumber - 1) % 5];
}

function generateFollowUp(interview, turn) {
  const rubric = getRubric(interview.jobId);
  const answer = turn.answer.trim();
  if (answer.length < 70 || /不知道|不清楚|没想过|没有|随便|参与了一些/.test(answer)) return rubric.followUps.short;
  if (!/我负责|我主导|我设计|我推进|我分析|我搭建|我优化|我的/.test(answer)) return rubric.followUps.ownership;
  if (!/[0-9]|%|百分|提升|降低|增长|转化|留存|时长|成本|效率|准确率|召回|周期|通过率/.test(answer)) return rubric.followUps.metrics;
  if (!/取舍|权衡|优先级|风险|原因|因为|所以|方案|对比|判断|选择/.test(answer)) return rubric.followUps.tradeoff;
  if (countKeywordHits(answer, rubric.keywords) < 2) return rubric.followUps.role;
  return "";
}

function generateReport(interview) {
  const rubric = getRubric(interview.jobId);
  const answeredTurns = interview.turns.filter((turn) => turn.answer);
  const businessTurns = answeredTurns.filter((turn) => ["business", "follow_up"].includes(turn.kind));
  const allText = answeredTurns.map((turn) => turn.answer).join(" ");
  const avgLength = businessTurns.length ? businessTurns.reduce((sum, turn) => sum + turn.answer.length, 0) / businessTurns.length : 0;
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
  const missingMetrics = !/[0-9]|%|百分|提升|降低|增长|转化|留存|时长|成本|效率|准确率|召回/.test(allText);
  const weakOwnership = !/我负责|我主导|我设计|我推进|我分析|我搭建|我优化|我的/.test(allText);
  const weakTradeoff = !/取舍|权衡|优先级|风险|原因|因为|所以|方案|对比|判断/.test(allText);
  const logistics = { rawAnswer: interview.turns.find((turn) => turn.kind === "logistics")?.answer || "" };
  return {
    totalScore,
    weightedScores,
    highlights: buildHighlights({ totalScore, missingMetrics, weakOwnership, weakTradeoff, allText }),
    improvementAdvice: buildAdvice({ missingMetrics, weakOwnership, weakTradeoff, avgLength }),
    risks: buildRisks({ missingMetrics, weakOwnership, weakTradeoff, logistics, rubric, allText }),
    interviewerConcerns: buildInterviewerConcerns({ missingMetrics, weakOwnership, weakTradeoff, rubric }),
    reportMode: "github_pages_local"
  };
}

function renderReport(report) {
  const scores = report.weightedScores || {};
  const dimensions = [["professionalAbility", "专业能力", 30], ["projectBusinessUnderstanding", "项目/业务理解", 25], ["problemAnalysis", "问题分析能力", 20], ["communicationClarity", "表达清晰度", 15], ["resumeCredibility", "简历可信度", 10]];
  els.reportContent.innerHTML = `
    <div class="report-block"><p class="eyebrow">Total</p><h2>${Number(report.totalScore || 0)} / 100</h2></div>
    <div class="report-block"><h3>加权维度</h3>${dimensions.map(([key, label, max]) => {
      const value = Number(scores[key] || 0);
      return `<div class="score-row"><span>${label}</span><div class="score-track"><div class="score-bar" style="width: ${Math.min(100, value / max * 100)}%"></div></div><strong>${value}/${max}</strong></div>`;
    }).join("")}</div>
    <div class="report-grid">${reportBlock("亮点", report.highlights)}${reportBlock("改进建议", report.improvementAdvice)}${reportBlock("风险点", report.risks)}
    <section class="report-block"><h3>如果我是面试官，我会对你哪里有疑虑</h3><p class="muted">${escapeHtml(report.interviewerConcerns || "暂无。")}</p></section></div>`;
}

function renderHistory(history) {
  if (!history.length) {
    els.historyList.innerHTML = `<p class="muted">还没有历史报告。</p>`;
    return;
  }
  els.historyList.innerHTML = history.map((item) => `
    <article class="history-item"><div><h3>${escapeHtml(item.jobTitle)} · ${item.report.totalScore} 分</h3><p class="muted small">${escapeHtml(item.resumeName || "")} · ${formatDate(item.createdAt)} · complete</p></div><button data-report-id="${item.id}">查看</button></article>
  `).join("");
  document.querySelectorAll("[data-report-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const selected = history.find((item) => item.id === button.dataset.reportId);
      state.interview = selected;
      renderReport(selected.report);
      showView("report");
    });
  });
}

function reportBlock(title, items) {
  const list = Array.isArray(items) && items.length ? items : ["暂无。"];
  return `<section class="report-block"><h3>${escapeHtml(title)}</h3><ul>${list.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section>`;
}

function exportCurrentReport() {
  const report = state.interview?.report;
  if (!report) return toast("还没有可导出的报告。");
  const scores = report.weightedScores || {};
  const lines = [
    `# ${state.interview.jobTitle} 面试报告`, "", `总分：${report.totalScore} / 100`, "",
    "## 加权维度",
    `- 专业能力：${scores.professionalAbility || 0} / 30`,
    `- 项目/业务理解：${scores.projectBusinessUnderstanding || 0} / 25`,
    `- 问题分析能力：${scores.problemAnalysis || 0} / 20`,
    `- 表达清晰度：${scores.communicationClarity || 0} / 15`,
    `- 简历可信度：${scores.resumeCredibility || 0} / 10`, "",
    markdownList("亮点", report.highlights),
    markdownList("改进建议", report.improvementAdvice),
    markdownList("风险点", report.risks),
    "## 如果我是面试官，我会对你哪里有疑虑",
    report.interviewerConcerns || "暂无。", ""
  ];
  const url = URL.createObjectURL(new Blob([lines.join("\n")], { type: "text/markdown;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `面试报告-${new Date().toISOString().slice(0, 10)}.md`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function markdownList(title, items) {
  const list = Array.isArray(items) && items.length ? items : ["暂无。"];
  return [`## ${title}`, ...list.map((item) => `- ${item}`), ""].join("\n");
}

function getHistory() {
  return getAllHistory().filter((item) => item.status === "complete" && item.report);
}

function saveHistory(interview) {
  const history = getAllHistory().filter((item) => item.id !== interview.id);
  history.unshift(interview);
  localStorage.setItem(STORAGE.history, JSON.stringify(history.filter((item) => item.status === "complete" && item.report).slice(0, 100)));
}

function getAllHistory() {
  try {
    const history = JSON.parse(localStorage.getItem(STORAGE.history) || "[]");
    return Array.isArray(history) ? history : [];
  } catch {
    return [];
  }
}

function startTimer() {
  resetTimer();
  state.timer = setInterval(() => {
    state.secondsLeft -= 1;
    updateTimer();
    if (state.secondsLeft <= 0) stopRecording();
  }, 1000);
}

function resetTimer() {
  clearInterval(state.timer);
  state.secondsLeft = 120;
  updateTimer();
}

function updateTimer() {
  const minutes = Math.floor(state.secondsLeft / 60);
  const seconds = state.secondsLeft % 60;
  els.timer.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  els.meterFill.style.transform = `scaleX(${Math.max(0, state.secondsLeft / 120)})`;
}

function pickResumeSignals(text, keywords) {
  const hits = keywords.filter((keyword) => text.toLowerCase().includes(keyword.toLowerCase()));
  return hits.length ? hits.slice(0, 5).map((keyword) => `简历中出现了与“${keyword}”相关的经历线索`) : ["简历已成功解析，后续会通过回答验证项目经历和岗位匹配度"];
}

function pickResumeSnippets(text, keywords) {
  const scored = splitResumeSentences(text).map((sentence) => ({ sentence: cleanSnippet(sentence), score: scoreResumeSentence(sentence, keywords) })).filter((item) => item.sentence.length >= 12 && item.score > 0).sort((a, b) => b.score - a.score);
  const snippets = [];
  for (const item of scored) {
    if (snippets.some((snippet) => snippet.includes(item.sentence.slice(0, 24)) || item.sentence.includes(snippet.slice(0, 24)))) continue;
    snippets.push(item.sentence);
    if (snippets.length >= 5) break;
  }
  return snippets.length ? snippets : [cleanSnippet(text.slice(0, 90))].filter(Boolean);
}

function splitResumeSentences(text) {
  return String(text || "").replace(/\s+/g, " ").split(/(?<=[。！？!?])|[\n\r]+| {2,}|[;；]/).map((item) => item.trim()).filter(Boolean);
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
  const compact = String(value || "").replace(/\s+/g, " ").replace(/^[,，。；;：:\-—\s]+/, "").trim();
  if (compact.length <= 90) return compact;
  const slice = compact.slice(0, 90);
  const boundary = Math.max(slice.lastIndexOf(" "), slice.lastIndexOf("，"), slice.lastIndexOf("。"), slice.lastIndexOf("、"), slice.lastIndexOf(","), slice.lastIndexOf("."));
  return (boundary >= 36 ? slice.slice(0, boundary) : slice).trim();
}

function extractMetricSnippets(text) {
  return splitResumeSentences(text).filter((sentence) => /[0-9]|%|百分|提升|降低|增长|转化|留存|成本|效率|准确率|召回|周期|通过率/.test(sentence)).map(cleanSnippet).slice(0, 4);
}

function scoreEvidence(text) {
  return [/[0-9]/, /%|百分|提升|降低|增长|转化|留存|成本|效率|准确率|召回/, /项目|案例|用户|业务|指标|数据|结果|上线|复盘/, /负责|主导|设计|推进|分析|优化|搭建|协调/].reduce((score, pattern) => score + (pattern.test(text) ? 25 : 0), 0);
}

function scoreStructure(text, avgLength) {
  const base = [/背景|目标|问题|原因/, /方案|动作|步骤|方法/, /结果|影响|指标|收益/, /风险|取舍|权衡|优先级|复盘/].reduce((score, pattern) => score + (pattern.test(text) ? 18 : 0), 0);
  return clamp(base + Math.min(28, Math.round(avgLength / 8)), 0, 100);
}

function scoreRoleFit(rubric, text) {
  return clamp(Math.round(countKeywordHits(text, rubric.keywords) / rubric.keywords.length * 100), 0, 100);
}

function scoreClarity(turns, avgLength) {
  const veryShort = turns.filter((turn) => turn.answer.length < 30).length;
  const filler = turns.filter((turn) => /嗯|然后然后|就是就是|不知道|不清楚/.test(turn.answer)).length;
  return clamp(Math.round(70 + Math.min(20, avgLength / 12) - veryShort * 8 - filler * 5), 0, 100);
}

function scoreCredibility(resumeText, answerText) {
  const terms = resumeText.split(/[\s,，。；;：:、/()（）|+-]+/).filter((term) => term.length >= 2).slice(0, 180);
  return terms.length ? clamp(45 + new Set(terms.filter((term) => answerText.includes(term))).size * 3, 0, 100) : 45;
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
  if (countKeywordHits(allText, rubric.keywords) < 2) items.push(`岗位风险：${rubric.riskLabels[0]}。`);
  return items.length ? items : ["主要风险不在基础表达，而在真实面试中能否持续提供更深的项目细节。"];
}

function buildInterviewerConcerns({ missingMetrics, weakOwnership, weakTradeoff, rubric }) {
  const concerns = [];
  if (weakOwnership) concerns.push("你在项目里的个人贡献边界到底有多大");
  if (missingMetrics) concerns.push("你提到的成果是否有可靠指标支撑");
  if (weakTradeoff) concerns.push("你遇到复杂问题时是否能独立做取舍和判断");
  concerns.push(rubric.riskLabels[0]);
  return `如果我是面试官，我会继续确认：${concerns.join("；")}。`;
}

function showView(name) {
  const views = { setup: els.setupView, resumePreview: els.resumePreviewView, interview: els.interviewView, report: els.reportView };
  Object.values(views).forEach((view) => view.classList.remove("active"));
  views[name].classList.add("active");
}

function getCurrentTurn() {
  return state.interview.turns.find((turn) => turn.id === state.interview.currentTurnId);
}

function labelTurn(turn) {
  if (turn.kind === "self_intro") return "自我介绍";
  if (turn.kind === "business") return `业务问题 ${turn.mainNumber} / 5`;
  if (turn.kind === "follow_up") return `追问 ${turn.mainNumber} / 5`;
  if (turn.kind === "logistics") return "到岗安排";
  return "问题";
}

function getRubric(jobId) {
  return rubrics[jobId] || rubrics.ai_pm;
}

function countKeywordHits(text, keywords) {
  return keywords.filter((keyword) => text.includes(keyword)).length;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function toast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("show");
  setTimeout(() => els.toast.classList.remove("show"), 3200);
}

function escapeHtml(value) {
  return String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

function formatDate(value) {
  return new Intl.DateTimeFormat("zh-CN", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

function loadScript(src) {
  if (document.querySelector(`script[src="${src}"]`)) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`加载 ${src} 失败。`));
    document.head.appendChild(script);
  });
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  navigator.serviceWorker.register("sw.js").catch(() => {});
}

function $(selector) {
  return document.querySelector(selector);
}
