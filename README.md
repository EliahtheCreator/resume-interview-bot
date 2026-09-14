# AI 面试资料库

一个给求职者使用的免费面试资料库。当前开放九个岗位：

- AI 产品经理
- 视频生成算法
- AI Infra
- 电商运营
- 产品运营
- 硬件销售（算力硬件相关）
- 招聘 HR
- HRBP
- 财务

## 已实现

- GitHub Pages 发布版打开即可使用，无需登录
- 不接模型 API，不做 agent，不产生 API 成本
- 九个岗位的岗位画像、核心考察维度、必备知识地图、高频问题、优秀回答、错误范本、风险点、追问方向、回答框架和自查评分 Rubric
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
- AI Infra：GPU 集群、推理服务、Kubernetes、MLOps、可观测性
- 电商运营：GMV、转化率、客单价、复购、活动复盘
- 产品运营：用户增长、留存、功能渗透率、用户反馈闭环
- 硬件销售：算力硬件需求诊断、GPU 服务器、售前协同、复杂销售
- 招聘 HR：招聘漏斗、招聘指标、业务方协同、候选人风险判断
- HRBP：业务理解、组织诊断、人才盘点、绩效和员工关系
- 财务：三大报表、预算、差异分析、Excel 和财务沟通
