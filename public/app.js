const state = {
  token: localStorage.getItem("rib_token") || "",
  email: localStorage.getItem("rib_email") || "",
  jobs: [],
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
  isRecording: false,
  appConfig: null,
  ocrText: ""
};

const els = {
  userbar: document.querySelector("#userbar"),
  modeBadge: document.querySelector("#mode-badge"),
  loginView: document.querySelector("#login-view"),
  setupView: document.querySelector("#setup-view"),
  resumePreviewView: document.querySelector("#resume-preview-view"),
  interviewView: document.querySelector("#interview-view"),
  reportView: document.querySelector("#report-view"),
  loginForm: document.querySelector("#login-form"),
  email: document.querySelector("#email"),
  inviteCode: document.querySelector("#invite-code"),
  jobGrid: document.querySelector("#job-grid"),
  resumeFile: document.querySelector("#resume-file"),
  fileLabel: document.querySelector("#file-label"),
  startBtn: document.querySelector("#start-btn"),
  questionMeta: document.querySelector("#question-meta"),
  questionText: document.querySelector("#question-text"),
  timer: document.querySelector("#timer"),
  meterFill: document.querySelector("#meter-fill"),
  recordBtn: document.querySelector("#record-btn"),
  recordHint: document.querySelector("#record-hint"),
  wave: document.querySelector("#wave"),
  turnList: document.querySelector("#turn-list"),
  reportContent: document.querySelector("#report-content"),
  resumePreviewContent: document.querySelector("#resume-preview-content"),
  confirmInterviewBtn: document.querySelector("#confirm-interview-btn"),
  backSetupBtn: document.querySelector("#back-setup-btn"),
  exportReportBtn: document.querySelector("#export-report-btn"),
  historyList: document.querySelector("#history-list"),
  newInterviewBtn: document.querySelector("#new-interview-btn"),
  toast: document.querySelector("#toast")
};

boot();

function boot() {
  bindEvents();
  registerServiceWorker();
  loadAppConfig().catch(() => {});
  if (state.token) {
    showSetup();
  } else {
    showView("login");
  }
}

function bindEvents() {
  els.loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    await login();
  });

  els.resumeFile.addEventListener("change", () => {
    const file = els.resumeFile.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast("第一版只支持 PDF 简历。");
      els.resumeFile.value = "";
      return;
    }
    state.resumeFile = file;
    state.ocrText = "";
    els.fileLabel.textContent = file.name;
    updateStartButton();
  });

  els.startBtn.addEventListener("click", startInterview);
  els.confirmInterviewBtn.addEventListener("click", () => {
    showView("interview");
    renderInterview();
    toast("面试已开始。");
  });
  els.backSetupBtn.addEventListener("click", showSetup);
  els.exportReportBtn.addEventListener("click", exportCurrentReport);
  els.recordBtn.addEventListener("click", toggleRecording);
  els.newInterviewBtn.addEventListener("click", showSetup);
}

async function login() {
  try {
    const result = await api("/api/auth/login", {
      method: "POST",
      body: {
        email: els.email.value,
        inviteCode: els.inviteCode.value
      }
    });
    state.token = result.token;
    state.email = result.email;
    localStorage.setItem("rib_token", state.token);
    localStorage.setItem("rib_email", state.email);
    await showSetup();
  } catch (error) {
    toast(error.message);
  }
}

async function showSetup() {
  showView("setup");
  renderUserbar();
  await loadAppConfig().catch(() => {});
  await loadJobs();
  await loadHistory();
}

async function loadAppConfig() {
  const result = await api("/api/config");
  state.appConfig = result;
  renderModeBadge();
}

async function loadJobs() {
  const result = await api("/api/jobs");
  state.jobs = result.jobs;
  renderJobs();
}

async function loadHistory() {
  const result = await api("/api/history");
  renderHistory((result.history || []).filter((item) => item.status === "complete" && item.report));
}

function renderUserbar() {
  els.userbar.innerHTML = state.email
    ? `<span>${escapeHtml(state.email)}</span>`
    : "";
}

function renderModeBadge() {
  if (!state.appConfig) return;
  els.modeBadge.textContent = "完全免费本地模式";
}

