<script setup lang="ts">
import type { DocNode } from '../types'

const props = defineProps<{
  nodes: DocNode[]
  selectedId: string
  expandedIds: string[]
  level?: number
}>()

const emit = defineEmits<{
  (event: 'select', id: string): void
  (event: 'toggle', id: string): void
}>()

const isExpanded = (id: string) => props.expandedIds.includes(id)
const hasChildren = (node: DocNode) => Boolean(node.children && node.children.length)

const handleToggle = (node: DocNode) => {
  if (hasChildren(node)) {
    emit('toggle', node.id)
  }
  emit('select', node.id)
}
</script>

<template>
  <ul class="tree" role="tree">
    <li
      v-for="node in nodes"
      :key="node.id"
      class="tree-item"
      :class="{
        active: node.id === selectedId,
        expanded: isExpanded(node.id),
        leaf: !hasChildren(node),
      }"
      role="treeitem"
      :aria-expanded="hasChildren(node) ? isExpanded(node.id) : undefined"
    >
      <button class="tree-row" type="button" @click="handleToggle(node)">
        <span class="chevron" aria-hidden="true">
          <span v-if="hasChildren(node)">{{ isExpanded(node.id) ? '−' : '+' }}</span>
          <span v-else>•</span>
        </span>
        <span class="title" :style="{ paddingLeft: `${(level ?? 0) * 12}px` }">
          {{ node.title }}
        </span>
        <span v-if="node.tags?.length" class="tags">{{ node.tags.join(' / ') }}</span>
      </button>
      <transition name="fade">
        <SidebarTree
          v-if="hasChildren(node) && isExpanded(node.id)"
          :nodes="node.children!"
          :selected-id="selectedId"
          :expanded-ids="expandedIds"
          :level="(level ?? 0) + 1"
          @select="emit('select', $event)"
          @toggle="emit('toggle', $event)"
        />
      </transition>
    </li>
  </ul>
</template>

<style scoped>
.tree {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.tree-item {
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background: #fff;
  transition: border-color 160ms ease, background-color 160ms ease;
}

.tree-item.active {
  border-color: #111;
  background: #f7f7f7;
}

.tree-item .tree-row {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  border: none;
  background: transparent;
  color: #111;
  padding: 10px 12px;
  text-align: left;
  cursor: pointer;
  font: 600 14px/1.4 "Inter", "IBM Plex Sans", "Segoe UI", sans-serif;
  transition: color 120ms ease, background-color 120ms ease;
}

.tree-item .tree-row:hover {
  background: #efefef;
}

.chevron {
  width: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
}

.title {
  flex: 1;
  letter-spacing: 0.1px;
}

.tags {
  font-size: 12px;
  color: #555;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 150ms ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
