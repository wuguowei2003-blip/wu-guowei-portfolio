# 吴国伟 · 个人简历与作品集

纯静态个人网站，包含完整个人介绍、工作经历、项目案例、视频作品与设计作品。

## GitHub Pages

在仓库 Settings → Pages 中，选择 **Deploy from a branch**，发布来源为 **main / (root)**。
入口为 `index.html`，无需安装依赖或执行构建。`.nojekyll` 禁用 Jekyll 处理。
页面与资源使用相对路径，兼容 GitHub Pages 项目路径。

## 更新内容

- 个人介绍和经历：`index.html`
- 页面样式：`style.css`、`refined.css`、`profile.css`、`design.css`
- 视频列表：`videos.json`；视频与封面：`media/`
- 设计作品列表：`design.json`；作品图片：`design/`
- 动效和播放器：`app.js`；设计画廊：`design.js`
- 下载简历：`resume.pdf`

本地预览可在此目录执行 `python -m http.server 8000`，然后访问 `http://localhost:8000`。
通过 HTTP 预览才能正常读取作品 JSON 数据。

作品素材仅用于个人作品展示，未授予第三方复制或再分发许可。
