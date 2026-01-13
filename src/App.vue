<script setup lang="ts">
import { computed, ref } from 'vue'
import ContentPanel from './components/ContentPanel.vue'
import SidebarTree from './components/SidebarTree.vue'
import { sections } from './data/topics'
import type { DocNode } from './types'

const expandedIds = ref<string[]>(sections.map((item) => item.id))

const nodeIndex = new Map<string, DocNode>()
const buildIndex = (nodes: DocNode[]) => {
  nodes.forEach((node) => {
    nodeIndex.set(node.id, node)
    if (node.children?.length) {
      buildIndex(node.children)
    }
  })
}
buildIndex(sections)

const findFirstLeaf = (nodes: DocNode[]): DocNode | undefined => {
  for (const node of nodes) {
    if (node.children?.length) {
      const childLeaf = findFirstLeaf(node.children)
      return childLeaf ?? node
    }
    return node
  }
  return undefined
}

const selectedId = ref(findFirstLeaf(sections)?.id ?? '')
const selectedNode = computed(() => nodeIndex.get(selectedId.value))

const handleSelect = (id: string) => {
  if (nodeIndex.has(id)) {
    selectedId.value = id
  }
}

const handleToggle = (id: string) => {
  const set = new Set(expandedIds.value)
  set.has(id) ? set.delete(id) : set.add(id)
  expandedIds.value = [...set]
}
</script>

<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="brand">
        <p class="overline">Vue3 Knowledge Base</p>
        <h2>前端资料仓库</h2>
        <p class="subtitle">覆盖 PC / 移动 / 跨端 / SSR / 基础</p>
      </div>
      <SidebarTree
        :nodes="sections"
        :selected-id="selectedId"
        :expanded-ids="expandedIds"
        @select="handleSelect"
        @toggle="handleToggle"
      />
    </aside>

    <main class="content">
      <ContentPanel :node="selectedNode" />
    </main>
  </div>
</template>

<style scoped>
.layout {
  display: grid;
  grid-template-columns: 340px 1fr;
  height: 100vh;
  gap: 18px;
  padding: 18px;
  background: #f9f9f9;
  overflow: hidden;
}

.sidebar {
  background: #f5f5f5;
  border: 1px solid #e6e6e6;
  border-radius: 14px;
  padding: 18px 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
  overflow-y: auto;
}

.brand {
  padding: 10px 12px;
  border: 1px solid #e1e1e1;
  border-radius: 10px;
  background: #fff;
  flex-shrink: 0;
}

.overline {
  margin: 0 0 4px;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #666;
}

h2 {
  margin: 0;
  font: 700 20px/1.2 'Inter', 'IBM Plex Sans', 'Segoe UI', sans-serif;
  color: #0f0f0f;
}

.subtitle {
  margin: 6px 0 0;
  color: #333;
  font-size: 13px;
}

.content {
  padding: 0;
  height: 100%;
  overflow-y: auto;
}

/* 右侧内容面板滚动条样式 */
.content::-webkit-scrollbar {
  width: 8px;
}

.content::-webkit-scrollbar-track {
  background: transparent;
}

.content::-webkit-scrollbar-thumb {
  background: #d0d0d0;
  border-radius: 4px;
}

.content::-webkit-scrollbar-thumb:hover {
  background: #999;
}

/* 左侧菜单滚动条样式 */
.sidebar::-webkit-scrollbar {
  width: 6px;
}

.sidebar::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar::-webkit-scrollbar-thumb {
  background: #d0d0d0;
  border-radius: 3px;
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background: #999;
}

@media (max-width: 960px) {
  .layout {
    grid-template-columns: 1fr;
    padding: 12px;
  }

  .sidebar {
    order: 2;
    height: auto;
    max-height: 300px;
    overflow-y: auto;
  }

  .content {
    order: 1;
    height: auto;
    min-height: 60vh;
    overflow-y: auto;
  }
}
</style>
