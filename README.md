# 智齿录小程序 (Health Tracker Mini Program)

基于中医舌诊的健康评估小程序

## 功能特性

- 多步骤向导式用户界面
- 基本信息收集 (姓名、性别、年龄)
- 舌诊问答调查 (4个健康相关问题)
- 舌头图片拍摄与上传
- 云端AI分析与健康建议
- 现代化卡片式UI设计

## 技术栈

- 微信小程序框架
- WeChat Cloud Development (云开发)
- WXML/WXSS/JavaScript
- 云函数后端服务
- 云存储图片处理

## 项目结构

```
zhijilu1/
├── miniprogram/          # 小程序前端代码
│   ├── pages/
│   │   └── index/        # 主页面 (多步骤向导)
│   ├── components/       # 组件
│   └── images/          # 图片资源
├── cloudfunctions/      # 云函数
│   ├── analyze/         # 舌诊分析云函数
│   └── quickstartFunctions/  # 基础云函数
└── README.md
```

## 开发指南

1. 安装微信开发者工具
2. 开通云开发服务
3. 配置app.js中的云环境ID
4. 上传并部署云函数
5. 预览和调试小程序

## 参考文档

- [云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)
- [小程序开发文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
