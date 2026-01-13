<script setup lang="ts">
import { computed, ref } from 'vue'
import ContentPanel from './components/ContentPanel.vue'
import SidebarTree from './components/SidebarTree.vue'
import { sections } from './data/topics'
import type { DocNode } from './types'

const expandedIds = ref<string[]>(sections.map((item) => item.id))
const isMobileMenuOpen = ref(false)

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
    // 移动端选择后关闭菜单
    isMobileMenuOpen.value = false
  }
}

const handleToggle = (id: string) => {
  const set = new Set(expandedIds.value)
  set.has(id) ? set.delete(id) : set.add(id)
  expandedIds.value = [...set]
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}
</script>

<template>
  <div class="layout">
    <!-- 移动端汉堡菜单按钮 -->
    <button class="hamburger" @click="toggleMobileMenu" :class="{ active: isMobileMenuOpen }">
      <span></span>
      <span></span>
      <span></span>
    </button>

    <!-- 遮罩层 -->
    <div v-if="isMobileMenuOpen" class="overlay" @click="toggleMobileMenu"></div>

    <aside class="sidebar" :class="{ open: isMobileMenuOpen }">
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
    padding: 0;
    position: relative;
  }

  /* 汉堡菜单按钮 */
  .hamburger {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    width: 44px;
    height: 44px;
    position: fixed;
    top: 12px;
    left: 12px;
    z-index: 1001;
    background: #fff;
    border: 1px solid #e6e6e6;
    border-radius: 8px;
    padding: 10px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .hamburger:hover {
    background: #f5f5f5;
  }

  .hamburger span {
    width: 100%;
    height: 2px;
    background: #0f0f0f;
    border-radius: 2px;
    transition: all 0.3s ease;
  }

  .hamburger.active span:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
  }

  .hamburger.active span:nth-child(2) {
    opacity: 0;
  }

  .hamburger.active span:nth-child(3) {
    transform: rotate(-45deg) translate(6px, -6px);
  }

  /* 遮罩层 */
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    width: 280px;
    height: 100vh;
    z-index: 1000;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
    max-height: none;
    overflow-y: auto;
  }

  .sidebar.open {
    transform: translateX(0);
  }

  .content {
    padding: 12px;
    height: 100vh;
    overflow-y: auto;
  }
}

/* 桌面端隐藏汉堡菜单和遮罩 */
@media (min-width: 961px) {
  .hamburger,
  .overlay {
    display: none;
  }
}
</style>