function renderJobs() {
  els.jobGrid.innerHTML = state.jobs
    .map((job) => {
      const selected = job.id === state.selectedJobId ? "selected" : "";
      const locked = job.open ? "" : "locked";
      const description = job.open ? job.description : "等我吸收完这方面的知识再来考察你";
      return `
        <article class="job-option ${selected} ${locked}" data-job-id="${job.id}">
          <div>
            <span class="tag">${escapeHtml(job.category)}</span>
            <h3>${escapeHtml(job.title)}</h3>
            <p>${escapeHtml(description)}</p>
          </div>
        </article>
      `;
    })
    .join("");

  document.querySelectorAll(".job-option").forEach((item) => {
    item.addEventListener("click", () => {
      const job = state.jobs.find((entry) => entry.id === item.dataset.jobId);
      if (!job.open) {
        toast("等我吸收完这方面的知识再来考察你");
        return;
      }
      state.selectedJobId = job.id;
      renderJobs();
      updateStartButton();
    });
  });
}

function renderHistory(history) {
  if (!history.length) {
    els.historyList.innerHTML = `<p class="muted">还没有历史报告。</p>`;
    return;
  }

  els.historyList.innerHTML = history
    .map((item) => `
      <article class="history-item">
        <div>
          <h3>${escapeHtml(item.jobTitle)} ${item.totalScore ? `· ${item.totalScore} 分` : ""}</h3>
          <p class="muted small">${escapeHtml(item.resumeName || "")} · ${formatDate(item.createdAt)} · ${escapeHtml(item.status)}</p>
        </div>
        ${item.report ? `<button data-report-id="${item.id}">查看</button>` : ""}
      </article>
    `)
    .join("");

  document.querySelectorAll("[data-report-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const selected = history.find((item) => item.id === button.dataset.reportId);
      state.interview = { report: selected.report, jobTitle: selected.jobTitle };
      renderReport(selected.report);
      showView("report");
    });
  });
}

function updateStartButton() {
  els.startBtn.disabled = !(state.selectedJobId && state.resumeFile);
}

async function startInterview() {
  try {
    els.startBtn.disabled = true;
    els.startBtn.textContent = "正在读取简历...";
    const base64 = await fileToBase64(state.resumeFile);
    let result;
    try {
      result = await requestStartInterview(base64, state.ocrText);
    } catch (error) {
      if (error.code !== "NEEDS_OCR") throw error;
      els.startBtn.textContent = "正在 OCR 识别...";
      toast("这份 PDF 像扫描件，正在启动本地 OCR。首次加载会慢一些。");
      state.ocrText = await extractPdfTextWithOcr(state.resumeFile);
      if (state.ocrText.length < 80) {
        throw new Error("OCR 没有识别到足够文字。建议换一份清晰 PDF，或先把简历导出为可复制文字的 PDF。");
      }
      result = await requestStartInterview(base64, state.ocrText);
    }
    state.interview = result.interview;
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

async function requestStartInterview(base64, text = "") {
  return await api("/api/interviews/start", {
    method: "POST",
    body: {
      jobId: state.selectedJobId,
      resume: {
        name: state.resumeFile.name,
        type: state.resumeFile.type,
        base64,
        text
      }
    }
  });
}

function renderInterview() {
  const turn = getCurrentTurn();
  if (!turn) return;
  els.questionMeta.textContent = labelTurn(turn);
  els.questionText.textContent = turn.question;
  renderTurns();
  resetTimer();
}

function renderResumePreview() {
  const analysis = state.interview?.resumeAnalysis || {};
  const strengths = Array.isArray(analysis.strengths) ? analysis.strengths : [];
  const snippets = Array.isArray(analysis.resumeSnippets) ? analysis.resumeSnippets : [];
  const metrics = Array.isArray(analysis.metrics) ? analysis.metrics : [];
  const concerns = Array.isArray(analysis.concerns) ? analysis.concerns : [];
  const focus = Array.isArray(analysis.suggestedFocus) ? analysis.suggestedFocus : [];
  els.resumePreviewContent.innerHTML = `
    <section class="report-block">
      <h3>${escapeHtml(state.interview.jobTitle)} · ${escapeHtml(state.interview.resumeName)}</h3>
      <p class="muted">${escapeHtml(analysis.summary || "已完成简历解析。")}</p>
    </section>
    ${previewList("识别到的岗位相关线索", strengths)}
    ${previewList("将用于提问的简历片段", snippets)}
    ${previewList("识别到的指标/结果", metrics)}
    ${previewList("面试会重点验证", focus)}
    ${previewList("需要留意的疑点", concerns)}
    <section class="report-block">
      <h3>文本摘录</h3>
      <div class="preview-excerpt">${escapeHtml(analysis.excerpt || "暂无摘录。")}</div>
    </section>
  `;
}

function previewList(title, items) {
  const list = Array.isArray(items) && items.length ? items : ["暂无。"];
  return `
    <section class="report-block">
      <h3>${escapeHtml(title)}</h3>
      <ul>${list.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
    </section>
  `;
}

function renderTurns() {
  const answered = state.interview.turns.filter((turn) => turn.answer);
  els.turnList.innerHTML = answered.length
    ? answered.map((turn) => `
        <article class="turn-item">
          <h3>${escapeHtml(labelTurn(turn))}</h3>
          <p><strong>问：</strong>${escapeHtml(turn.question)}</p>
          <p><strong>答：</strong>${escapeHtml(turn.answer)}</p>
        </article>
      `).join("")
    : `<p class="muted">完成第一段语音后，这里会显示转写结果。</p>`;
}

async function toggleRecording() {
  if (state.isRecording) {
    stopRecording();
  } else {
    await startRecording();
  }
}

async function startRecording() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    toast("当前浏览器不支持语音识别。请先用 Chrome 试一下。");
    return;
  }

  try {
    state.finalTranscript = "";
    state.interimTranscript = "";
    state.submitAfterRecognitionStop = false;
    const recognition = new SpeechRecognition();
    recognition.lang = "zh-CN";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.addEventListener("result", (event) => {
      let interim = "";
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index];
        const text = result[0]?.transcript || "";
        if (result.isFinal) {
          state.finalTranscript += text;
        } else {
          interim += text;
        }
      }
      state.interimTranscript = interim;
      const preview = `${state.finalTranscript}${state.interimTranscript}`.trim();
      els.recordHint.textContent = preview ? `正在识别：${preview.slice(-80)}` : "正在识别语音。你可以提前提交，到 2 分钟会自动提交。";
    });

    recognition.addEventListener("end", () => {
      if (state.submitAfterRecognitionStop) {
        submitTranscript();
        return;
      }
      if (state.isRecording && state.secondsLeft > 0) {
        recognition.start();
      }
    });

    recognition.addEventListener("error", (event) => {
      if (event.error === "no-speech") return;
      toast(`语音识别失败：${event.error}`);
    });

    state.recognition = recognition;
    recognition.start();
    state.isRecording = true;
    els.recordBtn.textContent = "结束并提交";
    els.wave.classList.add("active");
    els.recordHint.textContent = "正在识别语音。你可以提前提交，到 2 分钟会自动提交。";
    startTimer();
  } catch (error) {
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
    if (state.submitAfterRecognitionStop) {
      submitTranscript();
    }
  }, 1200);
  try {
    state.recognition.stop();
  } catch {
    submitTranscript();
  }
}

