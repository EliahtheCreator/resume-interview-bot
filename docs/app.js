const roles = [
  {
    id: "ai_pm",
    title: "AI 产品经理",
    category: "产品岗",
    summary: "核心不是“会不会说 AI”，而是能否把用户问题、模型能力、产品体验、评估指标和上线风险连成闭环。",
    knowledge: [
      {
        title: "AI 产品判断",
        points: [
          "先证明问题值得做，再证明 AI 是合适解法；不是所有需求都需要模型。",
          "把输入、输出、用户决策、人工兜底、异常状态和反馈闭环讲清楚。",
          "理解幻觉、延迟、成本、安全、隐私、可解释性和稳定性对体验的影响。"
        ]
      },
      {
        title: "指标与评估",
        points: [
          "产品指标看完成率、转化率、留存、使用频次、人工节省和满意度。",
          "模型指标看准确率、召回、排序质量、文本/图像/视频质量、延迟和成本。",
          "风险指标看错误率、投诉率、人工接管率、内容安全拦截率和高风险场景失败率。"
        ]
      },
      {
        title: "上线与协同",
        points: [
          "小流量灰度、A/B 实验、人工审核、回滚策略和线上监控都要提前设计。",
          "和算法对齐能力边界，和研发对齐交互与工程成本，和业务对齐目标与验收标准。",
          "优秀回答会主动讲 trade-off：体验、效果、成本、延迟、安全、上线速度之间如何取舍。"
        ]
      }
    ],
    questions: [
      {
        q: "请讲一个你做过或理解的 AI 产品项目。为什么这个场景需要 AI？",
        excellent: "我会先从用户问题说起，而不是从模型说起。比如客服质检场景，人工质检覆盖率低、反馈慢，业务希望更快发现风险话术。AI 的价值不是“自动生成结果”，而是把大量通话先做结构化分类和风险提示，让质检人员优先处理高风险样本。我的方案会包含输入数据、模型输出、人工复核、误判处理和持续标注闭环。最终用覆盖率、人工节省时长、高风险召回率、误报率和处理时效来判断是否有效。",
        notes: ["先讲用户和业务问题", "说明为什么规则方案不够", "补充评估指标和人工兜底"]
      },
      {
        q: "如果模型效果不稳定，但业务催上线，你会怎么推进？",
        excellent: "我不会直接全量上线。第一步是拆清楚“不稳定”发生在哪些 case：输入质量差、长尾问题、歧义问题，还是模型本身能力不足。第二步按风险分层：低风险场景可以灰度，高风险场景必须人工确认或先不上线。第三步设计兜底，比如置信度阈值、人工接管、提示用户补充信息、回退到规则。上线后看核心效果、错误率、人工接管率、投诉和成本。如果数据证明收益覆盖风险，再扩大流量。",
        notes: ["不要只说继续优化模型", "要有灰度、阈值、兜底和回滚", "要能讲风险分层"]
      },
      {
        q: "AI 产品上线后，你会如何设计指标？",
        excellent: "我会分三层。第一层是用户价值，例如任务完成率、处理时长、转化率、留存或满意度。第二层是模型质量，例如准确率、召回、相关性、幻觉率、延迟和单位成本。第三层是安全和运营指标，例如人工接管率、投诉率、拦截率、异常 case 占比。只看模型指标不够，因为模型分数提升不一定等于用户价值提升；只看业务指标也不够，因为可能掩盖了高风险错误。",
        notes: ["产品指标和模型指标要分开", "补安全/成本/延迟", "强调指标之间可能冲突"]
      },
      {
        q: "如何判断一个 AI 需求是真需求，还是用户对 AI 的新鲜感？",
        excellent: "我会看用户是否在没有 AI 的情况下已经有稳定替代行为，比如人工整理、复制粘贴、表格统计或外包处理。如果只是觉得 AI 很酷，但没有明确任务、频次和成本，就不是优先级高的需求。验证时我会先做低成本原型或 Wizard of Oz 测试，看用户是否愿意持续使用、是否愿意为结果纠错、是否真的节省时间或提升决策质量。",
        notes: ["讲替代行为和使用频次", "讲低成本验证", "不要把“用户说想要”当证据"]
      }
    ],
    pitfalls: [
      "只说“接入大模型”，讲不出具体用户问题。",
      "只讲功能，不讲指标、上线和兜底。",
      "不知道模型错误会如何影响真实业务。",
      "把算法、研发、业务都说成别人负责，自己的产品贡献不清。"
    ],
    checklist: [
      "准备 2 个 AI 产品案例，每个案例写清用户、方案、指标、风险。",
      "准备 1 个模型效果不稳定时的上线取舍案例。",
      "准备 1 套 AI 产品指标：产品指标、模型指标、风险指标。",
      "准备解释一次“为什么不用规则/人工/普通流程优化”。"
    ],
    sources: [
      { label: "Google People + AI Guidebook", url: "https://pair.withgoogle.com/guidebook/" },
      { label: "Google HEART Framework", url: "https://research.google/pubs/measuring-the-user-experience-on-a-large-scale-user-centered-metrics-for-web-applications/" }
    ]
  },
  {
    id: "video_algorithm",
    title: "视频生成算法",
    category: "技术类",
    summary: "面试重点通常不是背名词，而是能否解释视频生成的时序问题、实验定位、评测方法和工程落地约束。",
    knowledge: [
      {
        title: "模型与任务理解",
        points: [
          "视频生成比图像生成多了时间维度，常见问题包括闪烁、主体漂移、动作不自然和长时一致性差。",
          "回答项目时要讲清任务、数据、模型路线、训练资源、损失/采样、评测和个人贡献。",
          "常见路线会涉及扩散模型、Transformer、时空注意力、条件控制、多模态对齐和推理优化。"
        ]
      },
      {
        title: "Failure Case 定位",
        points: [
          "主体漂移可能来自身份特征约束不足、长时依赖弱、训练数据分布或条件控制不稳定。",
          "闪烁可能来自帧间一致性不足、采样噪声、后处理或解码过程不稳定。",
          "动作不自然要看数据质量、运动建模、文本条件、物理常识和评测偏差。"
        ]
      },
      {
        title: "评测与落地",
        points: [
          "视频质量不能只靠主观好看，要综合画面质量、时序一致性、主体一致性、运动合理性和文本对齐。",
          "常见评测会参考 FVD、CLIP 类对齐指标、人评和更细粒度 benchmark，但单一指标都有偏差。",
          "产品落地要考虑推理速度、显存、吞吐、成本、稳定性、内容安全和线上监控。"
        ]
      }
    ],
    questions: [
      {
        q: "请介绍一个视频生成或多模态生成项目，你具体负责什么？",
        excellent: "我会按任务、数据、模型、实验和结论来讲。例如任务是根据文本生成短视频，数据包含若干类别和时长分布，模型基于扩散框架并加入时空注意力。我负责的是训练数据清洗和评测分析：先过滤低质量、字幕不匹配和运动异常样本，再设计评测维度，包括文本对齐、画面质量、主体一致性和闪烁。实验中我做了数据清洗前后的对照，发现清洗后主观一致性和失败 case 比例都有改善。",
        notes: ["必须讲个人负责部分", "要有实验变量和对照", "不要只堆模型名词"]
      },
      {
        q: "视频生成相比图像生成，为什么更容易出现时序一致性问题？",
        excellent: "图像生成只需要单帧质量足够好，但视频生成要求连续帧在主体、背景、动作和光照上保持一致。扩散采样过程里，每一帧或每个时间片都可能引入噪声，如果模型对长时依赖和运动规律建模不足，就会出现闪烁、身份漂移或动作跳变。此外，训练数据里的镜头切换、压缩噪声、字幕不对齐也会放大这个问题。",
        notes: ["讲时间维度", "讲长时依赖和运动建模", "补数据质量因素"]
      },
      {
        q: "如果生成结果出现闪烁或身份漂移，你会怎么定位？",
        excellent: "我会先把 failure case 分类：是局部纹理闪烁、主体身份变化、背景变化，还是运动轨迹异常。然后分别检查数据、条件输入、模型结构和采样策略。数据上看是否有低质量或剪辑突变样本；条件上看文本、参考图或控制信号是否稳定；模型上看时空注意力或一致性约束是否不足；采样上看步数、CFG、噪声和解码设置。最后用对照实验验证，而不是只凭肉眼猜。",
        notes: ["先分类 failure case", "再按数据/条件/模型/采样拆解", "强调对照实验"]
      },
      {
        q: "你如何评价一个视频生成模型？",
        excellent: "我会把评测拆成客观指标、人评和线上指标。客观指标可以参考 FVD、文本-视频对齐、主体一致性、运动合理性等，但这些指标不能完全代表用户感受。人评需要设计明确维度，比如画面质量、时序一致性、文本符合度和是否有明显 artifact。产品落地还要看推理耗时、显存、成本、失败率和安全审核通过率。",
        notes: ["不要只说 FVD", "补人评维度", "补推理成本和安全"]
      }
    ],
    pitfalls: [
      "只背 diffusion、Transformer、LoRA 等词，无法解释实验细节。",
      "把视频生成问题当成图像生成问题回答，忽略时间维度。",
      "没有 failure case 分类和定位思路。",
      "只看论文指标，不考虑线上速度、成本、稳定性和安全。"
    ],
    checklist: [
      "准备 1 个最熟项目：数据、模型、训练、评测、结论。",
      "准备 3 类 failure case：闪烁、身份漂移、动作异常。",
      "准备一套视频生成评测维度：质量、一致性、对齐、运动、成本。",
      "准备质量/速度/显存/成本之间的取舍回答。"
    ],
    sources: [
      { label: "VBench: Comprehensive Benchmark Suite for Video Generative Models", url: "https://arxiv.org/abs/2311.17982" },
      { label: "Fréchet Video Distance and video evaluation discussion", url: "https://openaccess.thecvf.com/content/CVPR2024/html/Ge_On_the_Content_Bias_in_Frechet_Video_Distance_CVPR_2024_paper.html" }
    ]
  },
  {
    id: "recruiting_hr",
    title: "招聘 HR",
    category: "职能类",
    summary: "招聘 HR 面试看重的不是“会沟通”四个字，而是岗位理解、人才画像、漏斗数据、候选人判断和业务方管理。",
    knowledge: [
      {
        title: "岗位理解与人才画像",
        points: [
          "把 JD 翻译成可筛选标准：必备条件、加分项、不可接受项、团队阶段和业务目标。",
          "优秀 HR 会用样例候选人和面试反馈校准业务方，而不是被动转发简历。",
          "候选人判断要有证据：项目经历、稳定性、动机、薪资预期、到岗时间和沟通质量。"
        ]
      },
      {
        title: "HR 面的真正目的",
        points: [
          "HR 面通常不是再次考察专业深度，而是了解职业规划、求职动机、岗位适配度和入职可能性。",
          "可以围绕候选人的研究/项目经历、转行原因、实习经历和择业标准做适度追问。",
          "业务问题只需要问到能判断综合素质和意向度的程度，专业深挖应交给业务面试官。"
        ]
      },
      {
        title: "招聘实习生 SOP",
        points: [
          "Sourcing 不只是按 JD 找人，也可以以人配岗：看候选人适合哪个岗位，提高简历复用率。",
          "在经验匹配和能力匹配之间区分问题：先校准经历，再逐步判断能力、数据思维和可迁移性。",
          "持续记录不通过原因，区分经验不匹配、能力不匹配、意向不匹配和流程原因，形成自己的画像方法论。",
          "遇到不懂业务、招聘需求或 HC 规划的问题，要主动向 mentor/业务方确认，不要凭猜测筛人。"
        ]
      },
      {
        title: "前置沟通与候选人体验",
        points: [
          "前置沟通不是正式 HR 面，不要刨根问底或过度介绍；重点收集流程进度、到岗时间、实习时长、出勤和期望。",
          "要向候选人准确介绍公司、业务、岗位实际内容和面试流程，不能用模糊承诺换取推进。",
          "简历推送给业务方时，补充作品集/主页、候选人优势、劣势、风险点，以及其他流程、薪资预期和到岗信息。",
          "面试前提醒双方，面试后及时催反馈并同步进度；候选人体验本身也会影响到场率和 Offer 接受率。"
        ]
      },
      {
        title: "招聘漏斗",
        points: [
          "常见指标包括简历通过率、面试到场率、面试通过率、offer 接受率、招聘周期和渠道质量。",
          "漏斗掉点要定位原因：渠道不准、筛选标准不清、面试体验差、薪资不匹配或业务反馈慢。",
          "不要只说“多找简历”，要讲渠道策略、候选人运营、业务协同和转化提升。"
        ]
      },
      {
        title: "Offer、到岗与风险",
        points: [
          "候选人风险包括能力不匹配、动机不稳定、薪资预期偏差、入职时间不确定和文化适配风险。",
          "业务方风险包括标准漂移、反馈慢、面试评价不一致和只要满分候选人。",
          "Offer 沟通先了解候选人的其他流程、真实顾虑和择业偏好，再基于真实优势做信息补充，不要强行施压。",
          "确认接受 Offer 后仍要跟进到正式入职；确认拒绝后记录原因并同步业务，用于优化岗位和流程。"
        ]
      }
    ],
    questions: [
      {
        q: "请讲一个你负责过的招聘岗位，你如何理解业务需求并转化为筛选标准？",
        excellent: "我会先和业务方确认岗位目标：为什么现在招、入职后解决什么问题、团队阶段是什么。然后把 JD 拆成必备项和加分项，例如经验年限、行业背景、核心技能、项目复杂度、沟通要求和到岗时间。接着用 3-5 份样例简历和业务方校准，确认哪些可以放宽，哪些不能妥协。筛选时我会记录通过和淘汰原因，后续用面试反馈反推画像是否准确。",
        notes: ["先讲业务目标", "把 JD 拆成可筛选标准", "用样例候选人校准"]
      },
      {
        q: "候选人简历匹配但面试表现一般，你会如何判断是否继续推进？",
        excellent: "我不会只凭“感觉一般”决定。先看表现一般是能力问题、表达问题、准备不足，还是岗位期望不匹配。再对照岗位关键要求：如果核心能力不达标，就不应推进；如果只是表达不完整但项目证据强，可以补充追问或安排下一轮验证。我会把证据同步给业务方，比如哪些问题回答薄弱、哪些经历仍有价值、继续推进需要验证什么。",
        notes: ["区分能力问题和表达问题", "回到岗位核心要求", "给业务方证据而不是情绪判断"]
      },
      {
        q: "如果业务方频繁变化 JD 或评价标准，你会怎么处理？",
        excellent: "我会先把变化显性化：哪些条件变了，为什么变，影响哪些候选人和招聘周期。然后组织一次校准，把业务目标、必备项、加分项和淘汰项重新确认，并用候选人样例对齐标准。如果业务方持续变化，我会建立反馈表和周复盘机制，让每次面试评价沉淀成可复用标准，而不是每轮重新解释。",
        notes: ["不要只说加强沟通", "要有校准机制", "说明对周期和候选人体验的影响"]
      },
      {
        q: "你如何提升招聘漏斗转化率？",
        excellent: "我会先看漏斗数据定位掉点。如果简历通过率低，可能是渠道或画像问题；如果到场率低，可能是候选人意向维护不足；如果面试通过率低，可能是筛选标准不准；如果 offer 接受率低，可能是薪资、岗位吸引力或流程体验问题。针对不同环节采取动作，例如重做渠道画像、优化触达话术、缩短反馈时间、提前管理薪资预期和加强候选人沟通。",
        notes: ["先看数据再讲动作", "按漏斗环节拆", "补 offer 和候选人体验"]
      },
      {
        q: "HR 面要问哪些问题，才能判断候选人的职业规划和求职动机？",
        excellent: "我会从经历变化和当前选择两条线问。比如过去主要做什么、为什么转方向、为什么离开上一段经历、为什么投递这个团队、未来希望积累什么能力。追问重点不是把候选人问到紧张，而是看逻辑是否连贯、对岗位是否了解、动机是否真实，以及目标岗位能否满足他的预期。最后再结合其他流程和到岗条件判断入职概率。",
        notes: ["HR 面不等于技术面", "看逻辑、动机和稳定性", "结合岗位和现实条件判断"]
      },
      {
        q: "前置沟通和正式 HR 面有什么区别？",
        excellent: "前置沟通的目标是建立基本信息和意向对齐，确认岗位、流程、到岗、实习时长、出勤和其他面试进度，不需要刨根问底。正式 HR 面则要系统了解职业规划、求职动机、择业标准、岗位适配和入职风险。前置沟通中遇到超出 HR 专业范围的深度业务问题，我会诚实说明并引导候选人在业务面和面试官深入交流。",
        notes: ["区分沟通目的", "信息准确但不过度承诺", "不懂的业务问题不要硬答"]
      },
      {
        q: "候选人手里有多个 Offer，且对我们有所顾虑，你会怎么沟通？",
        excellent: "我会先问清楚候选人比较的维度：公司和业务、工作内容、成长机会、待遇、地点、团队和到岗安排，再确认他对我们最大的顾虑。之后只针对顾虑补充真实信息，例如岗位实际工作、团队支持、发展空间和流程安排；如果确实存在不可协商的限制，就直接说明。优秀候选人可以争取合理协商，但不能通过夸大承诺或制造焦虑来促成接受。",
        notes: ["先问顾虑再介绍优势", "围绕候选人的择业标准沟通", "避免强推和虚假承诺"]
      },
      {
        q: "候选人面试通过后，HR 还需要继续做什么？",
        excellent: "首先及时同步下一步流程、时间和需要准备的材料；如果进入 Offer 阶段，要确认候选人的期望、其他流程、顾虑和到岗信息。候选人接受后继续跟进到正式入职，提前确认时间、地点、材料和变化；如果候选人拒绝，记录真实原因并同步业务，区分薪资、地点、岗位内容、流程体验还是候选人自身计划问题。这样招聘工作才形成闭环。",
        notes: ["面试通过不是流程终点", "接受后跟进到入职", "拒绝原因要沉淀复盘"]
      }
    ],
    pitfalls: [
      "只说自己沟通能力强，但讲不清招聘指标和岗位画像。",
      "把招聘理解成收简历、约面试，没有漏斗和转化意识。",
      "候选人风险判断没有证据，只有主观印象。",
      "面对业务方变化只被动执行，没有校准和复盘机制。",
      "把 HR 面做成技术面，或者在前置沟通时过度承诺薪资、职责和发展。",
      "只关注候选人是否接受 Offer，不关注入职前流失和候选人体验。"
    ],
    checklist: [
      "准备 1 个完整招聘案例：岗位背景、画像、渠道、漏斗、结果。",
      "背熟常见招聘指标：time to fill、time to hire、offer acceptance rate、quality of hire。",
      "准备 1 个业务方改 JD 的推进案例。",
      "准备 1 个候选人风险识别案例。",
      "准备一套 HR 面问题：岗位理解、经历深挖、职业规划、求职动机、其他流程、择业因素和到岗信息。",
      "准备 1 个候选人从面试通过到 Offer 再到入职的跟进案例。"
    ],
    sources: [
      { label: "SHRM Recruiting Metrics", url: "https://www.shrm.org/topics-tools/news/talent-acquisition/targeted-recruiting-metrics-will-improve-hiring" },
      { label: "LinkedIn Talent Blog: Recruiting metrics", url: "https://www.linkedin.com/business/talent/blog/talent-strategy/recruiting-metrics" },
      { label: "参考文档：招聘实习生 · 通用工作SOP", url: "https://feishu.doubao.com/docx/MmXCdcn0IoXeADxtQg4cZmLRnpg" },
      { label: "参考文档：实习生HR面试框架", url: "https://feishu.doubao.com/docx/ERS8dQA74opfi0xWxcCcjiLmnlb" }
    ]
  }
];

