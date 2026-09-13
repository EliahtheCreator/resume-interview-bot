# Resume Interview Bot

一个给求职者使用的语音模拟面试 MVP。用户先选择岗位、上传 PDF 简历，再用语音完成自我介绍、5 道业务问题、最多一次追问和到岗安排确认，最后得到加权评分报告。

## 首发岗位

- AI 产品经理
- 视频生成算法
- 招聘 HR

其他岗位会展示：

> 等我吸收完这方面的知识再来考察你

## 已实现

- GitHub Pages 发布版打开即可使用，无需登录
- 不限制练习次数
- PDF 简历上传与文本提取
- 扫描版 PDF 的本地 OCR 兜底
- 浏览器语音识别，每题最多 2 分钟
- 面试状态管理：自我介绍、5 道业务题、每题最多 1 次追问、到岗安排
- 三个岗位各自独立的本地题库、追问规则和评分信号
- 加权评分报告：专业能力 30%、项目/业务理解 25%、问题分析能力 20%、表达清晰度 15%、简历可信度 10%
- 保存历史报告，不保存原始音频
- 完全免费本地模式：不调用 OpenAI 或其他付费模型 API

## 本地运行

```bash
cd resume-interview-bot
cp .env.example .env.local
npm run dev
```

默认监听本机地址。部署到服务器时可以把 `HOST` 改成平台要求的地址。

打开：

```text
http://localhost:4317
```

默认邀请码是 `demo2026`。如果设置了 `INVITED_USERS`，只有白名单邮箱可以登录：

```text
INVITED_USERS=friend1@example.com,friend2@example.com
```

## GitHub Pages 版本

`docs/` 目录是可直接发布到 GitHub Pages 的静态版。它不依赖 Node 后端，打开网页后直接进入练习，数据保存在浏览器本地：

```text
历史报告：浏览器 localStorage
PDF 解析：浏览器 PDF.js
扫描版 OCR：浏览器 Tesseract.js
语音识别：浏览器 Web Speech API
出题/追问/评分：浏览器本地规则
```

发布地址：

```text
https://eliahthecreator.github.io/resume-interview-bot/
```

GitHub Pages 静态版没有登录界面，也不做账号鉴权。

## 免费模式说明

这个版本不需要模型 API key，不会调用付费 API。各环节的实现方式是：

```text
PDF 文本提取：本地 pdfjs
扫描版 PDF：浏览器渲染页面后用 Tesseract.js OCR
语音转文字：浏览器 Web Speech API
出题：本地岗位题库
追问：本地岗位 rubric + 规则判断
评分报告：本地规则评分
```

浏览器语音识别通常不花 OpenAI 的钱，但它依赖浏览器厂商提供的能力，不同浏览器支持程度不一样。

## 扫描版 PDF

系统会先尝试直接读取 PDF 文字。如果读不到足够文本，会自动启动 OCR：

```text
PDF 页面 → 浏览器渲染成图片 → Tesseract.js 识别文字 → 继续面试
```

OCR 仍然不调用付费 API。首次使用可能较慢，因为浏览器需要加载 OCR 运行文件和语言包。为了控制速度，当前最多识别前 4 页。

## 数据保存

数据保存在：

```text
resume-interview-bot/data/db.json
```

默认保存：

- 用户邮箱
- 简历解析摘要
- 问题、语音转写文本、追问
- 评分报告

默认不保存：

- 原始录音文件

## 浏览器要求

语音输入依赖浏览器的 Web Speech API。建议优先用 Chrome 测试；如果浏览器不支持，页面会提示更换浏览器。