async function submitTranscript() {
  if (state.isSubmittingAnswer) return;
  state.isSubmittingAnswer = true;
  state.submitAfterRecognitionStop = false;
  clearTimeout(state.submitFallbackTimer);
  try {
    const transcript = `${state.finalTranscript}${state.interimTranscript}`.trim();
    if (!transcript) {
      throw new Error("没有识别到有效语音，请重新回答这一题。");
    }
    const result = await api("/api/interviews/answer", {
      method: "POST",
      body: {
        interviewId: state.interview.id,
        transcript
      }
    });
    state.interview = result.interview;
    if (state.interview.status === "complete") {
      renderReport(state.interview.report);
      showView("report");
      await loadHistory().catch(() => {});
    } else {
      renderInterview();
    }
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

function startTimer() {
  resetTimer();
  state.timer = setInterval(() => {
    state.secondsLeft -= 1;
    updateTimer();
    if (state.secondsLeft <= 0) {
      stopRecording();
    }
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

function renderReport(report) {
  const scores = report.weightedScores || {};
  const dimensions = [
    ["professionalAbility", "专业能力", 30],
    ["projectBusinessUnderstanding", "项目/业务理解", 25],
    ["problemAnalysis", "问题分析能力", 20],
    ["communicationClarity", "表达清晰度", 15],
    ["resumeCredibility", "简历可信度", 10]
  ];

  els.reportContent.innerHTML = `
    <div class="report-block">
      <p class="eyebrow">Total</p>
      <h2>${Number(report.totalScore || 0)} / 100</h2>
    </div>

    <div class="report-block">
      <h3>加权维度</h3>
      ${dimensions.map(([key, label, max]) => {
        const value = Number(scores[key] || 0);
        return `
          <div class="score-row">
            <span>${label}</span>
            <div class="score-track"><div class="score-bar" style="width: ${Math.min(100, (value / max) * 100)}%"></div></div>
            <strong>${value}/${max}</strong>
          </div>
        `;
      }).join("")}
    </div>

    <div class="report-grid">
      ${reportBlock("亮点", report.highlights)}
      ${reportBlock("改进建议", report.improvementAdvice)}
      ${reportBlock("风险点", report.risks)}
      <section class="report-block">
        <h3>如果我是面试官，我会对你哪里有疑虑</h3>
        <p class="muted">${escapeHtml(report.interviewerConcerns || "暂无。")}</p>
      </section>
    </div>
  `;
}

function exportCurrentReport() {
  const report = state.interview?.report;
  if (!report) {
    toast("还没有可导出的报告。");
    return;
  }
  const markdown = reportToMarkdown(report, state.interview?.jobTitle || "模拟面试");
  const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const date = new Date().toISOString().slice(0, 10);
  link.href = url;
  link.download = `面试报告-${date}.md`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function reportToMarkdown(report, jobTitle) {
  const scores = report.weightedScores || {};
  return [
    `# ${jobTitle} 面试报告`,
    "",
    `总分：${Number(report.totalScore || 0)} / 100`,
    "",
    "## 加权维度",
    `- 专业能力：${Number(scores.professionalAbility || 0)} / 30`,
    `- 项目/业务理解：${Number(scores.projectBusinessUnderstanding || 0)} / 25`,
    `- 问题分析能力：${Number(scores.problemAnalysis || 0)} / 20`,
    `- 表达清晰度：${Number(scores.communicationClarity || 0)} / 15`,
    `- 简历可信度：${Number(scores.resumeCredibility || 0)} / 10`,
    "",
    markdownList("亮点", report.highlights),
    markdownList("改进建议", report.improvementAdvice),
    markdownList("风险点", report.risks),
    "## 如果我是面试官，我会对你哪里有疑虑",
    report.interviewerConcerns || "暂无。",
    ""
  ].join("\n");
}

function markdownList(title, items) {
  const list = Array.isArray(items) && items.length ? items : ["暂无。"];
  return [`## ${title}`, ...list.map((item) => `- ${item}`), ""].join("\n");
}

function reportBlock(title, items) {
  const list = Array.isArray(items) && items.length ? items : ["暂无。"];
  return `
    <section class="report-block">
      <h3>${escapeHtml(title)}</h3>
      <ul>${list.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
    </section>
  `;
}

async function api(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (options.body) {
    headers["Content-Type"] = "application/json";
  }
  if (state.token) {
    headers.Authorization = `Bearer ${state.token}`;
  }
  const response = await fetch(path, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(result.error || "请求失败。");
    error.code = result.code;
    error.status = response.status;
    error.payload = result;
    throw error;
  }
  return result;
}

async function extractPdfTextWithOcr(file) {
  const [pdfjsLib] = await Promise.all([
    import("/vendor/pdf.min.mjs"),
    loadScript("/vendor/tesseract.min.js")
  ]);
  pdfjsLib.GlobalWorkerOptions.workerSrc = "/vendor/pdf.worker.min.mjs";

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const pageCount = Math.min(pdf.numPages, 4);
  const worker = await Tesseract.createWorker("chi_sim+eng", 1, {
    workerPath: "/vendor/tesseract-worker.min.js",
    corePath: "/vendor/tesseract-core",
    logger: (message) => {
      if (message.status === "recognizing text") {
        const percent = Math.round((message.progress || 0) * 100);
        els.startBtn.textContent = `OCR 识别中 ${percent}%`;
      } else if (message.status) {
        els.startBtn.textContent = `OCR ${message.status}`;
      }
    }
  });

  const texts = [];
  try {
    for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
      els.startBtn.textContent = `OCR 第 ${pageNumber}/${pageCount} 页`;
      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 2 });
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d", { willReadFrequently: true });
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      await page.render({ canvasContext: context, viewport }).promise;
      const result = await worker.recognize(canvas);
      texts.push(result.data.text || "");
    }
  } finally {
    await worker.terminate();
  }

  return texts.join("\n").replace(/\s+/g, " ").trim();
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
  navigator.serviceWorker.register("/sw.js").catch(() => {});
}

function showView(name) {
  const views = {
    login: els.loginView,
    setup: els.setupView,
    resumePreview: els.resumePreviewView,
    interview: els.interviewView,
    report: els.reportView
  };
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

function fileToBase64(file) {
  return blobToBase64(file);
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] || "");
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function toast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("show");
  setTimeout(() => els.toast.classList.remove("show"), 3200);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatDate(value) {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}