const state = {
  activeRoleId: roles[0].id
};

const els = {
  tabs: document.querySelector("#role-tabs"),
  content: document.querySelector("#library-content")
};

render();

function render() {
  renderTabs();
  renderRole();
}

function renderTabs() {
  els.tabs.innerHTML = roles.map((role) => `
    <button type="button" class="${role.id === state.activeRoleId ? "active" : ""}" data-role-id="${role.id}">
      <span>${escapeHtml(role.category)}</span>
      ${escapeHtml(role.title)}
    </button>
  `).join("");

  els.tabs.querySelectorAll("[data-role-id]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeRoleId = button.dataset.roleId;
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
}

function renderRole() {
  const role = roles.find((item) => item.id === state.activeRoleId) || roles[0];
  els.content.innerHTML = `
    <article class="role-hero">
      <p class="eyebrow">${escapeHtml(role.category)}</p>
      <h2>${escapeHtml(role.title)}</h2>
      <p>${escapeHtml(role.summary)}</p>
    </article>

    <section class="section">
      <div class="section-head">
        <p class="eyebrow">Knowledge</p>
        <h2>核心知识点</h2>
      </div>
      <div class="knowledge-grid">
        ${role.knowledge.map(renderKnowledge).join("")}
      </div>
    </section>

    <section class="section">
      <div class="section-head">
        <p class="eyebrow">Q&A</p>
        <h2>常见问题与优秀回答</h2>
      </div>
      <div class="qa-list">
        ${role.questions.map(renderQuestion).join("")}
      </div>
    </section>

    <section class="section two-column">
      <div>
        <div class="section-head compact">
          <p class="eyebrow">Pitfalls</p>
          <h2>常见扣分点</h2>
        </div>
        <ul class="plain-list">${role.pitfalls.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </div>
      <div>
        <div class="section-head compact">
          <p class="eyebrow">Checklist</p>
          <h2>面试前准备</h2>
        </div>
        <ul class="plain-list">${role.checklist.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </div>
    </section>

    <section class="section source-section">
      <div class="section-head compact">
        <p class="eyebrow">Sources</p>
        <h2>参考资料</h2>
      </div>
      <div class="source-list">${role.sources.map((source) => `<a href="${escapeHtml(source.url)}" target="_blank" rel="noreferrer">${escapeHtml(source.label)}</a>`).join("")}</div>
    </section>
  `;
}

function renderKnowledge(section) {
  return `
    <article class="card">
      <h3>${escapeHtml(section.title)}</h3>
      <ul>${section.points.map((point) => `<li>${escapeHtml(point)}</li>`).join("")}</ul>
    </article>
  `;
}

function renderQuestion(item, index) {
  return `
    <article class="qa-card">
      <div class="question-index">${String(index + 1).padStart(2, "0")}</div>
      <div>
        <h3>${escapeHtml(item.q)}</h3>
        <p class="answer">${escapeHtml(item.excellent)}</p>
        <div class="note-row">${item.notes.map((note) => `<span>${escapeHtml(note)}</span>`).join("")}</div>
      </div>
    </article>
  `;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
