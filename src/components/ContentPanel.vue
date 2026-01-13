<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import type { DocNode } from '../types'
import { highlightCode } from '@/utils/highlight'

const props = defineProps<{
  node?: DocNode
}>()

// 存储高亮后的 HTML
const highlightedCode = ref(new Map<string, string>())

// 内容面板容器引用
const panelContainer = ref<HTMLElement>()

// 高亮代码块的函数
async function highlightCodeExamples() {
  if (props.node?.codeExamples) {
    const highlighted = new Map<string, string>()
    
    for (const example of props.node.codeExamples) {
      const key = example.title
      const language = example.language || 'typescript'
      const html = await highlightCode(example.code, language)
      highlighted.set(key, html)
    }
    
    highlightedCode.value = highlighted
  } else {
    highlightedCode.value = new Map()
  }
}

// 滚动到顶部
function scrollToTop() {
  // 滚动父容器（.content）
  const contentContainer = panelContainer.value?.parentElement
  if (contentContainer) {
    contentContainer.scrollTo({
      top: 0,
      behavior: 'instant'
    })
  }
}

// 初始化时高亮
onMounted(highlightCodeExamples)

// 监听 node 变化，重新高亮并滚动到顶部
watch(() => props.node, async () => {
  await highlightCodeExamples()
  await nextTick()
  scrollToTop()
})
</script>

<template>
  <section class="panel" v-if="node" ref="panelContainer">
    <header class="panel-header">
      <div>
        <p class="eyebrow">Vue3 Resource Hub</p>
        <h1>{{ node.title }}</h1>
        <p class="summary">{{ node.summary }}</p>
      </div>
      <div v-if="node.tags?.length" class="tag-row">
        <span v-for="tag in node.tags" :key="tag" class="pill">{{ tag }}</span>
      </div>
    </header>

    <div class="body">
      <!-- 详细说明 -->
      <div v-if="node.description" class="block">
        <p class="block-title">📖 详细说明</p>
        <div class="content-text">{{ node.description }}</div>
      </div>

      <!-- 必知要点 -->
      <div v-if="node.topics?.length" class="block">
        <p class="block-title">⭐ 必知要点</p>
        <ul>
          <li v-for="topic in node.topics" :key="topic">{{ topic }}</li>
        </ul>
      </div>

      <!-- 使用场景 -->
      <div v-if="node.useCases?.length" class="block">
        <p class="block-title">💡 使用场景</p>
        <ul class="use-cases">
          <li v-for="useCase in node.useCases" :key="useCase">{{ useCase }}</li>
        </ul>
      </div>

      <!-- 最佳实践 -->
      <div v-if="node.bestPractices?.length" class="block">
        <p class="block-title">✅ 最佳实践</p>
        <ul class="best-practices">
          <li v-for="practice in node.bestPractices" :key="practice">{{ practice }}</li>
        </ul>
      </div>

      <!-- 代码示例 -->
      <div v-if="node.codeExamples?.length" class="block">
        <p class="block-title">💻 代码示例</p>
        <div class="code-examples">
          <div v-for="(example, index) in node.codeExamples" :key="index" class="code-example">
            <p class="example-title">{{ example.title }}</p>
            <div 
              v-if="highlightedCode.has(example.title)"
              class="code-highlight"
              v-html="highlightedCode.get(example.title)"
            ></div>
            <pre v-else><code>{{ example.code }}</code></pre>
          </div>
        </div>
      </div>

      <!-- 相关资源 -->
      <div v-if="node.resources?.length" class="block">
        <p class="block-title">🔗 学习资源</p>
        <div class="resources">
          <div v-for="resource in node.resources" :key="resource.title" class="resource-item">
            <a v-if="resource.url" :href="resource.url" target="_blank" rel="noopener">
              {{ resource.title }} ↗
            </a>
            <span v-else>{{ resource.title }}</span>
          </div>
        </div>
      </div>

      <!-- 细分章节 -->
      <div v-if="node.children?.length" class="block">
        <p class="block-title">📚 细分章节</p>
        <div class="chips">
          <span v-for="child in node.children" :key="child.id" class="chip">
            {{ child.title }} — {{ child.summary }}
          </span>
        </div>
      </div>

      <div class="note" v-if="!node.description && !node.useCases && !node.bestPractices">
        <p>💡 提示：点击左侧任意分支即可在此处查看详细内容。部分章节内容正在持续完善中...</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.panel {
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 10px;
  padding: 24px;
  box-shadow: 0 12px 45px rgba(0, 0, 0, 0.06);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: flex-start;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 14px;
}

.eyebrow {
  letter-spacing: 0.08em;
  font-size: 12px;
  text-transform: uppercase;
  color: #666;
  margin: 0 0 4px;
}

h1 {
  margin: 0;
  font: 700 24px/1.3 "Inter", "IBM Plex Sans", "Segoe UI", sans-serif;
  color: #0f0f0f;
}

.summary {
  margin: 6px 0 0;
  color: #333;
  font-size: 14px;
  line-height: 1.6;
}

.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.pill {
  border: 1px solid #111;
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.body {
  padding-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.block-title {
  font-weight: 700;
  font-size: 14px;
  margin: 0 0 10px;
  letter-spacing: 0.01em;
  color: #0f0f0f;
}

.content-text {
  color: #171717;
  line-height: 1.7;
  font-size: 14px;
  white-space: pre-line;
}

ul {
  margin: 0;
  padding-left: 20px;
  color: #171717;
  line-height: 1.7;
  font-size: 14px;
}

ul li {
  margin-bottom: 6px;
}

.use-cases li {
  color: #333;
}

.best-practices li {
  color: #111;
  font-weight: 500;
}

.resources {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.resource-item a {
  color: #0066cc;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s;
}

.resource-item a:hover {
  color: #0052a3;
  text-decoration: underline;
}

.resource-item span {
  color: #555;
  font-size: 14px;
}

.code-examples {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.code-example {
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  overflow: hidden;
  background: #fafafa;
}

.example-title {
  margin: 0;
  padding: 10px 14px;
  background: #f0f0f0;
  font-size: 13px;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid #e5e5e5;
}

/* Shiki 高亮代码样式 */
.code-highlight {
  padding: 14px;
  background: #fff;
  overflow-x: auto;
  font-size: 13px;
  line-height: 1.6;
}

.code-highlight :deep(pre) {
  margin: 0;
  padding: 0;
  background: transparent;
  overflow: visible;
}

.code-highlight :deep(code) {
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.6;
  color: #1f1f1f;
}

.code-highlight :deep(.line) {
  display: inline-block;
  width: 100%;
}

.code-example pre {
  margin: 0;
  padding: 14px;
  overflow-x: auto;
  background: #fff;
}

.code-example code {
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.6;
  color: #1f1f1f;
  display: block;
}

.chips {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.chip {
  display: block;
  padding: 10px 12px;
  border: 1px dashed #c9c9c9;
  border-radius: 8px;
  color: #111;
  background: #fafafa;
}

.note {
  padding: 12px 14px;
  border-left: 3px solid #111;
  background: #f7f7f7;
  color: #333;
  font-size: 13px;
  line-height: 1.6;
}
</style>
