# Vue3 前端资料仓库

一个黑白简洁风的 Vue3 + Vite 资料仓库，提供左侧多级分类菜单与右侧内容展示区，覆盖 Vue3 核心、JS/TS/CSS 基础、PC/移动端组件库、跨端、小程序、SSR、工程化与质量保障等条目。

## 技术栈

- **框架**: Vue 3 + TypeScript
- **构建工具**: Vite (Rolldown)
- **样式**: 纯 CSS (黑白简约风格)
- **特性**: 
  - ✅ 组合式 API (Composition API)
  - ✅ 响应式多级树形菜单
  - ✅ 动态内容面板展示
  - ✅ 完全类型安全

## 快速开始

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```
访问 http://localhost:5173

### 生产构建
```bash
npm run build
```

### 预览构建结果
```bash
npm run preview
```

## 项目结构

```
src/
├── components/
│   ├── SidebarTree.vue   # 左侧多级菜单组件
│   └── ContentPanel.vue  # 右侧内容展示面板
├── data/
│   └── topics.ts         # 资料数据源（可扩展）
├── types.ts              # TypeScript 类型定义
├── App.vue               # 主应用组件
└── main.ts               # 应用入口
```

## 功能特性

### 左侧菜单
- 多级分类树形结构
- 展开/折叠交互
- 当前选中状态高亮
- 标签（tags）展示

### 右侧面板
- 章节标题与摘要
- 必知要点列表
- 细分章节卡片
- 响应式布局

### 数据分类
- **Vue3 核心**: 组合式 API、响应式系统、SFC、Router、Pinia
- **Web 基础**: JS/TS/CSS 基础与工程规范
- **UI 组件库**: PC 端、移动端、设计体系
- **跨端方案**: Electron、Tauri、uni-app、Taro
- **小程序**: 微信、支付宝原生与跨端
- **SSR**: Nuxt 3、预渲染与同构
- **工程化**: Vite、构建优化、Monorepo
- **质量保障**: 测试、性能、安全、监控

## 自定义数据

编辑 [src/data/topics.ts](src/data/topics.ts) 文件，按照 `DocNode` 接口定义添加或修改资料条目：

```typescript
interface DocNode {
  id: string
  title: string
  summary: string
  tags?: string[]
  topics?: string[]
  children?: DocNode[]
}
```

## 浏览器支持

支持所有现代浏览器（Chrome、Firefox、Safari、Edge 最新版本）

## License

MIT
