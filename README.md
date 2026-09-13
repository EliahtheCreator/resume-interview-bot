# AI 面试资料库

一个给求职者使用的免费面试资料库。当前聚焦三个岗位：

- AI 产品经理
- 视频生成算法
- 招聘 HR

## 已实现

- GitHub Pages 发布版打开即可使用，无需登录
- 不接模型 API，不做 agent，不产生 API 成本
- 三个岗位的核心知识点、常见问题、优秀回答、注意点和面试前清单
- 移动端自适应阅读
- 每个岗位保留参考资料链接，便于继续扩展内容

## GitHub Pages

`docs/` 目录是可直接发布到 GitHub Pages 的静态版：

```text
https://eliahthecreator.github.io/resume-interview-bot/
```

## 本地预览

```bash
cd resume-interview-bot
python3 -m http.server 4329 --directory docs
```

然后打开：

```text
http://127.0.0.1:4329/
```

## 内容来源方向

- AI 产品经理：AI 产品设计、用户体验指标、模型评估、上线风险
- 视频生成算法：视频生成评测、时序一致性、failure case、工程落地
- 招聘 HR：招聘漏斗、招聘指标、业务方协同、候选人风险判断
