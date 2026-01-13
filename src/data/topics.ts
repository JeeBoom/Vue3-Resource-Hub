import type { DocNode } from '../types'

export const sections: DocNode[] = [
  {
    id: 'vue-core',
    title: 'Vue 3 核心',
    summary: '组合式 API、响应式系统、生命周期、指令、组件通信',
    tags: ['vue3', 'core'],
    children: [
      {
        id: 'composition-api',
        title: '组合式 API',
        summary: 'setup、ref、reactive、computed、watch 与组合式函数',
        description: 'Vue 3 的组合式 API 是一套基于函数的 API，可以更灵活地组织组件逻辑。通过 setup() 函数或 <script setup> 语法糖，我们可以使用 ref、reactive 创建响应式数据，使用 computed 创建计算属性，使用 watch/watchEffect 监听数据变化。组合式 API 的核心优势在于逻辑复用和代码组织，可以将相关的逻辑提取为可组合函数（Composables）。',
        topics: ['setup 语法', 'ref vs reactive', 'computed 计算属性', 'watch/watchEffect', '组合式函数 (Composables)'],
        useCases: [
          '复杂组件的逻辑拆分和组织',
          '跨组件的逻辑复用（替代 mixins）',
          '更好的 TypeScript 类型推导',
          '按功能组织代码而非选项类型'
        ],
        bestPractices: [
          '使用 <script setup> 语法糖简化代码',
          'ref 用于基本类型，reactive 用于对象',
          '将可复用逻辑抽取为 use 开头的组合式函数',
          '在 setup 顶层定义响应式变量，避免在函数内部创建',
          '使用 computed 而非 watch 来派生状态'
        ],
        codeExamples: [
          {
            title: '基础 setup 用法',
            code: `<script setup>
import { ref, computed } from 'vue'

// 响应式变量
const count = ref(0)
const message = ref('Hello')

// 计算属性
const doubleCount = computed(() => count.value * 2)

// 方法
function increment() {
  count.value++
}
</script>

<template>
  <div>
    <p>{{ message }}</p>
    <p>Count: {{ count }}, Double: {{ doubleCount }}</p>
    <button @click="increment">+1</button>
  </div>
</template>`
          },
          {
            title: '组合式函数示例 (useCounter)',
            code: `// composables/useCounter.ts
import { ref, computed } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  const double = computed(() => count.value * 2)
  
  function increment() {
    count.value++
  }
  
  function decrement() {
    count.value--
  }
  
  return {
    count,
    double,
    increment,
    decrement
  }
}

// 在组件中使用
<script setup>
import { useCounter } from './composables/useCounter'

const { count, double, increment } = useCounter(10)
</script>`
          }
        ],
        resources: [
          { title: 'Vue 3 组合式 API 官方文档', url: 'https://cn.vuejs.org/guide/extras/composition-api-faq.html' },
          { title: 'VueUse 组合式函数集合', url: 'https://vueuse.org/' }
        ]
      },
      {
        id: 'reactivity',
        title: '响应式系统',
        summary: '响应式原理、Proxy、依赖收集、effect 追踪',
        description: 'Vue 3 的响应式系统基于 ES6 Proxy 实现，相比 Vue 2 的 Object.defineProperty 有更好的性能和更完整的特性支持。当你修改响应式对象时，Vue 会自动追踪依赖关系并触发视图更新。核心概念包括：track（依赖收集）、trigger（触发更新）、effect（副作用函数）。理解响应式系统对于优化应用性能和避免常见陷阱至关重要。',
        topics: ['Proxy vs Object.defineProperty', 'effect 副作用追踪', 'track/trigger', 'shallowRef/shallowReactive', 'readonly/shallowReadonly', 'toRef/toRefs', 'markRaw/effectScope'],
        useCases: [
          '自动追踪数据变化并更新 UI',
          '实现计算属性和监听器',
          '跨组件的响应式状态共享',
          '性能优化（浅层响应式、只读）'
        ],
        bestPractices: [
          '避免直接修改 props，使用 computed 或本地 ref',
          '大型数据集使用 shallowRef/shallowReactive 优化性能',
          '不需要响应式的数据使用 markRaw 标记',
          '使用 toRefs 解构 reactive 对象保持响应性',
          '理解 ref 的自动解包规则'
        ],
        codeExamples: [
          {
            title: 'ref vs reactive',
            code: `import { ref, reactive } from 'vue'

// ref 用于基本类型
const count = ref(0)
console.log(count.value) // 访问需要 .value
count.value++

// reactive 用于对象
const state = reactive({
  name: 'Vue',
  version: 3
})
console.log(state.name) // 直接访问
state.version++`
          },
          {
            title: 'toRefs 保持响应性',
            code: `import { reactive, toRefs } from 'vue'

const state = reactive({
  name: 'Alice',
  age: 25
})

// ❌ 解构会丢失响应性
const { name, age } = state

// ✅ 使用 toRefs 保持响应性
const { name, age } = toRefs(state)

// 现在 name 和 age 都是 ref
console.log(name.value) // 'Alice'`
          },
          {
            title: 'shallowRef 性能优化',
            code: `import { shallowRef, triggerRef } from 'vue'

// 大型对象使用浅层响应式
const bigData = shallowRef({
  items: new Array(10000).fill(0).map((_, i) => ({ id: i }))
})

// 修改嵌套属性不会触发更新
bigData.value.items[0].id = 999

// 需要手动触发更新
triggerRef(bigData)`
          }
        ],
        resources: [
          { title: 'Vue 3 响应式原理', url: 'https://cn.vuejs.org/guide/extras/reactivity-in-depth.html' },
          { title: '深入理解 Vue 3 响应式系统' }
        ]
      },
      {
        id: 'lifecycle',
        title: '生命周期钩子',
        summary: '组件生命周期、选项式 vs 组合式生命周期',
        description: 'Vue 组件有一个生命周期，从创建、初始化数据、编译模板、挂载 DOM、渲染、更新、卸载等一系列过程。Vue 3 提供了组合式 API 的生命周期钩子，允许我们在组件生命周期的不同阶段执行代码。理解生命周期对于处理初始化、清理资源、同步外部数据等任务至关重要。',
        topics: ['onMounted/onUpdated/onUnmounted', 'onBeforeMount/onBeforeUpdate', 'onActivated/onDeactivated', 'onErrorCaptured', '生命周期执行顺序'],
        useCases: [
          '在组件挂载时获取数据',
          '在组件卸载时清理事件监听和定时器',
          '监听 props 变化并同步数据',
          'keep-alive 组件的激活和停用'
        ],
        bestPractices: [
          '使用 onMounted 获取初始数据，避免在 setup 顶层进行',
          '在 onUnmounted 中清理资源（事件、定时器、订阅）',
          '使用 watch 监听 props 变化，而非在生命周期钩子中',
          '避免在 onMounted 中进行大量同步操作',
          '使用 onErrorCaptured 捕获子组件错误'
        ],
        codeExamples: [
          {
            title: '生命周期钩子执行顺序',
            code: `<script setup>
import {
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted
} from 'vue'

const log = (msg: string) => console.log(msg)

onBeforeMount(() => log('Before Mount'))
onMounted(() => log('Mounted'))
onBeforeUpdate(() => log('Before Update'))
onUpdated(() => log('Updated'))
onBeforeUnmount(() => log('Before Unmount'))
onUnmounted(() => log('Unmounted'))

// 执行顺序：Before Mount → Mounted → Before Update → Updated → Before Unmount → Unmounted
</script>`
          },
          {
            title: '在 onMounted 中获取数据',
            code: `<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const users = ref([])
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    const res = await fetch('/api/users')
    users.value = await res.json()
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div v-if="loading">加载中...</div>
  <ul v-else>
    <li v-for="user in users" :key="user.id">{{ user.name }}</li>
  </ul>
</template>`
          },
          {
            title: '清理资源',
            code: `<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const count = ref(0)

let timer: number

onMounted(() => {
  // 添加事件监听
  window.addEventListener('resize', handleResize)
  
  // 启动定时器
  timer = setInterval(() => {
    count.value++
  }, 1000)
})

onUnmounted(() => {
  // 移除事件监听
  window.removeEventListener('resize', handleResize)
  
  // 清除定时器
  clearInterval(timer)
})

const handleResize = () => {
  console.log('Window resized')
}
</script>`
          },
          {
            title: '监听 Props 变化',
            code: `<script setup>
import { watch, computed } from 'vue'

interface Props {
  userId: number
}

const props = defineProps<Props>()
const user = ref(null)

// 监听 props 变化，获取新数据
watch(
  () => props.userId,
  async (newId) => {
    const res = await fetch(\\\`/api/users/\\\${newId}\\\`)
    user.value = await res.json()
  },
  { immediate: true } // 初始化时立即执行
)
</script>`
          }
        ],
        resources: [
          { title: '生命周期钩子官方文档', url: 'https://cn.vuejs.org/guide/essentials/lifecycle.html' },
          { title: '生命周期图示', url: 'https://cn.vuejs.org/guide/essentials/lifecycle.html#lifecycle-diagram' }
        ]
      },
      {
        id: 'sfc',
        title: '单文件组件 SFC',
        summary: '<script setup>、样式作用域、CSS 变量、自定义块',
        description: '单文件组件（Single File Component）是 Vue 的核心特性，将 HTML、JavaScript 和 CSS 集成在一个 .vue 文件中。<script setup> 是 Vue 3 推荐的语法糖，可以更简洁地编写组合式 API。通过 scoped 样式确保 CSS 不会污染全局，通过 v-bind 在 CSS 中使用 JavaScript 变量，实现动态主题。',
        topics: ['<script setup> 语法糖', 'defineProps/defineEmits', 'defineExpose', 'withDefaults', 'scoped 样式', 'CSS Modules', 'v-bind in CSS', '自定义块'],
        useCases: [
          '构建可复用的 Vue 组件',
          '组件级别的样式隔离',
          '动态主题和 CSS 变量绑定',
          '使用编译器宏简化组件定义'
        ],
        bestPractices: [
          '优先使用 <script setup> 语法糖',
          '使用 defineProps 和 withDefaults 定义带默认值的 props',
          'scoped 样式中避免深度选择器滥用',
          '使用 CSS Modules 实现完全隔离的样式',
          '通过 defineExpose 显式暴露组件方法'
        ],
        codeExamples: [
          {
            title: 'defineProps 和 defineEmits',
            code: `<script setup lang="ts">
interface Props {
  title: string
  count?: number
}

// 定义 props 并设置默认值
const props = withDefaults(defineProps<Props>(), {
  count: 0
})

// 定义事件
const emit = defineEmits<{
  update: [value: number]
  delete: []
}>()

function handleClick() {
  emit('update', props.count + 1)
}
</script>

<template>
  <div>
    <h1>{{ title }}</h1>
    <button @click="handleClick">{{ count }}</button>
  </div>
</template>`
          },
          {
            title: 'CSS 中使用 JavaScript 变量',
            code: `<script setup>
import { ref } from 'vue'

const themeColor = ref('#42b983')
const fontSize = ref(16)
</script>

<template>
  <div class="text">动态主题</div>
</template>

<style scoped>
.text {
  color: v-bind(themeColor);
  font-size: v-bind(fontSize + 'px');
}
</style>`
          }
        ],
        resources: [
          { title: 'SFC 语法规范', url: 'https://cn.vuejs.org/api/sfc-spec.html' },
          { title: '<script setup> 官方文档', url: 'https://cn.vuejs.org/api/sfc-script-setup.html' }
        ]
      },
      {
        id: 'components',
        title: '组件基础',
        summary: '组件注册、Props、Emit、插槽、透传属性',
        description: 'Vue 3 组件是可复用的代码块，包含 template、script、style。可以通过 Props 接收数据，通过 emit 事件通知父组件。插槽提供灵活的内容分发机制，透传属性自动传递非声明的属性。组件可以全局注册（App.component）也可以局部注册（直接导入使用）。',
        topics: ['全局/局部注册', 'Props 验证与默认值', 'emit 事件', '插槽 (默认/具名/作用域)', 'attrs 透传', 'provide/inject', '异步组件'],
        useCases: [
          '创建可复用的按钮、输入框、卡片等基础组件',
          '构建表单组件库和 UI 组件库',
          '实现组件间的数据通信和事件处理',
          '创建具有不同内容布局的列表、对话框等容器'
        ],
        bestPractices: [
          '使用 Props 进行父到子的数据传递，避免直接修改',
          '使用 emit 触发自定义事件，让父组件决定处理逻辑',
          '为 Props 添加类型检查和默认值，提高代码健壮性',
          '合理使用插槽实现内容分发，提供灵活的组件扩展性',
          '利用 v-bind="$attrs" 优雅处理透传属性，减少中间层代码'
        ],
        codeExamples: [
          {
            title: '组件注册 - 全局和局部',
            code: `// main.ts - 全局注册
import { createApp } from 'vue'
import MyButton from '@/components/MyButton.vue'

const app = createApp({})

// 全局注册
app.component('MyButton', MyButton)

// ------- 组件内局部注册 -------
<script setup>
import MyButton from '@/components/MyButton.vue'
// 直接使用，无需注册
</script>

<template>
  <MyButton />
</template>`
          },
          {
            title: 'Props - 类型验证和默认值',
            code: `// MyButton.vue
<script setup lang="ts">
interface Props {
  type?: 'primary' | 'secondary' | 'danger'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  label: string
  count?: number
}

const props = withDefaults(defineProps<Props>(), {
  type: 'primary',
  size: 'medium',
  disabled: false,
  count: 0
})
</script>

<template>
  <button
    :class="['btn', \`btn-\${props.type}\`, \`btn-\${props.size}\`]"
    :disabled="props.disabled"
  >
    {{ props.label }}
    <span v-if="props.count > 0" class="badge">{{ props.count }}</span>
  </button>
</template>

<style scoped>
.btn { padding: 8px 16px; border-radius: 4px; border: none; cursor: pointer; }
.btn-primary { background: #007bff; color: white; }
.btn-danger { background: #dc3545; color: white; }
.badge { margin-left: 4px; background: #fff; padding: 2px 4px; border-radius: 3px; }
</style>`
          },
          {
            title: 'Emit - 自定义事件',
            code: `// MyInput.vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref('')

const emit = defineEmits<{
  update: [val: string]
  submit: [val: string]
  clear: []
}>()

const handleInput = (e: Event) => {
  const newValue = (e.target as HTMLInputElement).value
  value.value = newValue
  emit('update', newValue)
}

const handleClear = () => {
  value.value = ''
  emit('clear')
}

const handleSubmit = () => {
  emit('submit', value.value)
}
</script>

<template>
  <div class="input-group">
    <input
      :value="value"
      @input="handleInput"
      @keyup.enter="handleSubmit"
      placeholder="输入内容..."
    />
    <button v-if="value" @click="handleClear">清空</button>
    <button @click="handleSubmit" class="btn-submit">提交</button>
  </div>
</template>`
          },
          {
            title: '插槽 - 默认、具名、作用域',
            code: `// Card.vue - 带插槽的卡片组件
<script setup lang="ts">
interface Props {
  title: string
  items?: Array<{ id: number; name: string }>
}

defineProps<Props>()
</script>

<template>
  <div class="card">
    <!-- 具名插槽：卡片头部 -->
    <div class="card-header">
      <h3>{{ title }}</h3>
      <slot name="header" />
    </div>

    <!-- 默认插槽 -->
    <div class="card-body">
      <slot>
        <p>没有提供内容</p>
      </slot>
    </div>

    <!-- 作用域插槽：项目列表 -->
    <div class="card-list">
      <div v-for="item in items" :key="item.id" class="item">
        <!-- 将 item 和 index 作用域暴露给插槽 -->
        <slot name="item" :item="item" :index="\$index">
          <span>{{ item.name }}</span>
        </slot>
      </div>
    </div>

    <!-- 具名插槽：卡片底部 -->
    <div class="card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<style scoped>
.card { border: 1px solid #ddd; border-radius: 8px; overflow: hidden; }
.card-header { padding: 12px; background: #f5f5f5; border-bottom: 1px solid #ddd; }
.card-body { padding: 16px; }
.card-list { padding: 12px; }
.item { padding: 8px 12px; border-bottom: 1px solid #eee; }
.card-footer { padding: 12px; background: #f5f5f5; }
</style>`
          },
          {
            title: '插槽使用示例',
            code: `// 使用 Card 组件
<template>
  <Card title="用户列表" :items="users">
    <!-- 默认插槽内容 -->
    <p>这是一个用户列表卡片</p>

    <!-- 具名插槽：header -->
    <template #header>
      <button @click="refreshUsers">刷新</button>
    </template>

    <!-- 作用域插槽：item -->
    <template #item="{ item, index }">
      <span class="index">{{ index + 1 }}.</span>
      <span class="name">{{ item.name }}</span>
      <button @click="deleteUser(item.id)" class="btn-delete">删除</button>
    </template>

    <!-- 具名插槽：footer -->
    <template #footer>
      <p>共 {{ users.length }} 条记录</p>
    </template>
  </Card>
</template>

<script setup>
import { ref } from 'vue'
import Card from '@/components/Card.vue'

const users = ref([
  { id: 1, name: '张三' },
  { id: 2, name: '李四' }
])

const deleteUser = (id: number) => {
  users.value = users.value.filter(u => u.id !== id)
}

const refreshUsers = () => {
  console.log('刷新用户列表')
}
</script>`
          },
          {
            title: '透传属性 (Fallthrough Attributes)',
            code: `// MyButton.vue - 透传属性示例
<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  label: string
  type?: 'primary' | 'secondary'
}

defineProps<Props>()

// useAttrs 获取所有透传的属性（class、style、event listener 等）
const attrs = useAttrs()

// 也可以直接在模板中使用 $attrs
</script>

<template>
  <button
    class="btn"
    :class="[\`btn-\${type}\`, $attrs.class]"
    :style="$attrs.style"
    v-bind="{ ...$attrs, class: '', style: '' }"
  >
    {{ label }}
  </button>
</template>

<style scoped>
.btn { padding: 8px 16px; border-radius: 4px; border: 1px solid #999; }
.btn-primary { background: #007bff; color: white; }
.btn-secondary { background: #6c757d; color: white; }
</style>

<!-- 使用：所有属性都会透传到按钮元素 -->
<MyButton
  label="点击"
  type="primary"
  class="custom-class"
  style="width: 200px"
  title="按钮提示"
  data-test="my-btn"
  @click="handleClick"
/>`
          },
          {
            title: 'Provide/Inject - 跨级组件通信',
            code: `// Parent.vue - 提供数据
<script setup>
import { provide, ref } from 'vue'

const theme = ref('light')

// 提供给所有后代组件
provide('theme', theme)
provide('toggleTheme', () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
})
</script>

<template>
  <div :class="[\`theme-\${theme}\`]">
    <Child />
  </div>
</template>

// ------- Child.vue - 深层嵌套的子组件 -------
<script setup>
import { inject } from 'vue'

// 注入祖先组件提供的数据
const theme = inject('theme')
const toggleTheme = inject('toggleTheme')
</script>

<template>
  <div>
    <p>当前主题: {{ theme }}</p>
    <button @click="toggleTheme">切换主题</button>
  </div>
</template>`
          }
        ],
        resources: [
          { title: '组件基础官方文档', url: 'https://cn.vuejs.org/guide/essentials/component-basics.html' },
          { title: 'Props 文档', url: 'https://cn.vuejs.org/guide/components/props.html' },
          { title: '组件事件文档', url: 'https://cn.vuejs.org/guide/components/events.html' },
          { title: '插槽文档', url: 'https://cn.vuejs.org/guide/components/slots.html' },
          { title: '透传属性文档', url: 'https://cn.vuejs.org/guide/components/attrs.html' }
        ]
      },
      {
        id: 'directives',
        title: '指令系统',
        summary: '内置指令、自定义指令、指令钩子',
        description: 'Vue 指令是为 HTML 元素添加交互功能的方式。Vue 提供了内置指令（如 v-if、v-for、v-model）用于常见的需求，同时支持创建自定义指令来扩展 HTML 功能。自定义指令可以用于封装与 DOM 直接相关的复杂操作，如焦点管理、文本选中、防止提交、权限检查等。',
        topics: ['v-if/v-show/v-for', 'v-model 双向绑定', 'v-bind/v-on', '自定义指令', '指令钩子 (mounted/updated)', '指令参数与修饰符'],
        useCases: [
          '条件渲染和列表渲染',
          '表单双向绑定',
          '自动聚焦输入框',
          '防止未保存时离开页面',
          '权限检查和隐藏元素',
          '图片懒加载'
        ],
        bestPractices: [
          '使用 v-show 代替 v-if 频繁切换的元素',
          '给 v-for 列表的项添加稳定的 key',
          '避免在 v-if 中使用计算属性，可能导致重复计算',
          '自定义指令只用于 DOM 操作，逻辑应该在 JavaScript 中',
          '为自定义指令添加良好的文档和类型定义'
        ],
        codeExamples: [
          {
            title: 'v-if/v-show/v-for 的使用',
            code: `<script setup>
import { ref } from 'vue'

const show = ref(true)
const items = ref([
  { id: 1, name: '项目 1' },
  { id: 2, name: '项目 2' },
  { id: 3, name: '项目 3' }
])
</script>

<template>
  <!-- v-if：不满足条件时元素不存在于 DOM 中 -->
  <div v-if="show" class="box">
    条件为真时显示
  </div>

  <!-- v-else 和 v-else-if -->
  <div v-else-if="!show && items.length > 0">
    其他条件
  </div>

  <!-- v-show：通过 display 控制可见性，元素始终在 DOM 中 -->
  <div v-show="show" class="tooltip">总是在 DOM 中，但可能隐藏</div>

  <!-- v-for：列表渲染 -->
  <ul>
    <li v-for="item in items" :key="item.id">
      {{ item.name }}
    </li>
  </ul>

  <!-- 遍历对象和索引 -->
  <div v-for="(value, key, index) in { a: 1, b: 2 }" :key="key">
    {{ index }}: {{ key }} = {{ value }}
  </div>
</template>`
          },
          {
            title: 'v-model 双向绑定',
            code: `<script setup>
import { ref } from 'vue'

const message = ref('')
const checked = ref(false)
const selected = ref('')
const selectedMultiple = ref([])
</script>

<template>
  <!-- 文本输入 -->
  <input v-model="message" placeholder="输入内容" />
  <p>{{ message }}</p>

  <!-- 复选框 -->
  <input v-model="checked" type="checkbox" />
  <p>选中: {{ checked }}</p>

  <!-- 下拉框 -->
  <select v-model="selected">
    <option value="a">选项 A</option>
    <option value="b">选项 B</option>
    <option value="c">选项 C</option>
  </select>

  <!-- 多选 -->
  <input v-model="selectedMultiple" type="checkbox" value="option1" />
  <input v-model="selectedMultiple" type="checkbox" value="option2" />
  <p>选中: {{ selectedMultiple }}</p>

  <!-- v-model 修饰符 -->
  <input v-model.lazy="message" /> <!-- change 时更新 -->
  <input v-model.number="message" /> <!-- 自动转数字 -->
  <textarea v-model.trim="message"></textarea> <!-- 自动去空格 -->
</template>`
          },
          {
            title: '自定义指令 - v-focus',
            code: `// directives/vFocus.ts
import type { DirectiveBinding } from 'vue'

interface FocusDirectiveBinding extends DirectiveBinding {
  value?: { delay?: number }
}

export const vFocus = {
  mounted(el: HTMLElement, binding: FocusDirectiveBinding) {
    const delay = binding.value?.delay || 0
    
    if (delay) {
      setTimeout(() => el.focus(), delay)
    } else {
      el.focus()
    }
  }
}

// 使用
<script setup>
import { vFocus } from '@/directives/vFocus'
</script>

<template>
  <!-- 自动聚焦 -->
  <input v-focus />
  
  <!-- 延迟聚焦 -->
  <input v-focus="{ delay: 500 }" />
</template>`
          },
          {
            title: '自定义指令 - v-click-outside',
            code: `// directives/vClickOutside.ts
import type { DirectiveBinding } from 'vue'

export const vClickOutside = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const handleClickOutside = (event: MouseEvent) => {
      if (!el.contains(event.target as Node)) {
        binding.value?.(event)
      }
    }

    // 保存处理函数以便卸载时移除
    (el as any).__clickOutsideEvent__ = handleClickOutside
    document.addEventListener('click', handleClickOutside)
  },
  unmounted(el: HTMLElement) {
    const handler = (el as any).__clickOutsideEvent__
    if (handler) {
      document.removeEventListener('click', handler)
    }
  }
}

// 使用示例
<script setup>
import { ref } from 'vue'
import { vClickOutside } from '@/directives/vClickOutside'

const showDropdown = ref(false)

const handleClickOutside = () => {
  showDropdown.value = false
}
</script>

<template>
  <div v-click-outside="handleClickOutside" class="dropdown">
    <button @click="showDropdown = !showDropdown">菜单</button>
    <ul v-if="showDropdown" class="menu">
      <li>选项 1</li>
      <li>选项 2</li>
    </ul>
  </div>
</template>`
          },
          {
            title: '自定义指令 - v-permission',
            code: `// directives/vPermission.ts
import type { DirectiveBinding } from 'vue'
import { userStore } from '@/stores/user'

export const vPermission = {
  mounted(el: HTMLElement, binding: DirectiveBinding<string | string[]>) {
    const store = userStore()
    const permissions = Array.isArray(binding.value) ? binding.value : [binding.value]

    const hasPermission = permissions.some(permission => 
      store.permissions.includes(permission)
    )

    if (!hasPermission) {
      // 没有权限则隐藏元素
      el.style.display = 'none'
    }
  }
}

// 使用
<template>
  <!-- 只有拥有 'delete' 权限的用户才能看到删除按钮 -->
  <button v-permission="'delete'" @click="deleteItem">删除</button>
  
  <!-- 检查多个权限中的任意一个 -->
  <button v-permission="['edit', 'admin']" @click="editItem">编辑</button>
</template>`
          }
        ],
        resources: [
          { title: '指令系统官方文档', url: 'https://cn.vuejs.org/guide/essentials/template-directives.html' },
          { title: '自定义指令指南', url: 'https://cn.vuejs.org/guide/reusability/custom-directives.html' },
          { title: 'v-model 文档', url: 'https://cn.vuejs.org/guide/components/v-model.html' }
        ]
      },
      {
        id: 'routing',
        title: 'Vue Router 4',
        summary: '路由模式、动态路由、嵌套路由、导航守卫',
        description: 'Vue Router 是 Vue.js 的官方路由管理器，它与 Vue 核心深度集成，让构建单页应用变得轻而易举。Vue Router 4 专为 Vue 3 设计，提供了更小的包体积、更好的 TypeScript 支持和组合式 API。支持 Hash 和 History 两种路由模式，提供动态路由匹配、嵌套路由、导航守卫等强大功能。',
        topics: ['Hash/History 模式', '动态路由参数', '嵌套路由', '命名路由与视图', '路由懒加载', '导航守卫 (全局/路由/组件)', '路由元信息', 'useRouter/useRoute'],
        useCases: [
          '单页应用的页面导航',
          '基于路由的权限控制',
          '页面级代码分割和懒加载',
          '面包屑和侧边栏菜单生成'
        ],
        bestPractices: [
          '使用路由懒加载优化首屏加载',
          '在导航守卫中处理权限验证',
          '使用 meta 字段存储路由元信息',
          '组合式 API 中使用 useRouter 和 useRoute',
          '避免在路由守卫中进行耗时操作'
        ],
        codeExamples: [
          {
            title: '路由配置',
            code: `// router/index.ts
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/Home.vue')
    },
    {
      path: '/user/:id',
      name: 'User',
      component: () => import('@/views/User.vue'),
      // 路由元信息
      meta: { requiresAuth: true }
    },
    {
      // 嵌套路由
      path: '/admin',
      component: () => import('@/layouts/Admin.vue'),
      children: [
        {
          path: 'dashboard',
          component: () => import('@/views/Dashboard.vue')
        }
      ]
    }
  ]
})

export default router`
          },
          {
            title: '导航守卫',
            code: `// 全局前置守卫
router.beforeEach((to, from, next) => {
  const isLogin = localStorage.getItem('token')
  
  if (to.meta.requiresAuth && !isLogin) {
    next('/login')
  } else {
    next()
  }
})

// 组件内守卫
<script setup>
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'

onBeforeRouteLeave((to, from) => {
  const answer = window.confirm('确定要离开吗？')
  if (!answer) return false
})
</script>`
          },
          {
            title: '在组件中使用',
            code: `<script setup>
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 获取路由参数
const userId = route.params.id

// 编程式导航
function goToHome() {
  router.push('/')
}

function goToUser(id: string) {
  router.push({ name: 'User', params: { id } })
}
</script>`
          }
        ],
        resources: [
          { title: 'Vue Router 官方文档', url: 'https://router.vuejs.org/zh/' },
          { title: 'Vue Router 4 迁移指南' }
        ]
      },
      {
        id: 'state',
        title: 'Pinia 状态管理',
        summary: 'Store 定义、State、Getters、Actions、插件',
        description: 'Pinia 是 Vue 3 官方推荐的状态管理库，相比 Vuex 更简洁、类型更友好。每个 Store 是一个独立的模块，包含 state（状态）、getters（计算属性）、actions（方法）。Pinia 完美支持 TypeScript，提供自动补全和类型检查。通过插件机制可以实现持久化、DevTools 集成等功能。',
        topics: ['defineStore', 'State 状态', 'Getters 计算', 'Actions 方法', 'storeToRefs', 'Store 组合', '插件机制', '持久化插件', 'TypeScript 支持'],
        useCases: [
          '跨组件的全局状态管理',
          '用户信息、权限等全局数据存储',
          '购物车、主题设置等业务状态',
          '需要持久化的应用状态'
        ],
        bestPractices: [
          '按功能模块划分不同的 Store',
          '使用 storeToRefs 解构 Store 保持响应性',
          'Actions 中处理异步逻辑',
          'Getters 用于派生状态，避免重复计算',
          '使用 pinia-plugin-persistedstate 实现持久化'
        ],
        codeExamples: [
          {
            title: '定义一个 Store',
            code: `// stores/user.ts
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    name: '',
    age: 0,
    token: ''
  }),
  
  getters: {
    // 计算属性
    isLogin: (state) => !!state.token,
    displayName: (state) => state.name || '游客'
  },
  
  actions: {
    // 异步方法
    async login(username: string, password: string) {
      const res = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
      })
      const data = await res.json()
      this.token = data.token
      this.name = data.name
    },
    
    logout() {
      this.token = ''
      this.name = ''
    }
  }
})`
          },
          {
            title: '在组件中使用 Store',
            code: `<script setup>
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

// ✅ 使用 storeToRefs 保持响应性
const { name, isLogin } = storeToRefs(userStore)

// actions 直接解构即可
const { login, logout } = userStore

function handleLogin() {
  login('admin', '123456')
}
</script>

<template>
  <div>
    <p v-if="isLogin">欢迎, {{ name }}</p>
    <button v-else @click="handleLogin">登录</button>
  </div>
</template>`
          }
        ],
        resources: [
          { title: 'Pinia 官方文档', url: 'https://pinia.vuejs.org/zh/' },
          { title: 'Pinia 持久化插件' }
        ]
      },
      {
        id: 'vue-advanced',
        title: 'Vue 进阶特性',
        summary: 'Teleport、Suspense、KeepAlive、Transition',
        description: 'Vue 3 提供了一系列进阶特性来满足复杂应用的需求。Teleport 允许将组件模板的一部分渲染到 DOM 的其他位置，常用于 Modal 对话框；Suspense 提供了处理异步依赖的能力，支持异步组件和数据加载；KeepAlive 可以缓存组件实例以提升性能；Transition 提供了动画和过渡效果；此外还支持函数式组件、render 函数和 JSX/TSX 语法。',
        topics: ['Teleport 传送门', 'Suspense 异步组件', 'KeepAlive 缓存', 'Transition/TransitionGroup', '函数式组件', 'render 函数', 'JSX/TSX 支持'],
        useCases: [
          '非侵入式 Modal 对话框实现',
          '异步数据加载和组件加载',
          '路由缓存优化应用性能',
          '页面过渡和动画效果',
          '复杂 UI 的动态生成和管理',
          '列表动画和进出场效果'
        ],
        bestPractices: [
          'Teleport 用于挂载到 body 的全局组件',
          'Suspense 配合 defineAsyncComponent 处理异步组件',
          'KeepAlive 明确指定需要缓存的组件',
          'Transition 应用简洁但有效的动画',
          '避免在 render 函数中创建新对象',
          '优先使用 Vue 模板而非 JSX'
        ],
        codeExamples: [
          {
            title: 'Teleport 实现 Modal',
            code: `<!-- Modal.vue -->
<script setup>
defineProps({
  show: Boolean
})
defineEmits(['close'])
</script>

<template>
  <!-- 将 Modal 内容传送到 body 标签下 -->
  <Teleport to="body">
    <div v-if="show" class="modal-overlay" @click="$emit('close')">
      <div class="modal-content" @click.stop>
        <header>
          <h2><slot name="title" /></h2>
          <button @click="$emit('close')">×</button>
        </header>
        <div class="modal-body">
          <slot />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  border-radius: 8px;
  min-width: 400px;
}
</style>`
          },
          {
            title: 'Suspense + 异步组件',
            code: `<!-- Parent.vue -->
<script setup>
import { defineAsyncComponent } from 'vue'

// 定义异步组件
const UserList = defineAsyncComponent(() =>
  import('./UserList.vue')
)

const UserDetail = defineAsyncComponent(() =>
  import('./UserDetail.vue')
)
</script>

<template>
  <Suspense>
    <!-- 异步组件加载中显示 fallback -->
    <template #default>
      <UserList />
    </template>
    <template #fallback>
      <div class="loading">加载中...</div>
    </template>
  </Suspense>
</template>`
          },
          {
            title: 'KeepAlive 缓存组件',
            code: `<!-- App.vue -->
<script setup>
import { ref } from 'vue'
import Home from './views/Home.vue'
import About from './views/About.vue'
import Contacts from './views/Contacts.vue'

const currentTab = ref('Home')
const tabs = {
  Home,
  About,
  Contacts
}
</script>

<template>
  <div class="tabs">
    <button
      v-for="name in Object.keys(tabs)"
      :key="name"
      :class="{ active: currentTab === name }"
      @click="currentTab = name"
    >
      {{ name }}
    </button>
  </div>

  <!-- KeepAlive 缓存已加载的组件 -->
  <KeepAlive>
    <component :is="tabs[currentTab]" />
  </KeepAlive>
</template>`
          },
          {
            title: 'Transition 过渡效果',
            code: `<!-- FadeTransition.vue -->
<script setup>
import { ref } from 'vue'

const show = ref(true)
</script>

<template>
  <div>
    <button @click="show = !show">
      {{ show ? '隐藏' : '显示' }}
    </button>

    <!-- Transition 包裹动画元素 -->
    <Transition name="fade">
      <div v-if="show" class="box">
        动画内容
      </div>
    </Transition>

    <!-- 列表动画 -->
    <TransitionGroup name="list" tag="ul">
      <li v-for="item in items" :key="item.id">
        {{ item.name }}
      </li>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.box {
  padding: 20px;
  background: #42b983;
  color: white;
}

/* Transition 动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* TransitionGroup 动画 */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-move {
  transition: transform 0.5s;
}
</style>`
          },
          {
            title: 'Render 函数',
            code: `<script setup lang="ts">
import { ref, h, computed } from 'vue'

const isActive = ref(false)
const count = ref(0)

// 使用 render 函数动态生成 UI
function render() {
  return h('div', [
    h('h1', '动态组件'),
    h('p', \`计数: \${count.value}\`),
    h(
      'button',
      {
        onClick: () => count.value++,
        style: {
          padding: '8px 16px',
          background: '#42b983',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }
      },
      '加1'
    )
  ])
}
</script>

<template>
  <component :is="{ render }" />
</template>`
          }
        ],
        resources: [
          { title: 'Teleport 官方文档', url: 'https://cn.vuejs.org/guide/built-ins/teleport.html' },
          { title: 'Suspense 官方文档', url: 'https://cn.vuejs.org/guide/built-ins/suspense.html' },
          { title: 'KeepAlive 官方文档', url: 'https://cn.vuejs.org/guide/built-ins/keep-alive.html' },
          { title: 'Transition 官方文档', url: 'https://cn.vuejs.org/guide/built-ins/transition.html' },
          { title: 'Render 函数官方文档', url: 'https://cn.vuejs.org/guide/extras/render-function.html' }
        ]
      },
    ],
  },
  {
    id: 'web-basics',
    title: 'Web 基础',
    summary: 'JavaScript、TypeScript、CSS 全面基础知识',
    tags: ['js', 'ts', 'css'],
    children: [
      {
        id: 'js-foundation',
        title: 'JavaScript 基础',
        summary: '数据类型、作用域、原型链、异步编程',
        description: 'JavaScript 基础是前端开发的核心。掌握数据类型（原始类型和引用类型）、作用域和闭包、原型和原型链等概念是成为优秀前端工程师的必要条件。异步编程（Promise、async/await）是处理网络请求和定时操作的关键。理解 this 指向、事件循环机制、函数式编程等高级概念能帮助写出更高质量的代码。',
        topics: ['数据类型 (原始/引用)', '作用域与闭包', '原型与原型链', 'this 指向', '事件循环 Event Loop', 'Promise/async/await', '模块化 (ES Module/CommonJS)', '函数式编程', '防抖与节流'],
        useCases: [
          '处理各种数据类型的操作和判断',
          '管理变量作用域避免污染全局',
          '实现原型继承和对象之间的关系',
          '异步操作和网络请求处理',
          '事件处理和事件流程',
          '性能优化（防抖、节流）'
        ],
        bestPractices: [
          '使用 const 和 let 替代 var',
          '理解闭包的内存影响',
          '避免多层嵌套的 Promise 使用 async/await',
          '正确理解 this 的各种指向情况',
          '合理使用箭头函数保留 this 上下文',
          '了解事件循环避免阻塞主线程'
        ],
        codeExamples: [
          {
            title: '数据类型判断',
            code: `// 基本数据类型
const num = 123
const str = 'hello'
const bool = true
const undef = undefined
const nul = null
const sym = Symbol('id')
const bigint = BigInt(9007199254740991)

// 引用数据类型
const obj = { name: 'Vue' }
const arr = [1, 2, 3]
const func = () => {}

// 类型判断
console.log(typeof num)        // 'number'
console.log(typeof str)        // 'string'
console.log(Array.isArray(arr)) // true
console.log(obj instanceof Object) // true

// 深度判断
function getType(value) {
  return Object.prototype.toString.call(value).slice(8, -1)
}
console.log(getType(arr))     // 'Array'
console.log(getType(new Date())) // 'Date'`
          },
          {
            title: '闭包和作用域',
            code: `// 闭包：内层函数可以访问外层函数的变量
function createCounter(initialValue = 0) {
  let count = initialValue // 闭包保留对 count 的引用
  
  return {
    increment() {
      return ++count
    },
    decrement() {
      return --count
    },
    getCount() {
      return count
    }
  }
}

const counter = createCounter(10)
console.log(counter.increment())  // 11
console.log(counter.increment())  // 12
console.log(counter.getCount())   // 12

// 避免闭包陷阱
const callbacks = []
for (let i = 0; i < 3; i++) {
  // 使用 let 创建块级作用域
  callbacks.push(() => console.log(i))
}
callbacks.forEach(cb => cb()) // 0, 1, 2`
          },
          {
            title: '原型链和继承',
            code: `// 原型链继承
class Animal {
  constructor(name) {
    this.name = name
  }
  
  speak() {
    console.log(\`\${this.name} 发出声音\`)
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name)
    this.breed = breed
  }
  
  speak() {
    console.log(\`\${this.name} 汪汪叫\`)
  }
}

const dog = new Dog('旺财', '金毛')
dog.speak()              // 旺财 汪汪叫
console.log(dog instanceof Dog)    // true
console.log(dog instanceof Animal) // true

// 原型方法
console.log(Object.getPrototypeOf(dog)) // Dog.prototype`
          },
          {
            title: 'Promise 和 async/await',
            code: `// Promise 链式调用
function fetchUser(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id > 0) {
        resolve({ id, name: 'Alice' })
      } else {
        reject(new Error('Invalid ID'))
      }
    }, 1000)
  })
}

// Promise 方式
fetchUser(1)
  .then(user => {
    console.log('用户:', user)
    return fetchUser(2)
  })
  .then(user => console.log('用户2:', user))
  .catch(err => console.error(err))

// async/await 方式（推荐）
async function getUserInfo() {
  try {
    const user1 = await fetchUser(1)
    console.log('用户1:', user1)
    
    const user2 = await fetchUser(2)
    console.log('用户2:', user2)
  } catch (err) {
    console.error('错误:', err)
  }
}

getUserInfo()`
          },
          {
            title: '防抖和节流',
            code: `// 防抖：延迟执行，如果继续触发则重新计时
function debounce(func, delay = 300) {
  let timerId
  return function(...args) {
    clearTimeout(timerId)
    timerId = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

// 应用：搜索输入框
const handleSearch = debounce((query) => {
  console.log('搜索:', query)
}, 500)

document.querySelector('#search').addEventListener('input', (e) => {
  handleSearch(e.target.value)
})

// 节流：限制函数执行频率
function throttle(func, interval = 300) {
  let lastTime = 0
  return function(...args) {
    const now = Date.now()
    if (now - lastTime >= interval) {
      func.apply(this, args)
      lastTime = now
    }
  }
}

// 应用：滚动事件优化
window.addEventListener('scroll', throttle(() => {
  console.log('滚动中...')
}, 1000))`
          },
          {
            title: 'this 指向',
            code: `// 1. 普通函数调用：this 指向全局对象（浏览器是 window）
function greet() {
  console.log(this) // window
}
greet()

// 2. 对象方法调用：this 指向对象
const obj = {
  name: 'Vue',
  greet() {
    console.log(this.name) // 'Vue'
  }
}
obj.greet()

// 3. 箭头函数：继承外层 this
const user = {
  name: 'Alice',
  friends: ['Bob'],
  printFriends() {
    // this 是 user
    this.friends.forEach(friend => {
      console.log(friend)
    })
  }
}

// 4. call/apply/bind 改变 this
const teacher = { name: '老师' }
function introduce(age) {
  console.log(\`\${this.name}, 年龄 \${age}\`)
}
introduce.call(teacher, 30)      // 立即执行
introduce.apply(teacher, [30])   // 立即执行
const boundIntro = introduce.bind(teacher)
boundIntro(30)                   // 返回新函数，需要手动调用`
          }
        ],
        resources: [
          { title: 'MDN JavaScript 基础', url: 'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide' },
          { title: '你不知道的 JavaScript', url: 'https://github.com/getify/You-Dont-Know-JS' },
          { title: 'ES6 完全教程', url: 'https://es6.ruanyifeng.com/' }
        ],
        children: [
          {
            id: 'js-es6',
            title: 'ES6+ 新特性',
            summary: '解构、展开、箭头函数、类、模板字符串',
            description: 'ES6（也称 ES2015）引入了大量语法糖和新特性，极大地改进了 JavaScript 的开发体验。包括 let/const 块级作用域、解构赋值、箭头函数、Class 语法糖、模板字符串、Promise、Generator、Proxy/Reflect、Map/Set 等数据结构。这些特性已成为现代 JavaScript 开发的标准。',
            topics: ['let/const', '解构赋值', '箭头函数', 'Class 类', '模板字符串', 'Symbol/BigInt', 'Promise/Generator', 'Proxy/Reflect', 'Map/Set/WeakMap/WeakSet', '可选链/空值合并'],
            useCases: [
              '现代前端框架（Vue/React）基础',
              '简化代码逻辑和提高可读性',
              '处理复杂数据结构和转换',
              '元编程和拦截对象操作',
              '模拟私有属性和隐藏细节'
            ],
            bestPractices: [
              '优先使用 const，次选 let，避免 var',
              '充分利用解构简化代码',
              '箭头函数用于简短回调，普通函数用于方法',
              'Proxy 用于数据验证和拦截',
              '使用 Map/Set 替代普通对象处理键值对'
            ],
            codeExamples: [
              {
                title: '解构赋值和展开运算符',
                code: `// 数组解构
const [a, b, c] = [1, 2, 3]
const [x, , z] = [10, 20, 30]  // 跳过中间值
const [first, ...rest] = [1, 2, 3, 4, 5]

// 对象解构
const { name, age, city = '北京' } = { name: 'Alice', age: 25 }
const { name: userName } = user  // 重命名

// 展开运算符
const arr1 = [1, 2]
const arr2 = [...arr1, 3, 4]    // [1, 2, 3, 4]

const obj1 = { a: 1 }
const obj2 = { ...obj1, b: 2 }  // { a: 1, b: 2 }

// 函数参数
function printCoords({ x, y = 0 }) {
  console.log(\`x: \${x}, y: \${y}\`)
}
printCoords({ x: 10, y: 20 })`
              },
              {
                title: 'Class 类和继承',
                code: `// 类定义
class Vehicle {
  constructor(name) {
    this.name = name
  }
  
  static create(name) {
    return new this(name)
  }
  
  start() {
    console.log(\`\${this.name} 启动\`)
  }
}

// 继承
class Car extends Vehicle {
  constructor(name, brand) {
    super(name)
    this.brand = brand
  }
  
  start() {
    super.start()
    console.log(\`\${this.brand} 品牌汽车\`)
  }
}

const car = new Car('宝马', 'BMW')
car.start()

// 静态方法
const vehicle = Vehicle.create('通用车')`
              },
              {
                title: 'Map 和 Set',
                code: `// Map：键值对集合（键可以是任意类型）
const map = new Map()
map.set('name', 'Alice')
map.set(1, 'one')
map.set({ id: 1 }, { value: 100 })

console.log(map.get('name'))      // 'Alice'
console.log(map.size)              // 3
console.log(map.has(1))            // true
map.delete('name')

// Map 遍历
for (const [key, value] of map) {
  console.log(key, value)
}

// Set：唯一值集合
const set = new Set([1, 2, 2, 3, 3, 3])
console.log(set.size)              // 3
set.add(4)
console.log(set.has(2))            // true

// Set 转数组
const unique = [...new Set([1, 1, 2, 2, 3])]  // [1, 2, 3]`
              },
              {
                title: 'Proxy 数据拦截',
                code: `// Proxy：拦截对象操作
const target = { name: 'Vue' }
const handler = {
  get(target, prop) {
    console.log(\`获取 \${String(prop)}\`)
    return target[prop]
  },
  set(target, prop, value) {
    if (typeof value === 'string' && value.length < 3) {
      throw new Error('字符串长度至少3个字符')
    }
    console.log(\`设置 \${String(prop)} = \${value}\`)
    target[prop] = value
    return true
  }
}

const proxy = new Proxy(target, handler)
console.log(proxy.name)      // 获取 name, Vue
proxy.name = 'React'         // 设置 name = React

// 数据验证
const user = new Proxy({}, {
  set(target, prop, value) {
    if (prop === 'age' && !Number.isInteger(value)) {
      throw new TypeError('年龄必须是整数')
    }
    target[prop] = value
    return true
  }
})

user.age = 25  // OK
// user.age = '25'  // TypeError`
              },
              {
                title: '模板字符串和可选链',
                code: `// 模板字符串
const name = 'Alice'
const age = 25
const message = \`
  名字: \${name}
  年龄: \${age}
  明年: \${age + 1}\`
console.log(message)

// 带标签的模板字符串
function highlight(strings, ...values) {
  return strings.reduce((result, string, i) => {
    return result + string + (values[i] ? \`<strong>\${values[i]}</strong>\` : '')
  }, '')
}

const html = highlight\`Hello \${name}, you are \${age}\`

// 可选链 (?.)
const user = { profile: { name: 'Alice' } }
console.log(user?.profile?.name)    // 'Alice'
console.log(user?.address?.street)  // undefined（不报错）

// 空值合并 (??)
const title = null
const defaultTitle = title ?? 'Untitled'  // 'Untitled'`
              }
            ],
            resources: [
              { title: 'MDN ES6 入门', url: 'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference' },
              { title: 'ES6 完整教程', url: 'https://es6.ruanyifeng.com/' },
              { title: 'Map 和 Set', url: 'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map' }
            ]
          },
          {
            id: 'js-dom',
            title: 'DOM 与 BOM',
            summary: 'DOM 操作、事件处理、浏览器对象模型',
            description: 'DOM（Document Object Model）是浏览器为 JavaScript 提供的操作网页内容的接口。BOM（Browser Object Model）提供了访问浏览器窗口的接口。掌握 DOM 操作、事件处理机制、事件委托等技术是前端开发的基础。了解事件冒泡、事件捕获、事件委托等高级技巧能写出更高效的事件处理代码。',
            topics: ['DOM 节点操作', '事件冒泡/捕获', '事件委托', 'localStorage/sessionStorage', 'History API', 'Fetch/XMLHttpRequest', 'IntersectionObserver', 'MutationObserver'],
            useCases: [
              '动态增删改查 DOM 元素',
              '处理用户交互事件',
              '本地存储用户数据',
              '懒加载和无限滚动',
              '页面前进后退导航',
              '网络请求和数据获取'
            ],
            bestPractices: [
              '使用事件委托而非直接绑定',
              '及时移除事件监听避免内存泄漏',
              '优先使用 Fetch API 而非 XMLHttpRequest',
              '使用 querySelector 选择元素',
              '合理使用防抖和节流处理高频事件',
              '使用事件对象的 currentTarget 和 target'
            ],
            codeExamples: [
              {
                title: 'DOM 节点操作',
                code: `// 查询元素
const element = document.getElementById('app')
const elements = document.querySelectorAll('.item')
const firstItem = document.querySelector('.item')

// 创建和添加元素
const div = document.createElement('div')
div.textContent = '新元素'
div.className = 'active'
document.body.appendChild(div)

// 修改属性
element.setAttribute('data-id', '123')
element.dataset.id = '123'       // 推荐
element.id = 'new-id'
element.classList.add('active')
element.classList.remove('disabled')
element.classList.toggle('hidden')

// 获取和修改内容
element.textContent = '纯文本'
element.innerHTML = '<p>HTML 内容</p>'

// 删除元素
element.remove()
element.parentNode.removeChild(element)`
              },
              {
                title: '事件处理和事件委托',
                code: `// 事件监听
element.addEventListener('click', (e) => {
  console.log('点击事件')
  e.preventDefault()       // 阻止默认行为
  e.stopPropagation()     // 阻止事件冒泡
})

// 事件委托（推荐）
document.addEventListener('click', (e) => {
  const target = e.target
  
  // 检查是否点击了列表项
  if (target.matches('.list-item')) {
    console.log('点击了列表项:', target.textContent)
  }
  
  // 检查是否点击了删除按钮
  if (target.matches('.btn-delete')) {
    const item = target.closest('.list-item')
    item.remove()
  }
})

// 事件冒泡和捕获
parent.addEventListener('click', () => {
  console.log('parent bubble')
}, false)  // 冒泡阶段

parent.addEventListener('click', () => {
  console.log('parent capture')
}, true)   // 捕获阶段`
              },
              {
                title: 'Fetch API 网络请求',
                code: `// 基本 GET 请求
fetch('/api/users')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error))

// async/await 方式（推荐）
async function getUsers() {
  try {
    const response = await fetch('/api/users')
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('获取数据失败:', error)
  }
}

// POST 请求
async function createUser(user) {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  })
  return response.json()
}

// 带超时的请求
async function fetchWithTimeout(url, timeout = 5000) {
  const controller = new AbortController()
  const timerId = setTimeout(() => controller.abort(), timeout)
  
  try {
    const response = await fetch(url, { signal: controller.signal })
    clearTimeout(timerId)
    return response
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout')
    }
    throw error
  }
}`
              },
              {
                title: '本地存储',
                code: `// localStorage（永久存储）
localStorage.setItem('token', 'abc123')
const token = localStorage.getItem('token')
localStorage.removeItem('token')
localStorage.clear()

// 存储对象
const user = { name: 'Alice', age: 25 }
localStorage.setItem('user', JSON.stringify(user))
const savedUser = JSON.parse(localStorage.getItem('user'))

// sessionStorage（会话存储，关闭标签页后删除）
sessionStorage.setItem('temp', 'value')

// 存储管理类
class StorageManager {
  static set(key, value, expires = null) {
    const data = {
      value,
      expires: expires ? Date.now() + expires * 1000 : null
    }
    localStorage.setItem(key, JSON.stringify(data))
  }
  
  static get(key) {
    const item = localStorage.getItem(key)
    if (!item) return null
    
    const { value, expires } = JSON.parse(item)
    if (expires && Date.now() > expires) {
      localStorage.removeItem(key)
      return null
    }
    return value
  }
}

// 使用
StorageManager.set('user', 'Alice', 3600)  // 1小时后过期
console.log(StorageManager.get('user'))      // 'Alice'`
              },
              {
                title: '懒加载和 IntersectionObserver',
                code: `// 使用 IntersectionObserver 实现懒加载
const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target
      img.src = img.dataset.src
      img.classList.add('loaded')
      imageObserver.unobserve(img)
    }
  })
})

// 观察所有需要懒加载的图片
document.querySelectorAll('img[data-src]').forEach(img => {
  imageObserver.observe(img)
})

// 无限滚动实现
const sentinel = document.getElementById('sentinel')
const scrollObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    loadMoreData()
  }
})
scrollObserver.observe(sentinel)

async function loadMoreData() {
  const data = await fetchNextPage()
  renderData(data)
}`
              }
            ],
            resources: [
              { title: 'MDN DOM 文档', url: 'https://developer.mozilla.org/zh-CN/docs/Web/API/Document_Object_Model' },
              { title: 'MDN Fetch API', url: 'https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API' },
              { title: 'MDN Event 事件', url: 'https://developer.mozilla.org/zh-CN/docs/Web/API/Event' }
            ]
          },
        ],
      },
      {
        id: 'ts-foundation',
        title: 'TypeScript 基础',
        summary: '类型系统、泛型、接口、类型推导',
        description: 'TypeScript 是 JavaScript 的超集，添加了静态类型系统。通过类型注解、接口、泛型等特性，可以在编译时发现错误，提供更好的代码提示和重构支持。TS 的类型系统非常强大，支持类型推导、联合类型、交叉类型、条件类型等高级特性，是现代前端开发的必备技能。',
        topics: ['基本类型', '接口 Interface', '类型别名 Type', '联合/交叉类型', '泛型 Generics', '类型推导', '类型守卫', '工具类型 (Partial/Required/Pick/Omit)', '条件类型', '映射类型', '装饰器', '命名空间与模块'],
        useCases: [
          '大型项目的类型安全保障',
          'API 接口类型定义',
          '组件 Props 类型约束',
          '提升代码可维护性和重构能力'
        ],
        bestPractices: [
          '开启严格模式 (strict: true)',
          '优先使用类型推导，减少显式类型注解',
          'interface 用于对象形状，type 用于联合类型',
          '使用工具类型简化类型定义',
          '为第三方库添加 .d.ts 类型声明'
        ],
        codeExamples: [
          {
            title: '基本类型和接口',
            code: `// 基本类型
let name: string = 'Vue'
let age: number = 3
let isFramework: boolean = true

// 接口定义对象类型
interface User {
  id: number
  name: string
  email?: string // 可选属性
  readonly createdAt: Date // 只读
}

const user: User = {
  id: 1,
  name: 'Alice',
  createdAt: new Date()
}`
          },
          {
            title: '泛型和工具类型',
            code: `// 泛型函数
function identity<T>(arg: T): T {
  return arg
}

const result = identity<string>('hello')

// 工具类型
interface Todo {
  title: string
  description: string
  completed: boolean
}

// Partial - 所有属性可选
type PartialTodo = Partial<Todo>

// Pick - 选择部分属性
type TodoPreview = Pick<Todo, 'title' | 'completed'>

// Omit - 排除部分属性
type TodoInfo = Omit<Todo, 'completed'>`
          },
          {
            title: 'Vue 3 中的 TypeScript',
            code: `<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  title: string
  count?: number
}

// 定义 Props 类型
const props = withDefaults(defineProps<Props>(), {
  count: 0
})

// 定义 Emits 类型
const emit = defineEmits<{
  update: [value: number]
  delete: [id: string]
}>()

// 类型推导
const total = computed(() => props.count * 2)

function handleClick() {
  emit('update', total.value)
}
</script>`
          }
        ],
        resources: [
          { title: 'TypeScript 官方文档', url: 'https://www.typescriptlang.org/zh/' },
          { title: 'TypeScript 入门教程', url: 'https://ts.xcatliu.com/' }
        ],
        children: [
          {
            id: 'ts-advanced',
            title: 'TypeScript 进阶',
            summary: '类型体操、声明文件、编译配置',
            description: 'TypeScript 进阶涉及高级的类型推导和操作技巧，可以实现复杂的类型约束和转换。通过 infer、递归类型、模板字面量类型等高级特性，可以编写更强大的类型工具。理解声明文件 .d.ts 和 tsconfig.json 配置对于维护大型项目至关重要。协变与逆变等概念影响类型的兼容性判断。',
            topics: ['高级类型推导', 'infer 关键字', '递归类型', '模板字面量类型', '声明文件 .d.ts', 'tsconfig.json 配置', '严格模式', '类型兼容性', '协变与逆变'],
            useCases: [
              '编写通用的类型工具和工具类',
              '深度类型转换和数据结构推导',
              '为第三方库编写类型声明',
              '类型安全的 API 设计和实现',
              '复杂泛型约束的类型编程'
            ],
            bestPractices: [
              '使用 infer 进行条件类型推导，简化复杂的类型逻辑',
              '递归类型需要设定递归深度限制，避免无限递归',
              '模板字面量类型用于字符串操作和事件类型约束',
              '编写声明文件时使用 export declare 确保类型导出',
              '启用 strict 模式获得最大的类型安全保障',
              '理解协变和逆变对于准确理解函数参数的兼容性'
            ],
            codeExamples: [
              {
                title: '条件类型与 infer',
                code: `// 提取数组元素类型
type ArrayElementType<T> = T extends (infer E)[] ? E : never

type StrArray = string[]
type ElementType = ArrayElementType<StrArray> // string

// 提取函数返回值类型
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never

function getValue(): number {
  return 42
}

type Result = ReturnType<typeof getValue> // number

// 提取 Promise 中的值类型
type Awaited<T> = T extends Promise<infer U> ? Awaited<U> : T

type PromiseNum = Promise<number>
type Unwrapped = Awaited<PromiseNum> // number`
              },
              {
                title: '递归类型与深度操作',
                code: `// 深度只读类型
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P]
}

interface User {
  name: string
  info: {
    age: number
    address: {
      city: string
    }
  }
}

type ReadonlyUser = DeepReadonly<User>
// 现在所有层级都是 readonly

// 递归深度优化
type DeepReadonlyWithDepth<T, D extends number[] = []> = D['length'] extends 3 ? T : {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonlyWithDepth<T[P], [...D, 1]> : T[P]
}`
              },
              {
                title: '模板字面量类型',
                code: `// 事件名称与处理器的类型映射
type EventMap = {
  click: { x: number; y: number }
  focus: { target: HTMLElement }
  blur: { target: HTMLElement }
}

type EventName = keyof EventMap // 'click' | 'focus' | 'blur'

// 基于事件名称推导处理器类型
type EventHandler<T extends EventName> = (payload: EventMap[T]) => void

const clickHandler: EventHandler<'click'> = (e) => {
  console.log(e.x, e.y)
}

// 字符串操作类型
type Capitalize<S extends string> = S extends \\\`\\\${infer F}\\\${infer R}\\\`
  ? \\\`\\\${Uppercase<F>}\\\${R}\\\`
  : S

type Hello = Capitalize<'hello'> // 'Hello'

// 生成 getter/setter 方法名
type GetterSetterName<T extends string> = \\\`get\\\${Capitalize<T>}\\\` | \\\`set\\\${Capitalize<T>}\\\`

type UserMethods = GetterSetterName<'name'> // 'getName' | 'setName'`
              },
              {
                title: '声明文件 (.d.ts)',
                code: `// types/global.d.ts
declare global {
  interface Window {
    __APP_CONFIG__: AppConfig
  }
}

export interface AppConfig {
  apiUrl: string
  version: string
  debug: boolean
}

// -------

// utils/helper.d.ts
export function formatDate(date: Date, format?: string): string
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  wait: number
): (...args: Parameters<T>) => void

export interface FormatOptions {
  locale?: string
  timezone?: string
}

// 函数重载
export function parse(data: string): Record<string, any>
export function parse<T>(data: string, schema: T): T

// 命名空间导出
export namespace Logger {
  function info(msg: string): void
  function error(msg: string): void
  function warn(msg: string): void
}`
              },
              {
                title: 'tsconfig.json 关键配置',
                code: `{
  "compilerOptions": {
    // 严格选项
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitThis": true,
    "alwaysStrict": true,

    // 模块与路径
    "module": "ESNext",
    "target": "ES2020",
    "moduleResolution": "node",
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@utils/*": ["src/utils/*"]
    },

    // 输出选项
    "outDir": "./dist",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,

    // 实验性特性
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,

    // 其他选项
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "esModuleInterop": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}`
              },
              {
                title: '协变与逆变',
                code: `// 协变（Covariant）- 子类型可以赋值给父类型
type Animal = { type: 'animal' }
type Dog = { type: 'animal'; bark: () => void }

let animal: Animal
let dog: Dog = { type: 'animal', bark: () => {} }

animal = dog // ✅ 协变：Dog 是 Animal 的子类型

// 逆变（Contravariant）- 参数类型相反
type Callback<T> = (param: T) => void

let animalCallback: Callback<Animal> = (a) => console.log(a.type)
let dogCallback: Callback<Dog> = (d) => console.log(d.bark())

// 函数参数是逆变的
animalCallback = dogCallback // ❌ 错误：不能赋值
dogCallback = animalCallback // ✅ 正确：可以接受更宽泛的参数

// 函数返回值是协变的
type AnimalFactory = () => Animal
type DogFactory = () => Dog

let animalFactory: AnimalFactory = () => ({ type: 'animal' })
let dogFactory: DogFactory = () => ({ type: 'animal', bark: () => {} })

animalFactory = dogFactory // ✅ 协变：返回值子类型可以赋值给父类型
dogFactory = animalFactory // ❌ 错误：不能赋值`
              },
              {
                title: '类型工具函数示例',
                code: `// 提取对象的值类型
type ValueOf<T> = T[keyof T]

interface Config {
  theme: 'light' | 'dark'
  debug: boolean
  port: number
}

type ConfigValue = ValueOf<Config> // 'light' | 'dark' | boolean | number

// ---

// 获取可选和必选属性
type Required<T> = { [P in keyof T]-?: T[P] }
type Partial<T> = { [P in keyof T]?: T[P] }

// ---

// Pick 和 Omit
type Pick<T, K extends keyof T> = { [P in K]: T[P] }
type Omit<T, K extends string | number | symbol> = Pick<T, Exclude<keyof T, K>>

interface User {
  id: number
  name: string
  email: string
  password: string
}

type UserPreview = Pick<User, 'id' | 'name'> // { id; name }
type UserInput = Omit<User, 'id'> // { name; email; password }`
              }
            ],
            resources: [
              { title: 'TypeScript 官方文档 - Advanced Types', url: 'https://www.typescriptlang.org/docs/handbook/advanced-types.html' },
              { title: '类型体操 - Type Challenges', url: 'https://github.com/type-challenges/type-challenges' },
              { title: 'TypeScript 高级类型指南', url: 'https://www.typescriptlang.org/docs/handbook/utility-types.html' },
              { title: 'tsconfig.json 完整配置', url: 'https://www.typescriptlang.org/tsconfig' }
            ]
          },
          {
            id: 'ts-vue',
            title: 'TypeScript 在 Vue3 中',
            summary: 'Props 类型、Emit 类型、Ref 类型推导',
            description: 'Vue 3 与 TypeScript 的结合提供了完整的类型安全体验。<script setup> 中使用 defineProps 和 defineEmits 可以直接定义类型，无需额外的类型验证代码。ref、reactive、computed 等响应式 API 都能正确推导类型，provide/inject 也支持类型检查。通过 TypeScript，可以构建更健壮的 Vue 3 应用，提高开发效率和代码质量。',
            topics: ['defineProps 类型定义', 'defineEmits 类型', 'ref/reactive 类型推导', 'computed 类型', 'provide/inject 类型', '组件类型导出', 'Pinia Store 类型'],
            useCases: [
              '定义组件 Props 并进行类型校验',
              '为组件事件添加类型约束',
              '响应式数据的类型推导和自动补全',
              '跨层级提供数据时的类型安全',
              '编写可复用的组合式函数',
              '构建类型安全的状态管理'
            ],
            bestPractices: [
              '使用 defineProps<Props>() 直接定义 Props 类型，避免运行时验证',
              '使用 withDefaults 为 Props 提供默认值并保持类型',
              '使用 defineEmits<Events>() 定义事件，获得发出事件的类型检查',
              'ref<T>() 显式指定泛型，提高类型推导准确性',
              '为 provide/inject 使用 InjectionKey<T> 确保类型安全',
              '从组件导出类型，便于父组件使用和传值'
            ],
            codeExamples: [
              {
                title: 'defineProps 与 withDefaults',
                code: `<script setup lang="ts">
interface Props {
  title: string
  content?: string
  count?: number
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'danger'
  tags?: string[]
}

// 使用 withDefaults 设置默认值
const props = withDefaults(defineProps<Props>(), {
  content: '默认内容',
  count: 0,
  disabled: false,
  variant: 'primary',
  tags: () => []
})

// 类型提示：count 类型为 number，默认值为 0
const doubledCount = computed(() => props.count * 2)
</script>

<template>
  <div :class="['card', \`variant-\${variant}\`]" :disabled="disabled">
    <h2>{{ title }}</h2>
    <p>{{ content }}</p>
    <span class="count">{{ count }}</span>
    <div class="tags">
      <span v-for="tag in tags" :key="tag">{{ tag }}</span>
    </div>
  </div>
</template>`
              },
              {
                title: 'defineEmits 类型定义',
                code: `<script setup lang="ts">
import { ref } from 'vue'

interface FormData {
  name: string
  email: string
}

const form = ref<FormData>({ name: '', email: '' })

// 定义事件类型
const emit = defineEmits<{
  submit: [data: FormData]
  cancel: []
  update: [field: keyof FormData, value: string | number]
}>()

const handleSubmit = () => {
  emit('submit', form.value)
}

const handleCancel = () => {
  emit('cancel')
}

const handleUpdate = (field: keyof FormData, value: string) => {
  emit('update', field, value)
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <input
      v-model="form.name"
      placeholder="名字"
      @change="handleUpdate('name', \$event.target.value)"
    />
    <input
      v-model="form.email"
      placeholder="邮箱"
      @change="handleUpdate('email', \$event.target.value)"
    />
    <button type="submit">提交</button>
    <button type="button" @click="handleCancel">取消</button>
  </form>
</template>`
              },
              {
                title: 'ref/reactive 类型推导',
                code: `<script setup lang="ts">
import { ref, reactive, computed } from 'vue'

// ref 基本类型 - 自动推导
const count = ref(0) // ref<number>
const name = ref('Vue') // ref<string>
const isDone = ref(false) // ref<boolean>

// ref 复杂类型 - 显式指定泛型更佳
interface User {
  id: number
  name: string
  email: string
}

const user = ref<User | null>(null) // ref<User | null>

// reactive 对象
const state = reactive({
  items: [] as Array<{ id: number; title: string }>,
  isLoading: false,
  error: null as string | null
})

// computed 类型推导
const itemCount = computed(() => state.items.length) // ComputedRef<number>

const firstItem = computed(() => {
  return state.items[0] // ComputedRef<{ id; title } | undefined>
})

// 在模板中自动解包
</script>

<template>
  <div>
    <!-- ref 在模板中自动解包 -->
    <p>{{ count }} - {{ name }}</p>
    
    <!-- reactive 直接使用 -->
    <div v-if="!state.isLoading">
      <ul>
        <li v-for="item in state.items" :key="item.id">{{ item.title }}</li>
      </ul>
    </div>
    
    <!-- computed 也自动解包 -->
    <p>共 {{ itemCount }} 项</p>
  </div>
</template>`
              },
              {
                title: 'provide/inject 类型安全',
                code: `// types/injection-keys.ts
import type { InjectionKey, Ref } from 'vue'

export interface AppContext {
  theme: 'light' | 'dark'
  locale: string
  version: string
}

export const APP_CONTEXT_KEY: InjectionKey<AppContext> = Symbol('app-context')

export const USER_KEY: InjectionKey<Ref<{ id: number; name: string } | null>> = Symbol('user')

// ---

// Parent.vue
<script setup lang="ts">
import { provide, ref } from 'vue'
import { APP_CONTEXT_KEY, USER_KEY } from './types/injection-keys'

const appContext = {
  theme: 'light',
  locale: 'zh-CN',
  version: '1.0.0'
}

const user = ref({ id: 1, name: 'Alice' })

provide(APP_CONTEXT_KEY, appContext)
provide(USER_KEY, user)
</script>

// ---

// Child.vue
<script setup lang="ts">
import { inject } from 'vue'
import { APP_CONTEXT_KEY, USER_KEY } from './types/injection-keys'

// 类型自动推导
const appContext = inject(APP_CONTEXT_KEY)
const user = inject(USER_KEY)

// appContext 类型为 AppContext | undefined
// user 类型为 Ref<{ id: number; name: string } | null> | undefined

const theme = appContext?.theme // 安全访问
const userName = user?.value?.name // 正确的 ref 解包
</script>`
              },
              {
                title: '组件类型导出',
                code: `// MyButton.vue
<script setup lang="ts" generic="T extends string | number">
interface Props {
  label: string
  value?: T
  disabled?: boolean
}

interface Emits {
  click: [value: T | undefined]
}

defineProps<Props>()
defineEmits<Emits>()

// 导出组件类型供外部使用
defineExpose<{
  focus: () => void
  reset: () => void
}>()

const focus = () => {
  // ...
}

const reset = () => {
  // ...
}
</script>

// ---

// 在父组件中使用
<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import MyButton from './MyButton.vue'

// 获取组件实例类型
type MyButtonInstance = InstanceType<typeof MyButton>

// 获取组件 Props 类型
type MyButtonProps = ComponentProps<typeof MyButton>

const buttonRef = ref<MyButtonInstance>(null)

const handleClick = () => {
  buttonRef.value?.focus()
}</script>

<template>
  <MyButton
    ref="buttonRef"
    label="点击"
    :value="42"
    @click="handleClick"
  />
</template>`
              },
              {
                title: '组合式函数的类型定义',
                code: `// composables/useFetch.ts
import { ref, computed } from 'vue'
import type { Ref, ComputedRef } from 'vue'

interface FetchOptions {
  method?: 'GET' | 'POST'
  headers?: Record<string, string>
  timeout?: number
}

interface FetchReturn<T> {
  data: Ref<T | null>
  loading: Ref<boolean>
  error: Ref<Error | null>
  fetch: (url: string, options?: FetchOptions) => Promise<T>
}

export function useFetch<T = any>(url: string): FetchReturn<T> {
  const data = ref<T | null>(null)
  const loading = ref(false)
  const error = ref<Error | null>(null)

  const fetch = async (fetchUrl: string, options?: FetchOptions) => {
    loading.value = true
    try {
      const response = await window.fetch(fetchUrl, options)
      data.value = await response.json()
      return data.value as T
    } catch (e) {
      error.value = e instanceof Error ? e : new Error(String(e))
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return { data, loading, error, fetch }
}

// ---

// 在组件中使用
<script setup lang="ts">
import type { User } from '@/types'
import { useFetch } from '@/composables/useFetch'

const { data: users, loading } = useFetch<User[]>('/api/users')
// users 类型为 Ref<User[] | null>
</script>`
              },
              {
                title: 'Pinia Store 类型',
                code: `// stores/user.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'user'
}

export const useUserStore = defineStore('user', () => {
  // State
  const currentUser = ref<User | null>(null)
  const isLoading = ref(false)

  // Getters
  const isAdmin = computed(() => currentUser.value?.role === 'admin')
  const userName = computed(() => currentUser.value?.name ?? '游客')

  // Actions
  const fetchUser = async (id: number): Promise<User> => {
    isLoading.value = true
    try {
      const response = await fetch(\\\`/api/users/\\\${id}\\\`)
      const data = await response.json()
      currentUser.value = data
      return data
    } finally {
      isLoading.value = false
    }
  }

  const logout = (): void => {
    currentUser.value = null
  }

  return {
    // State
    currentUser,
    isLoading,
    // Getters
    isAdmin,
    userName,
    // Actions
    fetchUser,
    logout
  }
})

// ---

// 在组件中使用
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

// 获取响应式状态和计算属性
const { currentUser, isAdmin, userName } = storeToRefs(userStore)

// 获取 action
const { fetchUser, logout } = userStore

// 所有类型都正确推导
const user = currentUser.value // User | null
</script>`
              }
            ],
            resources: [
              { title: 'Vue 3 + TypeScript 官方文档', url: 'https://cn.vuejs.org/guide/typescript/overview.html' },
              { title: 'defineProps 类型用法', url: 'https://cn.vuejs.org/api/sfc-script-setup.html#defineprops-defineemits' },
              { title: 'Ref 类型推导', url: 'https://cn.vuejs.org/api/reactivity-core.html#ref' },
              { title: 'Pinia TypeScript 指南', url: 'https://pinia.vuejs.org/cookbook/type-safe-usage.html' }
            ]
          },
        ],
      },
      {
        id: 'css-foundation',
        title: 'CSS 基础',
        summary: '选择器、布局、盒模型、视觉效果',
        description: 'CSS（层叠样式表）是网页样式的标准语言，用于控制 HTML 元素的外观和布局。掌握选择器、盒模型、定位、浮动、BFC 等基础概念对于前端开发至关重要。现代 CSS 引入了 Flexbox 和 Grid 等强大的布局工具，大大简化了复杂页面的开发。',
        topics: ['选择器 (类/ID/属性/伪类)', '盒模型', '定位 (static/relative/absolute/fixed/sticky)', '浮动与清除浮动', 'BFC 块级格式化上下文', '层叠上下文', '优先级与继承', '单位 (px/em/rem/vh/vw)'],
        useCases: [
          '页面元素的样式控制和视觉设计',
          '响应式布局的实现',
          '复杂排版和组件样式',
          '动画和视觉效果的实现'
        ],
        bestPractices: [
          '使用语义化的类名和 BEM 命名规范',
          '合理使用 em/rem 实现可维护的相对单位',
          '优先使用 Flexbox 和 Grid 替代浮动布局',
          '理解 BFC 和层叠上下文，避免布局问题',
          '使用 CSS 变量实现主题和配置管理'
        ],
        codeExamples: [
          {
            title: '选择器与优先级',
            code: `/* 简单选择器 */
* { margin: 0; padding: 0; } /* 通配符 */
p { color: black; } /* 元素选择器 */
.container { width: 100%; } /* 类选择器 */
#main { height: 100vh; } /* ID 选择器 */

/* 属性选择器 */
input[type="text"] { padding: 8px; }
a[href^="https"] { color: green; } /* 开头匹配 */
a[href$=".pdf"] { margin-left: 5px; } /* 结尾匹配 */

/* 伪类选择器 */
a:hover { text-decoration: underline; }
a:visited { color: purple; }
input:focus { border-color: blue; }
li:first-child { margin-top: 0; }
li:nth-child(2n) { background: #f0f0f0; }

/* 组合选择器 */
.container > p { margin: 10px; } /* 子元素 */
.container p { margin: 10px; } /* 后代元素 */
h1 + p { margin-top: 0; } /* 相邻兄弟 */
h1 ~ p { color: #666; } /* 通用兄弟 */

/* 优先级：!important > 内联 > ID > 类/属性/伪类 > 元素 */
.box { color: blue; } /* 优先级：10 */
#box { color: red; } /* 优先级：100 - 更高 */
div.box { color: green; } /* 优先级：11 */`
          },
          {
            title: '盒模型与定位',
            code: `/* 盒模型 */
.box {
  /* content: 内容区域 */
  width: 200px;
  height: 100px;
  
  /* padding: 内边距 - 在边框内侧 */
  padding: 20px; /* 上右下左 20px */
  padding: 10px 20px; /* 上下 10px, 左右 20px */
  
  /* border: 边框 */
  border: 1px solid #999;
  
  /* margin: 外边距 - 在边框外侧 */
  margin: 10px auto; /* 上下 10px, 左右 auto（水平居中） */
  
  /* 盒模型计算 */
  box-sizing: content-box; /* 默认：width/height 不包含 padding/border */
  /* box-sizing: border-box; */ /* 推荐：width/height 包含 padding/border */
}

/* 定位 */
.container {
  position: relative; /* 相对定位 - 相对于自身位置 */
  top: 10px;
  left: 20px;
}

.absolute {
  position: absolute; /* 绝对定位 - 相对于最近的定位祖先元素 */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* 居中技巧 */
}

.fixed {
  position: fixed; /* 固定定位 - 相对于视口 */
  bottom: 20px;
  right: 20px;
}

.sticky {
  position: sticky; /* 粘性定位 - 滚动时粘在指定位置 */
  top: 0;
}`
          },
          {
            title: 'BFC 与浮动清除',
            code: `/* BFC (Block Formatting Context) 应用 */

/* 1. 清除浮动 */
.clearfix::after {
  content: '';
  display: table;
  clear: both;
}

/* 2. 阻止 margin collapse（外边距折叠） */
.container {
  overflow: hidden; /* 创建 BFC */
  /* 或者使用 display: flow-root; */
}

.child {
  margin-top: 20px; /* 不会与父元素的 margin 合并 */
}

/* 3. 自适应两栏布局 */
.container {
  display: flex;
  gap: 10px;
}

.left {
  width: 200px;
  float: left;
}

.right {
  overflow: hidden; /* 创建 BFC，自适应剩余空间 */
}

/* 4. 设置 overflow 创建 BFC 解决浮动父高度问题 */
.float-container {
  overflow: auto; /* 创建 BFC */
  border: 1px solid #999;
}

.float-child {
  float: left;
  width: 50%;
  background: #f0f0f0;
}`
          },
          {
            title: '层叠上下文与 z-index',
            code: `/* 层叠上下文 */

/* 1. 创建层叠上下文的方式 */
.context1 { position: relative; z-index: 1; } /* 定位 + z-index */
.context2 { display: flex; z-index: 1; } /* flex 容器 + z-index */
.context3 { opacity: 0.9; } /* opacity != 1 */
.context4 { transform: scale(1.1); } /* transform */
.context5 { filter: blur(1px); } /* filter */

/* 2. z-index 只在同一层叠上下文内有效 */
.parent1 {
  position: relative;
  z-index: 10;
}

.child1 {
  position: relative;
  z-index: 100; /* 再高也压不过 parent2（因为 parent2 的 z-index 更高） */
}

.parent2 {
  position: relative;
  z-index: 20;
}

.child2 {
  position: relative;
  z-index: 1; /* 但这个会在 child1 上面 */
}

/* 3. 实际应用：模态框布局 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.modal-content {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  z-index: 1001; /* 比 overlay 高 */
}`
          },
          {
            title: '单位与相对长度',
            code: `/* CSS 单位 */

.container {
  /* 绝对单位 */
  width: 100px; /* px - 像素，最常用 */
  
  /* 相对单位 - 相对于字体大小 */
  /* em - 相对于元素自身或父元素的 font-size */
  font-size: 16px;
  margin: 1em; /* 16px */
  padding: 0.5em; /* 8px */
  
  /* rem - 相对于根元素 (html) 的 font-size */
  /* 推荐用 rem 设置尺寸，便于统一控制 */
  margin-bottom: 2rem; /* 32px (假设 html font-size: 16px) */
}

/* 视口相对单位 */
.fullscreen {
  width: 100vw; /* 100% 视口宽度 */
  height: 100vh; /* 100% 视口高度 */
  margin: 10vh; /* 10% 视口高度 */
}

/* 响应式设计典范 */
html {
  font-size: 16px; /* 基础字体大小 */
}

@media (max-width: 768px) {
  html {
    font-size: 14px; /* 在小屏幕上使用更小的基础字体 */
  }
}

.heading {
  font-size: 2rem; /* 在大屏幕上 32px，小屏幕上 28px */
  margin: 1rem;
}

/* 百分比 - 相对于父元素 */
.child {
  width: 50%; /* 父元素宽度的 50% */
  height: 100%; /* 父元素高度的 100% */
}`
          }
        ],
        children: [
          {
            id: 'css-layout',
            title: 'CSS 布局',
            summary: 'Flexbox、Grid、多列布局',
            description: 'Flexbox 和 Grid 是现代 CSS 中最强大的布局工具。Flexbox（弹性盒子）适合一维布局，提供了灵活的对齐和分布方式。Grid（网格布局）适合二维布局，可以同时控制行和列。两者结合可以实现复杂的响应式布局。',
            topics: ['Flexbox 弹性布局', 'Grid 网格布局', '多列布局', '响应式布局', '媒体查询', '移动端适配 (rem/vw)', '容器查询'],
            useCases: [
              '导航栏和菜单布局',
              '卡片网格排列',
              '响应式多列布局',
              '复杂的自适应布局',
              'App 和网站的整体框架'
            ],
            bestPractices: [
              '优先使用 Flexbox 处理一维布局',
              '使用 Grid 处理二维网格布局',
              '结合 media queries 实现响应式设计',
              '使用 gap 属性简化间距管理',
              '合理使用 auto 和 fr 单位实现自适应'
            ],
            codeExamples: [
              {
                title: 'Flexbox 布局',
                code: `/* Flexbox 容器 */
.flex-container {
  display: flex; /* 启用 flex 布局 */
  
  /* 主轴方向 */
  flex-direction: row; /* 默认：水平 */
  /* flex-direction: column; */ /* 垂直 */
  
  /* 主轴对齐 */
  justify-content: space-between; /* 两端对齐 */
  /* justify-content: center; */ /* 居中 */
  /* justify-content: space-around; */ /* 均匀分布 */
  
  /* 交叉轴对齐 */
  align-items: center; /* 垂直居中 */
  /* align-items: flex-start; */ /* 顶部 */
  
  /* 多行处理 */
  flex-wrap: wrap; /* 换行 */
  gap: 10px; /* 项目间距 */
  
  height: 200px;
}

/* Flexbox 项目 */
.flex-item {
  /* 控制伸缩性 */
  flex: 1; /* 等分剩余空间 */
  /* flex: 0 0 200px; */ /* 固定宽度 200px */
  
  /* 单独对齐 */
  align-self: flex-end; /* 交叉轴末端 */
}

/* 实例：导航栏 */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  background: #333;
}

.logo { flex-shrink: 0; } /* 不压缩 logo */
.nav-menu { display: flex; gap: 20px; flex: 1; } /* 占据剩余空间 */
.nav-menu a { color: white; text-decoration: none; }
.user-menu { display: flex; gap: 10px; flex-shrink: 0; }`
              },
              {
                title: 'Grid 布局',
                code: `/* Grid 容器 */
.grid-container {
  display: grid;
  
  /* 定义列 */
  grid-template-columns: repeat(3, 1fr); /* 3 等分列 */
  /* grid-template-columns: 200px 1fr 200px; */ /* 固定 + 自适应 + 固定 */
  /* grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); */ /* 响应式 */
  
  /* 定义行 */
  grid-template-rows: repeat(2, 100px); /* 2 行，各 100px */
  /* grid-auto-rows: 100px; */ /* 自动行高 */
  
  /* 间距 */
  gap: 10px; /* 行列间距 */
  
  /* 对齐 */
  justify-items: center; /* 水平对齐 */
  align-items: center; /* 垂直对齐 */
}

/* Grid 项目 */
.grid-item {
  /* 跨越多列/行 */
  grid-column: span 2; /* 跨 2 列 */
  /* grid-row: 1 / 3; */ /* 从第 1 行到第 3 行 */
  
  /* 单独对齐 */
  justify-self: start;
  align-self: end;
}

/* 实例：常见布局 */
.dashboard {
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-rows: 60px 1fr 40px;
  gap: 10px;
  height: 100vh;
}

.header { grid-column: 1 / -1; background: #333; }
.sidebar { grid-row: 2; background: #f0f0f0; }
.main { grid-row: 2; background: white; overflow: auto; }
.footer { grid-column: 1 / -1; background: #ddd; }`
              },
              {
                title: '响应式布局',
                code: `/* 移动优先的响应式设计 */

/* 小屏幕（手机） */
.container {
  display: grid;
  grid-template-columns: 1fr; /* 单列 */
  gap: 10px;
  padding: 10px;
}

.sidebar { display: none; } /* 隐藏侧边栏 */

/* 平板屏幕 */
@media (min-width: 768px) {
  .container {
    grid-template-columns: 1fr 250px; /* 两列 */
    padding: 20px;
  }
  
  .sidebar { display: block; } /* 显示侧边栏 */
}

/* 桌面屏幕 */
@media (min-width: 1024px) {
  .container {
    max-width: 1200px;
    margin: 0 auto;
    gap: 20px;
  }
}

/* 大屏幕 */
@media (min-width: 1440px) {
  .container {
    max-width: 1400px;
  }
}

/* 现代响应式方案：使用 auto-fit/auto-fill */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  /* 在小屏幕上自动换行，大屏幕上自动增加列数 */
}`
              }
            ],
            resources: [
              { title: 'Flexbox 完整指南', url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/' },
              { title: 'Grid 完整指南', url: 'https://css-tricks.com/snippets/css/complete-guide-grid/' },
              { title: '响应式设计最佳实践', url: 'https://web.dev/responsive-web-design-basics/' }
            ]
          },
          {
            id: 'css-modern',
            title: '现代 CSS',
            summary: 'CSS 变量、动画、过渡、滤镜',
            description: 'CSS 现代特性包括自定义属性（CSS 变量）、过渡和动画、变换和滤镜等。这些特性大大增强了 CSS 的表达力，可以实现复杂的视觉效果而不需要 JavaScript。',
            topics: ['CSS 自定义属性 (变量)', 'Transition 过渡', 'Animation 动画', 'Transform 变换', 'Filter 滤镜', 'backdrop-filter', 'clip-path', 'mask', '@container', '@layer'],
            useCases: [
              '主题切换和动态颜色管理',
              '平滑的交互动画',
              '视觉效果和滤镜应用',
              '复杂的形状和遮罩设计',
              '渐进式增强和兼容方案'
            ],
            bestPractices: [
              '使用 CSS 变量实现可维护的设计系统',
              '动画使用 will-change 和 transform 优化性能',
              '避免频繁触发 reflow 和 repaint',
              '对关键动画使用 animation 而非 transition',
              '提供无动画方案 prefers-reduced-motion'
            ],
            codeExamples: [
              {
                title: 'CSS 变量与主题',
                code: `/* 定义 CSS 变量 */
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --border-radius: 4px;
  --spacing-unit: 8px;
  
  /* 颜色系统 */
  --color-bg: #ffffff;
  --color-text: #333333;
  --color-border: #e0e0e0;
}

/* 暗黑模式 */
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #1a1a1a;
    --color-text: #ffffff;
    --color-border: #333333;
  }
}

/* 或者使用类切换 */
html.dark-mode {
  --color-bg: #1a1a1a;
  --color-text: #ffffff;
}

/* 使用变量 */
.button {
  background: var(--primary-color);
  border-radius: var(--border-radius);
  padding: calc(var(--spacing-unit) * 2);
  border: 1px solid var(--color-border);
}

.button:hover {
  background: var(--secondary-color);
}

/* 响应式变量 */
@media (max-width: 768px) {
  :root {
    --spacing-unit: 4px; /* 小屏幕更小间距 */
  }
}`
              },
              {
                title: 'Transition 过渡',
                code: `/* 基础过渡 */
.box {
  width: 100px;
  height: 100px;
  background: blue;
  
  /* 过渡属性 */
  transition: background 0.3s ease, transform 0.3s ease;
}

.box:hover {
  background: red;
  transform: scale(1.1);
}

/* ---*/

/* 详细过渡设置 */
.element {
  transition-property: all; /* 哪些属性变化时触发过渡 */
  transition-duration: 0.3s; /* 过渡持续时间 */
  transition-timing-function: ease-in-out; /* 过渡函数 */
  transition-delay: 0.1s; /* 延迟开始时间 */
}

/* 简写 */
.element {
  transition: all 0.3s ease 0.1s;
}

/* 过渡函数选项 */
.linear { transition: all 0.3s linear; } /* 匀速 */
.ease { transition: all 0.3s ease; } /* 默认，开头慢中间快结尾慢 */
.ease-in { transition: all 0.3s ease-in; } /* 开头慢 */
.ease-out { transition: all 0.3s ease-out; } /* 结尾慢 */
.cubic-bezier { transition: all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1); } /* 自定义 */

/* 实例：平滑颜色过渡 */
a {
  color: #007bff;
  transition: color 0.2s ease;
}

a:hover {
  color: #0056b3;
}`
              },
              {
                title: 'Animation 动画',
                code: `/* 定义关键帧 */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-100px);
  }
  
  50% {
    opacity: 0.5;
  }
  
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 应用动画 */
.element {
  animation: slideIn 0.5s ease-out;
}

/* 详细设置 */
.element-detailed {
  animation-name: slideIn; /* 动画名称 */
  animation-duration: 0.5s; /* 持续时间 */
  animation-timing-function: ease-out; /* 时间函数 */
  animation-delay: 0.2s; /* 延迟 */
  animation-iteration-count: 1; /* 播放次数 (infinite) */
  animation-direction: normal; /* normal, reverse, alternate */
  animation-fill-mode: forwards; /* 动画后保持状态 */
  animation-play-state: running; /* 暂停或运行 */
}

/* 简写 */
.element {
  animation: slideIn 0.5s ease-out 0.2s 1 normal forwards;
}

/* 实例：加载动画 */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.loader {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}`
              },
              {
                title: 'Transform 变换',
                code: `/* 2D 变换 */
.box {
  /* 平移 */
  transform: translateX(50px); /* X 轴平移 */
  transform: translateY(30px); /* Y 轴平移 */
  transform: translate(50px, 30px); /* 同时平移 */
  
  /* 缩放 */
  transform: scaleX(1.5); /* X 轴缩放 */
  transform: scaleY(0.8); /* Y 轴缩放 */
  transform: scale(1.2); /* 同时缩放 */
  
  /* 旋转 */
  transform: rotate(45deg);
  
  /* 倾斜 */
  transform: skewX(20deg);
  transform: skew(20deg, 10deg);
  
  /* 组合变换 */
  transform: translate(50px, 30px) rotate(45deg) scale(1.2);
}

/* 3D 变换 */
.container {
  perspective: 1000px; /* 设置透视距离 */
}

.box-3d {
  /* 3D 平移 */
  transform: translateZ(50px); /* Z 轴平移 */
  transform: translate3d(50px, 30px, 20px);
  
  /* 3D 旋转 */
  transform: rotateX(45deg); /* 绕 X 轴旋转 */
  transform: rotateY(45deg); /* 绕 Y 轴旋转 */
  transform: rotateZ(45deg); /* 绕 Z 轴旋转 */
  
  /* 3D 缩放 */
  transform: scaleZ(1.5);
}

/* 变换原点 */
.origin {
  transform-origin: center; /* 默认 */
  transform-origin: top left; /* 左上角 */
  transform-origin: 50% 50%; /* 自定义点 */
  
  transform: rotate(45deg);
}

/* 实例：卡片翻转 */
.card {
  width: 200px;
  height: 300px;
  perspective: 1000px;
}

.card-inner {
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.card:hover .card-inner {
  transform: rotateY(180deg);
}`
              },
              {
                title: 'Filter 滤镜',
                code: `/* 常用滤镜 */
.element {
  /* 模糊 */
  filter: blur(5px);
  
  /* 亮度 (0-1 变暗，>1 变亮) */
  filter: brightness(0.8);
  
  /* 对比度 */
  filter: contrast(1.5);
  
  /* 灰度 (0-1, 1 完全灰度) */
  filter: grayscale(0.5);
  
  /* 色相旋转 (0-360deg) */
  filter: hue-rotate(90deg);
  
  /* 反色 (0-1) */
  filter: invert(0.5);
  
  /* 饱和度 */
  filter: saturate(2);
  
  /* 棕褐色 */
  filter: sepia(0.5);
  
  /* 组合多个滤镜 */
  filter: blur(2px) brightness(0.9) contrast(1.1);
}

/* backdrop-filter - 对背景应用滤镜 */
.modal-header {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.8);
}

/* 图片悬停效果 */
.image-hover {
  transition: filter 0.3s;
}

.image-hover:hover {
  filter: brightness(1.1) saturate(1.2);
}

/* 暗黑模式图片处理 */
@media (prefers-color-scheme: dark) {
  img {
    filter: brightness(0.9);
  }
}`
              }
            ],
            resources: [
              { title: 'MDN - CSS Transitions', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Transitions' },
              { title: 'MDN - CSS Animations', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations' },
              { title: 'MDN - CSS Transform', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/transform' },
              { title: 'Easing Functions Cheat Sheet', url: 'https://easings.net/' }
            ]
          },
          {
            id: 'css-preprocessor',
            title: 'CSS 预处理器',
            summary: 'Sass、Less、PostCSS',
            description: 'CSS 预处理器为 CSS 添加了编程特性，如变量、嵌套、混入、函数等。Sass（SCSS）是最流行的预处理器，提供了强大的功能。PostCSS 是一个通用的样式处理平台，支持插件扩展，包括 Autoprefixer、Tailwind CSS 等。',
            topics: ['Sass/SCSS 语法', 'Less 语法', '嵌套规则', '变量与混入', 'PostCSS 插件', 'Autoprefixer', 'Tailwind CSS', 'UnoCSS'],
            useCases: [
              '大型项目的样式管理和组织',
              '设计系统的实现和维护',
              '自动化浏览器兼容性处理',
              '原子化 CSS 和工具类库',
              '减少代码重复和提高可维护性'
            ],
            bestPractices: [
              '使用 SCSS 而非 SASS 语法，保持与 CSS 相近',
              '合理使用嵌套，避免过度嵌套导致选择器过重',
              '提取公共变量和 mixin，建立可复用的样式库',
              '使用 PostCSS 自动添加浏览器前缀',
              '优先考虑 Tailwind CSS 用于快速原型开发'
            ],
            codeExamples: [
              {
                title: 'SCSS 变量与嵌套',
                code: `/* 定义变量 */
$primary-color: #007bff;
$secondary-color: #6c757d;
$border-radius: 4px;
$spacing-base: 8px;

$breakpoints: (
  'small': 576px,
  'medium': 768px,
  'large': 992px,
  'extra-large': 1200px
);

/* 嵌套规则 */
.navbar {
  background: $primary-color;
  padding: $spacing-base * 2;
  
  .logo {
    font-size: 24px;
    font-weight: bold;
  }
  
  .nav-menu {
    display: flex;
    gap: $spacing-base;
    
    li {
      list-style: none;
    }
    
    a {
      color: white;
      text-decoration: none;
      transition: color 0.3s;
      
      &:hover {
        color: $secondary-color;
      }
    }
  }
}

/* 父选择器引用 */
.button {
  padding: $spacing-base;
  border-radius: $border-radius;
  
  &:hover {
    opacity: 0.9;
  }
  
  &.active {
    font-weight: bold;
  }
}`
              },
              {
                title: 'SCSS Mixin 和 Function',
                code: `/* Mixin - 可复用的样式块 */
@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

@mixin button-style($bg-color) {
  background: $bg-color;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
  
  &:hover {
    opacity: 0.9;
  }
}

/* 使用 Mixin */
.modal-header {
  @include flex-center;
}

.btn-primary {
  @include button-style($primary-color);
}

.btn-secondary {
  @include button-style($secondary-color);
}

/* ---*/

/* Function - 计算和返回值 */
@function get-spacing($multiplier) {
  @return $spacing-base * $multiplier;
}

@function strip-unit($number) {
  @return $number / ($number * 0 + 1);
}

/* 使用 Function */
.element {
  margin: get-spacing(2); /* 16px */
  padding: get-spacing(3); /* 24px */
}

/* 响应式 Mixin */
@mixin respond-to($breakpoint) {
  @if map-has-key($breakpoints, $breakpoint) {
    @media (min-width: map-get($breakpoints, $breakpoint)) {
      @content;
    }
  }
}

.container {
  width: 100%;
  
  @include respond-to('medium') {
    width: 750px;
  }
  
  @include respond-to('large') {
    width: 970px;
  }
}`
              },
              {
                title: 'PostCSS 和 Autoprefixer',
                code: `/* postcss.config.js */
module.exports = {
  plugins: [
    require('autoprefixer'),
    require('postcss-preset-env'),
    require('cssnano')({
      preset: ['default', { discardComments: { removeAll: true } }]
    })
  ]
}

/* 源 CSS */
.element {
  display: flex;
  background: linear-gradient(to right, #000, #fff);
  user-select: none;
}

/* 编译后（自动添加浏览器前缀） */
.element {
  display: -webkit-flex;
  display: flex;
  background: linear-gradient(to right, #000, #fff);
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}`
              },
              {
                title: 'Tailwind CSS 原子化',
                code: `<!-- tailwind.config.js -->
module.exports = {
  content: ['./src/**/*.{html,js,vue}'],
  theme: {
    extend: {
      colors: {
        primary: '#007bff',
        secondary: '#6c757d'
      },
      spacing: {
        '128': '32rem'
      }
    }
  },
  plugins: []
}

<!-- HTML 使用 -->
<div class="flex justify-center items-center h-screen bg-gray-100">
  <div class="bg-white rounded-lg shadow-lg p-8">
    <h1 class="text-2xl font-bold text-gray-800 mb-4">
      Welcome to Tailwind CSS
    </h1>
    <p class="text-gray-600 mb-6">
      Build responsive designs without leaving your HTML.
    </p>
    <button class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
      Get Started
    </button>
  </div>
</div>

<!-- Vue 中使用 -->
<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <div 
      v-for="item in items" 
      :key="item.id"
      class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
    >
      <h3 class="text-lg font-semibold mb-2">{{ item.title }}</h3>
      <p class="text-gray-600">{{ item.description }}</p>
    </div>
  </div>
</template>`
              }
            ],
            resources: [
              { title: 'Sass 官方文档', url: 'https://sass-lang.com/documentation' },
              { title: 'PostCSS 官网', url: 'https://postcss.org/' },
              { title: 'Tailwind CSS 文档', url: 'https://tailwindcss.com/docs' },
              { title: 'Less 官方文档', url: 'https://lesscss.org/' }
            ]
          },
        ],
      },
      {
        id: 'html-foundation',
        title: 'HTML 基础',
        summary: '语义化、表单、SEO、无障碍访问',
        topics: ['语义化标签', '表单元素与验证', 'Meta 标签', 'SEO 优化', 'Open Graph', 'ARIA 无障碍', 'Web Components', 'Canvas/SVG'],
      },
      {
        id: 'http-network',
        title: 'HTTP 与网络',
        summary: 'HTTP 协议、请求方法、状态码、缓存',
        description: 'HTTP 是互联网的基础协议，用于客户端和服务器之间的数据传输。理解 HTTP 协议的原理、请求响应模型、状态码、缓存机制等对于前端开发至关重要。现代网络开发还涉及 CORS 跨域、HTTPS 安全、WebSocket 实时通信等。掌握这些知识能够帮助开发者构建高效、安全的网络应用。',
        topics: ['HTTP/1.1 vs HTTP/2 vs HTTP/3', '请求方法 (GET/POST/PUT/DELETE)', '状态码', 'Headers 请求头', 'Cookie/Session', 'CORS 跨域', '缓存策略 (强缓存/协商缓存)', 'HTTPS/TLS', 'WebSocket', 'Server-Sent Events'],
        useCases: [
          '构建高效的 API 调用和数据获取',
          '实现跨域资源共享和权限控制',
          '优化页面加载性能和缓存策略',
          '实现实时通信和数据推送',
          '处理网络安全和身份验证'
        ],
        bestPractices: [
          '合理使用 GET/POST/PUT/DELETE，遵循 RESTful 规范',
          '设置合理的 Cache-Control 缓存策略',
          '使用 HTTPS 保护数据传输安全',
          '正确处理 CORS 预检请求',
          '使用 ETag 和 Last-Modified 实现协商缓存',
          '为关键资源设置适当的 HTTP 缓存头'
        ],
        codeExamples: [
          {
            title: '常见 HTTP 状态码',
            code: `/* 2xx 成功 */
200 OK - 请求成功，响应体包含请求的数据
201 Created - 请求成功，并创建了新资源
204 No Content - 请求成功，但无返回内容

/* 3xx 重定向 */
301 Moved Permanently - 永久重定向，必须更新书签
302 Found - 临时重定向，浏览器不更新书签
304 Not Modified - 缓存有效，使用本地缓存副本
307 Temporary Redirect - 临时重定向，保留请求方法
308 Permanent Redirect - 永久重定向，保留请求方法

/* 4xx 客户端错误 */
400 Bad Request - 请求参数有误
401 Unauthorized - 需要身份验证
403 Forbidden - 没有访问权限
404 Not Found - 资源不存在
409 Conflict - 请求冲突（如重复创建）
422 Unprocessable Entity - 数据验证失败

/* 5xx 服务器错误 */
500 Internal Server Error - 服务器内部错误
502 Bad Gateway - 网关错误
503 Service Unavailable - 服务不可用
504 Gateway Timeout - 网关超时`
          },
          {
            title: 'Fetch API 示例',
            code: `/* GET 请求 */
fetch('/api/users')
  .then(response => {
    if (!response.ok) {
      throw new Error(\\\`HTTP error! status: \\\${response.status}\\\`)
    }
    return response.json()
  })
  .then(data => console.log(data))
  .catch(error => console.error('Fetch error:', error))

/* ---*/

/* POST 请求 */
const createUser = async (userData) => {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': \\\`Bearer \\\${token}\\\`
    },
    body: JSON.stringify(userData)
  })
  
  if (!response.ok) {
    throw new Error(\\\`Error: \\\${response.statusText}\\\`)
  }
  
  return response.json()
}

/* ---*/

/* PUT/DELETE 请求 */
const updateUser = (id, data) => {
  return fetch(\\\`/api/users/\\\${id}\\\`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json())
}

const deleteUser = (id) => {
  return fetch(\\\`/api/users/\\\${id}\\\`, { method: 'DELETE' })
    .then(r => {
      if (r.ok) return { success: true }
      throw new Error('删除失败')
    })
}`
          },
          {
            title: 'HTTP Headers 和缓存',
            code: `/* 请求头设置 */
const headers = {
  // 内容类型
  'Content-Type': 'application/json',
  
  // 身份验证
  'Authorization': 'Bearer token123',
  
  // 跨域相关
  'Origin': 'https://example.com',
  
  // 自定义头
  'X-Custom-Header': 'custom-value',
  
  // 用户代理
  'User-Agent': 'Mozilla/5.0...'
}

/* ---*/

/* 响应头与缓存策略 */

// 强缓存：浏览器直接使用本地副本，不发送请求
'Cache-Control: max-age=3600' // 缓存 1 小时
'Cache-Control: public' // 可被任何缓存存储
'Cache-Control: private' // 只能被浏览器缓存
'Cache-Control: no-cache' // 必须重新验证
'Cache-Control: no-store' // 不缓存

'Expires: Wed, 21 Oct 2026 07:28:00 GMT' // 绝对过期时间

// 协商缓存：向服务器验证缓存是否仍有效
'ETag: "123456"' // 资源标识，变化则重新获取
'Last-Modified: Wed, 21 Oct 2026 00:00:00 GMT'

// 请求时检查缓存有效性
'If-None-Match: "123456"' // ETag 不匹配则返回新数据
'If-Modified-Since: Wed, 21 Oct 2026 00:00:00 GMT'`
          },
          {
            title: 'CORS 跨域请求',
            code: `/* 前端发起 CORS 请求 */
const fetchCrossOrigin = async () => {
  try {
    const response = await fetch('https://api.example.com/data', {
      method: 'GET',
      mode: 'cors', // 启用 CORS
      credentials: 'include', // 包含 Cookie
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error('CORS error:', error)
  }
}

/* 后端处理 CORS (Express 示例) */
const express = require('express')
const cors = require('cors')
const app = express()

// 方式 1: 允许所有源（开发用）
app.use(cors())

// 方式 2: 配置特定源
app.use(cors({
  origin: 'https://example.com',
  credentials: true, // 允许发送凭证
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// 方式 3: 手动设置 CORS 头
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://example.com')
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  // 处理预检请求
  if (req.method === 'OPTIONS') {
    res.sendStatus(200)
  } else {
    next()
  }
})`
          },
          {
            title: 'Cookie 和 Session',
            code: `/* 设置和读取 Cookie */

// 设置 Cookie（服务器端）
res.setHeader('Set-Cookie', [
  'sessionId=abc123; Path=/; HttpOnly; Secure; SameSite=Strict',
  'userId=456; Path=/; Max-Age=3600' // 1 小时后过期
])

// ---

// 读取和操作 Cookie（客户端）
// 获取所有 Cookie
const cookies = document.cookie
console.log(cookies) // "sessionId=abc123; userId=456"

// 设置 Cookie
document.cookie = 'theme=dark; path=/; max-age=2592000' // 30 天

// 删除 Cookie
document.cookie = 'theme=; max-age=0'

// Cookie 工具函数
const CookieUtil = {
  get(name) {
    const value = \\\`; \\\${document.cookie}\\\`
    const parts = value.split(\\\`; \\\${name}=\\\`)
    return parts.length === 2 ? parts.pop().split(';').shift() : null
  },
  
  set(name, value, days = 7) {
    const date = new Date()
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
    document.cookie = \\\`\\\${name}=\\\${value}; expires=\\\${date.toUTCString()}; path=/\\\`
  },
  
  remove(name) {
    this.set(name, '', -1)
  }
}

// 使用
CookieUtil.set('token', 'xyz789', 7)
const token = CookieUtil.get('token')
CookieUtil.remove('token')`
          },
          {
            title: 'WebSocket 实时通信',
            code: `/* 客户端 */
class WebSocketClient {
  constructor(url) {
    this.url = url
    this.ws = null
    this.callbacks = {}
  }
  
  connect() {
    this.ws = new WebSocket(this.url)
    
    this.ws.onopen = () => {
      console.log('WebSocket 已连接')
      this.emit('open')
    }
    
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      this.emit('message', data)
    }
    
    this.ws.onerror = (error) => {
      console.error('WebSocket 错误:', error)
      this.emit('error', error)
    }
    
    this.ws.onclose = () => {
      console.log('WebSocket 已关闭')
      this.emit('close')
    }
  }
  
  send(data) {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data))
    }
  }
  
  on(event, callback) {
    if (!this.callbacks[event]) {
      this.callbacks[event] = []
    }
    this.callbacks[event].push(callback)
  }
  
  emit(event, data) {
    if (this.callbacks[event]) {
      this.callbacks[event].forEach(cb => cb(data))
    }
  }
  
  close() {
    if (this.ws) {
      this.ws.close()
    }
  }
}

// 使用示例
const client = new WebSocketClient('ws://localhost:8080')
client.connect()

client.on('open', () => {
  client.send({ type: 'login', userId: 123 })
})

client.on('message', (data) => {
  console.log('收到消息:', data)
})

/* ---*/

/* 服务器端 (Node.js ws 库) */
const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 8080 })

wss.on('connection', (ws) => {
  console.log('客户端已连接')
  
  ws.on('message', (data) => {
    const message = JSON.parse(data)
    console.log('收到:', message)
    
    // 广播给所有客户端
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type: 'broadcast',
          data: message
        }))
      }
    })
  })
  
  ws.on('close', () => {
    console.log('客户端已断开连接')
  })
})`
          },
          {
            title: 'Server-Sent Events (SSE)',
            code: `/* 前端接收 SSE */
const eventSource = new EventSource('/api/events')

// 接收消息
eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data)
  console.log('收到数据:', data)
}

// 接收自定义事件
eventSource.addEventListener('notification', (event) => {
  const notification = JSON.parse(event.data)
  console.log('通知:', notification)
})

// 错误处理
eventSource.onerror = (error) => {
  if (eventSource.readyState === EventSource.CLOSED) {
    console.log('连接已关闭')
  } else {
    console.error('连接错误:', error)
  }
}

// 关闭连接
eventSource.close()

/* ---*/

/* 后端发送 SSE (Express 示例) */
app.get('/api/events', (req, res) => {
  // 设置 SSE 响应头
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  
  // 发送初始连接消息
  res.write('data: {\"message\":\"已连接\"}\\n\\n')
  
  // 模拟定时推送数据
  const interval = setInterval(() => {
    const data = {
      timestamp: new Date().toISOString(),
      value: Math.random()
    }
    
    // 发送带事件类型的数据
    res.write(\\\`event: notification\\n\\\`)
    res.write(\\\`data: \\\${JSON.stringify(data)}\\n\\n\\\`)
  }, 1000)
  
  // 客户端断开连接时清理
  req.on('close', () => {
    clearInterval(interval)
    res.end()
  })
})`
          }
        ],
        resources: [
          { title: 'HTTP 完整指南 - MDN', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP' },
          { title: 'HTTP 状态码详解', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status' },
          { title: 'CORS 跨域资源共享', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS' },
          { title: 'WebSocket API', url: 'https://developer.mozilla.org/en-US/docs/Web/API/WebSocket' },
          { title: 'Server-Sent Events', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events' }
        ]
      },
      {
        id: 'standards',
        title: '代码规范与质量',
        summary: 'ESLint、Prettier、Git 规范、提交校验',
        description: '代码规范和质量保障对于团队协作和项目长期维护至关重要。ESLint 用于检查 JavaScript 代码质量和发现潜在问题，Prettier 自动格式化代码，保持一致风格。Git 工作流和 Conventional Commits 规范化提交历史，husky 和 commitlint 在提交时进行自动检查。这些工具结合使用可以有效提高代码质量，减少 bug，改善团队开发效率。',
        topics: ['ESLint 配置', 'Prettier 格式化', 'Stylelint', 'Git 工作流', 'Conventional Commits', 'husky', 'lint-staged', 'commitlint', 'EditorConfig'],
        useCases: [
          '团队项目的代码风格统一',
          '自动检查代码质量和错误',
          '在提交前检查代码规范',
          '自动格式化代码减少冲突',
          '标准化 Git 提交记录便于追踪',
          '构建自动化 CI/CD 流程'
        ],
        bestPractices: [
          '使用 ESLint 和 Prettier 搭配，质量检查 + 自动格式化',
          '配置 EditorConfig 统一编辑器设置',
          '使用 husky + lint-staged 在提交前自动检查',
          '遵循 Conventional Commits 规范便于自动化发布',
          '在 CI/CD 流程中集成代码质量检查',
          '定期审查和更新代码规范规则'
        ],
        codeExamples: [
          {
            title: '.eslintrc.js 配置',
            code: `module.exports = {
  // 运行环境
  env: {
    browser: true,
    es2021: true,
    node: true,
  },

  // 扩展预设
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier' // Prettier 集成，禁用冲突的格式化规则
  ],

  // 解析器配置
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 'latest',
    sourceType: 'module'
  },

  // 插件
  plugins: ['vue', '@typescript-eslint', 'prettier'],

  // 规则配置
  rules: {
    // JavaScript 规则
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-unused-vars': 'warn',
    
    // Vue 规则
    'vue/multi-word-component-names': 'off',
    'vue/no-v-model-on-window': 'warn',
    
    // TypeScript 规则
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
    
    // Prettier 规则
    'prettier/prettier': 'warn'
  }
}`
          },
          {
            title: '.prettierrc 格式化配置',
            code: `{
  // 行宽
  "printWidth": 100,

  // 制表符宽度
  "tabWidth": 2,

  // 使用制表符还是空格
  "useTabs": false,

  // 语句末尾是否加分号
  "semi": true,

  // 是否使用单引号
  "singleQuote": true,

  // 对象属性引号方式
  "quoteProps": "as-needed",

  // 多行对象最后一个属性是否加逗号
  "trailingComma": "es5",

  // 对象括号前后空格
  "bracketSpacing": true,

  // 箭头函数单个参数是否需要括号
  "arrowParens": "always",

  // HTML 文件换行方式
  "htmlWhitespaceSensitivity": "css",

  // 换行符
  "endOfLine": "lf"
}`
          },
          {
            title: 'Conventional Commits 规范',
            code: `/* 提交消息格式：<type>(<scope>): <subject> */

/* 标准提交消息 */
feat(user-auth): add login functionality
"^      ^          ^
 |      |          +--- 简短描述，不超过 50 字符
 |      +--- 影响范围（可选）
 +--- 提交类型

feat(user-auth): add login functionality

- Implement JWT authentication
- Add login and logout endpoints
- Add password hashing with bcrypt

Closes #123
"^                 ^
 |                 +--- 关闭相关 Issue
 +--- 提交详细说明（可选）

/* 常见类型 */
feat:     新功能
fix:      bug 修复
docs:     文档
style:    代码风格（不影响代码含义）
refactor: 重构
perf:     性能优化
test:     添加或修改测试
chore:    构建工具、依赖等变更
ci:       CI/CD 配置

/* 示例 */
feat(api): add user profile endpoint
fix(auth): resolve token expiration issue
docs(readme): update installation instructions
refactor(utils): simplify date formatting logic
test(user): add unit tests for validation
chore(deps): upgrade vue to 3.3.0`
          },
          {
            title: 'husky + lint-staged 配置',
            code: `/* package.json */
{
  "scripts": {
    "prepare": "husky install",
    "lint": "eslint src --ext .ts,.js,.vue",
    "format": "prettier --write src",
    "lint:fix": "eslint src --ext .ts,.js,.vue --fix"
  },
  "devDependencies": {
    "husky": "^8.0.0",
    "lint-staged": "^13.0.0"
  }
}

// ---

/* .husky/pre-commit 钩子 */
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx lint-staged

// ---

/* .lintstagedrc.json */
{
  "*.{js,ts,vue}": ["eslint --fix", "prettier --write"],
  "*.css": ["stylelint --fix", "prettier --write"],
  "*.md": ["prettier --write"]
}

// ---

/* .husky/commit-msg 钩子 */
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx commitlint --edit "$1"`
          },
          {
            title: 'commitlint 配置',
            code: `/* commitlint.config.js */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  
  rules: {
    // type 必须是指定值之一
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'chore',
        'ci',
        'revert'
      ]
    ],
    
    // type 不能为空
    'type-empty': [2, 'never'],
    
    // type 必须小写
    'type-case': [2, 'always', 'lowercase'],
    
    // subject 不能为空
    'subject-empty': [2, 'never'],
    
    // subject 必须以大写字母或数字开头
    'subject-case': [2, 'never', ['start-case', 'pascal-case']],
    
    // subject 不能以句号结尾
    'subject-full-stop': [2, 'never', '.'],
    
    // body 的每行不超过 100 字符
    'body-leading-blank': [2, 'always'],
    
    // footer 前必须有空行
    'footer-leading-blank': [2, 'always']
  }
}

/* 验证提交消息 */
// 这会自动在提交时验证消息格式
// ✅ 正确: feat(user): add login
// ❌ 错误: Feat(user): add login (type 大写)
// ❌ 错误: feat(user): add login. (subject 结尾有句号)
// ❌ 错误: fix: (subject 为空)`
          },
          {
            title: '.editorconfig 编辑器配置',
            code: `# EditorConfig helps maintain consistent coding styles
root = true

# 所有文件
[*]
charset = utf-8
insert_final_newline = true
trim_trailing_whitespace = true
end_of_line = lf

# JavaScript/TypeScript/Vue
[*.{js,ts,jsx,tsx,vue}]
indent_style = space
indent_size = 2
max_line_length = 100

# JSON
[*.json]
indent_style = space
indent_size = 2

# CSS/SCSS/Less
[*.{css,scss,less}]
indent_style = space
indent_size = 2

# HTML
[*.html]
indent_style = space
indent_size = 2

# Markdown
[*.md]
trim_trailing_whitespace = false
insert_final_newline = false

# YAML
[*.{yml,yaml}]
indent_style = space
indent_size = 2`
          },
          {
            title: 'Git 工作流规范',
            code: `/* 主要分支 */
main/master    # 生产分支，严格受保护
develop        # 开发分支

/* 功能分支 */
feature/*      # 新功能分支
bugfix/*       # bug 修复分支
hotfix/*       # 紧急修复分支
refactor/*     # 重构分支
docs/*         # 文档分支

/* 标准工作流程 */

// 1. 创建功能分支
git checkout develop
git pull origin develop
git checkout -b feature/user-authentication

// 2. 开发并提交
git add .
git commit -m "feat(auth): implement JWT authentication"

// 3. 定期从 develop 同步最新代码
git fetch origin
git rebase origin/develop

// 4. 推送到远程
git push origin feature/user-authentication

// 5. 创建 Pull Request 请求代码审查

// 6. PR 通过后合并到 develop
git checkout develop
git pull origin develop
git merge --no-ff feature/user-authentication
git push origin develop

// 7. 删除功能分支
git branch -d feature/user-authentication
git push origin --delete feature/user-authentication

/* 提交历史规范 */
// ✅ 好的提交
feat(auth): add JWT token refresh mechanism
fix(login): resolve CORS error on auth endpoint
docs(readme): update installation guide

// ❌ 不规范的提交
Updated code
fixed stuff
WIP
...`
          },
          {
            title: 'CI/CD 集成示例 (GitHub Actions)',
            code: `# .github/workflows/lint-and-test.yml
name: Lint and Test

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm install
      
      - name: Run ESLint
        run: npm run lint
      
      - name: Check formatting with Prettier
        run: npx prettier --check src
      
      - name: Run tests
        run: npm run test

  build:
    runs-on: ubuntu-latest
    needs: lint
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build
        run: npm run build
      
      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        with:
          name: dist
          path: dist/`
          }
        ],
        resources: [
          { title: 'ESLint 官方文档', url: 'https://eslint.org/docs/latest/' },
          { title: 'Prettier 官方文档', url: 'https://prettier.io/docs/' },
          { title: 'Conventional Commits 规范', url: 'https://www.conventionalcommits.org/' },
          { title: 'husky 文档', url: 'https://typicode.github.io/husky/' },
          { title: 'commitlint 文档', url: 'https://commitlint.js.org/' },
          { title: 'EditorConfig 官网', url: 'https://editorconfig.org/' }
        ]
      },
    ],
  },
  {
    id: 'ui-libraries',
    title: 'UI 组件库',
    summary: 'PC 端、移动端、跨端组件库与设计系统',
    tags: ['ui', 'pc', 'mobile'],
    children: [
      {
        id: 'pc-ui',
        title: 'PC 端组件库',
        summary: 'Element Plus、Ant Design Vue、Naive UI、Arco Design',
        topics: ['Element Plus 使用', 'Ant Design Vue', 'Naive UI', 'Arco Design', 'PrimeVue', 'Quasar', 'Vuetify', '主题定制', '按需引入', '国际化'],
        children: [
          {
            id: 'element-plus',
            title: 'Element Plus',
            summary: '饿了么团队出品的 Vue3 组件库',
            description: 'Element Plus 是基于 Vue 3 的企业级 UI 组件库，提供了丰富的组件和完善的文档。它支持按需导入、主题定制、国际化，并且对 TypeScript 支持友好。适用于中后台管理系统、企业应用等场景。',
            topics: ['安装与配置', '按需导入', '主题配置', '表单验证', '表格与分页', 'Dialog/Drawer', '国际化 i18n', 'TypeScript 支持'],
            useCases: [
              '企业中后台管理系统',
              '数据密集型应用',
              '内部管理工具',
              '需要快速搭建的 B 端项目'
            ],
            bestPractices: [
              '使用 unplugin-vue-components 实现自动导入',
              '通过 CSS 变量定制主题',
              '封装业务组件提升复用性',
              '表单验证使用 async-validator',
              '表格分页使用后端分页方式'
            ],
            resources: [
              { title: 'Element Plus 官方文档', url: 'https://element-plus.org/zh-CN/' },
              { title: 'Element Plus Icons' }
            ]
          },
          {
            id: 'ant-design-vue',
            title: 'Ant Design Vue',
            summary: 'Ant Design 的 Vue 实现',
            description: 'Ant Design Vue 是 Ant Design 设计体系的 Vue 实现，提供了一套企业级 UI 设计语言和 Vue 组件库。组件丰富、功能强大，适用于中后台产品。',
            topics: ['安装与使用', '按需加载', '主题定制', 'Form 表单', 'Table 组件', 'Modal 弹窗', '配置式路由菜单', 'Pro Components'],
            useCases: [
              '企业级中后台管理系统',
              'B 端产品快速开发',
              '数据可视化平台',
              '复杂表单和表格应用'
            ],
            bestPractices: [
              '使用 unplugin-vue-components 自动导入',
              '通过 ConfigProvider 全局配置',
              '复杂表单使用 Form.useForm',
              '表格数据分页使用服务端分页'
            ],
            resources: [
              { title: 'Ant Design Vue 官网', url: 'https://antdv.com/components/overview-cn' },
              { title: 'Ant Design Vue Pro' }
            ]
          },
          {
            id: 'naive-ui',
            title: 'Naive UI',
            summary: '图森未来开源的 Vue3 组件库',
            description: 'Naive UI 是一个 Vue 3 组件库，比较完整，主题可调，使用 TypeScript，不算太慢。它提供了 90+ 个组件，全部使用 TypeScript 编写，提供完整的类型提示。',
            topics: ['组件使用', '主题编辑器', 'TypeScript 友好', '暗黑模式', 'ConfigProvider', '按需引入'],
            useCases: [
              'TypeScript 项目优先选择',
              '需要深度主题定制',
              '中后台管理系统',
              '暗黑模式应用'
            ],
            bestPractices: [
              '使用 ConfigProvider 进行全局配置',
              '利用主题编辑器定制主题',
              '充分利用 TypeScript 类型提示'
            ],
            resources: [
              { title: 'Naive UI 官网', url: 'https://www.naiveui.com/zh-CN/' },
              { title: 'Naive UI Admin 模板' }
            ]
          },
        ],
      },
      {
        id: 'mobile-ui',
        title: '移动端组件库',
        summary: 'Vant、NutUI、Varlet、VueUse',
        topics: ['Vant 4', 'NutUI', 'Varlet', 'Vux', 'Cube UI', 'Mint UI', '触摸手势', '移动端适配', 'Viewport 配置'],
        children: [
          {
            id: 'vant',
            title: 'Vant',
            summary: '有赞团队移动端组件库',
            description: 'Vant 是有赞前端团队开源的移动端 Vue 组件库，Vant 4 支持 Vue 3。提供 70+ 个高质量组件，全面覆盖移动端各类场景。支持按需引入、主题定制、国际化，并且提供了完善的 TypeScript 类型定义。',
            topics: ['Vant 4 安装', '按需引入', 'Rem 适配', '主题定制', 'Form 表单', 'List 列表', 'Popup/Dialog', 'Toast/Notify', 'TypeScript 支持'],
            useCases: [
              '移动端 H5 页面',
              '微信公众号/小程序商城',
              '移动端 WebApp',
              '响应式移动页面'
            ],
            bestPractices: [
              '使用 vant/lib 按需导入组件',
              '配置 postcss-pxtorem 自动转换 rem',
              '使用 ConfigProvider 全局配置主题',
              '长列表使用 List 组件实现虚拟滚动',
              'Toast 等全局组件封装后统一调用'
            ],
            resources: [
              { title: 'Vant 4 官方文档', url: 'https://vant-ui.github.io/vant/' },
              { title: 'Vant Demo 集合' }
            ]
          },
          {
            id: 'nutui',
            title: 'NutUI',
            summary: '京东风格的移动端组件库',
            topics: ['安装配置', '主题定制', '组件使用', '国际化', 'Taro 集成', '小程序支持'],
          },
          {
            id: 'varlet',
            title: 'Varlet',
            summary: 'Material 风格 Vue3 移动组件库',
            topics: ['组件库使用', 'Material Design', '暗黑模式', '国际化', 'CLI 工具'],
          },
        ],
      },
      {
        id: 'design-system',
        title: '设计系统',
        summary: '设计规范、Design Token、主题系统',
        description: '设计系统是一套完整的规范和组件库，确保产品在各个环节的一致性和可用性。通过 Design Token 定义设计的基本元素（颜色、字体、间距等），可以实现多主题、多平台的统一管理。良好的设计系统能够提升开发效率、保证用户体验的一致性，并便于协作和扩展。',
        topics: ['Design Token', '色彩系统', '字体系统', '间距规范', '组件规范', '主题切换', '暗黑模式', '多主题方案', '可访问性 (a11y)', 'Figma/Sketch 协同'],
        useCases: [
          '构建企业级设计系统',
          '多主题和多品牌支持',
          '跨团队的设计和开发协同',
          '快速原型和组件库构建',
          '保证设计与开发的一致性',
          '实现暗黑模式和自定义主题'
        ],
        bestPractices: [
          '使用 Design Token 集中管理设计值',
          '建立清晰的色彩、字体、间距等设计规范',
          '提供多个主题预设，支持用户自定义',
          '实现完整的可访问性 (a11y) 支持',
          '与设计工具（Figma/Sketch）紧密协作',
          '编写详细的文档和示例，便于团队使用'
        ],
        codeExamples: [
          {
            title: 'Design Token 定义',
            code: `/* tokens/colors.ts */
export const colors = {
  // 基础颜色
  primary: '#007bff',
  secondary: '#6c757d',
  success: '#28a745',
  danger: '#dc3545',
  warning: '#ffc107',
  info: '#17a2b8',
  light: '#f8f9fa',
  dark: '#343a40',

  // 扩展颜色
  primaryLight: '#e7f1ff',
  primaryDark: '#0056b3',

  // 文本颜色
  text: {
    primary: '#333333',
    secondary: '#666666',
    tertiary: '#999999',
    disabled: '#cccccc'
  },

  // 背景颜色
  background: {
    primary: '#ffffff',
    secondary: '#f5f5f5',
    tertiary: '#eeeeee'
  },

  // 边框颜色
  border: {
    light: '#e5e5e5',
    normal: '#d0d0d0',
    dark: '#999999'
  }
}

/* tokens/typography.ts */
export const typography = {
  // 字体族
  fontFamily: {
    sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: '"Courier New", Courier, monospace',
    serif: 'Georgia, serif'
  },

  // 字体大小
  fontSize: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '32px'
  },

  // 行高
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2
  },

  // 字重
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700
  }
}

/* tokens/spacing.ts */
export const spacing = {
  '0': '0',
  '1': '4px',
  '2': '8px',
  '3': '12px',
  '4': '16px',
  '5': '20px',
  '6': '24px',
  '8': '32px',
  '10': '40px',
  '12': '48px',
  '16': '64px'
}

/* tokens/index.ts - 汇总导出 */
export { colors } from './colors'
export { typography } from './typography'
export { spacing } from './spacing'`
          },
          {
            title: 'CSS 变量实现主题',
            code: `/* styles/theme.css */

/* 浅色主题（默认） */
:root {
  --color-primary: #007bff;
  --color-secondary: #6c757d;
  --color-success: #28a745;
  --color-danger: #dc3545;

  --color-text-primary: #333333;
  --color-text-secondary: #666666;
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f5f5f5;
  --color-border: #e5e5e5;

  --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-size-base: 16px;
  --font-size-lg: 18px;
  --line-height-normal: 1.5;

  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;

  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;

  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.15);
}

/* 暗黑主题 */
@media (prefers-color-scheme: dark) {
  :root {
    --color-text-primary: #ffffff;
    --color-text-secondary: #cccccc;
    --color-bg-primary: #1a1a1a;
    --color-bg-secondary: #2a2a2a;
    --color-border: #333333;
  }
}

/* 或使用类切换 */
html.dark-mode {
  --color-text-primary: #ffffff;
  --color-text-secondary: #cccccc;
  --color-bg-primary: #1a1a1a;
  --color-bg-secondary: #2a2a2a;
  --color-border: #333333;
}

/* 使用变量 */
body {
  color: var(--color-text-primary);
  background: var(--color-bg-primary);
  font-family: var(--font-sans);
  font-size: var(--font-size-base);
  line-height: var(--line-height-normal);
}

.button {
  background: var(--color-primary);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-sm);
}`
          },
          {
            title: '主题切换实现',
            code: `/* composables/useTheme.ts */
import { ref, computed, watchEffect } from 'vue'

type Theme = 'light' | 'dark'

export function useTheme() {
  const theme = ref<Theme>('light')

  // 从 localStorage 恢复主题
  const savedTheme = localStorage.getItem('theme') as Theme | null
  if (savedTheme) {
    theme.value = savedTheme
  }

  // 应用主题
  const applyTheme = (newTheme: Theme) => {
    theme.value = newTheme
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark-mode')
    } else {
      document.documentElement.classList.remove('dark-mode')
    }
    
    // 保存到 localStorage
    localStorage.setItem('theme', newTheme)
  }

  // 切换主题
  const toggleTheme = () => {
    applyTheme(theme.value === 'light' ? 'dark' : 'light')
  }

  // 返回当前主题对应的颜色
  const isDark = computed(() => theme.value === 'dark')

  return {
    theme,
    isDark,
    applyTheme,
    toggleTheme
  }
}

/* 在组件中使用 */
<script setup>
import { useTheme } from '@/composables/useTheme'

const { theme, isDark, toggleTheme } = useTheme()
</script>

<template>
  <div>
    <p>当前主题: {{ theme }}</p>
    <button @click="toggleTheme">
      {{ isDark ? '☀️ 浅色模式' : '🌙 暗黑模式' }}
    </button>
  </div>
</template>`
          },
          {
            title: '组件规范文档',
            code: `/* 组件规范模板 */

/**
 * Button 组件规范
 * 
 * 用途: 用户交互的主要元素，提供各种样式和大小选项
 * 
 * 变体:
 * - variant: 'primary' | 'secondary' | 'success' | 'danger' | 'warning'
 * - size: 'small' | 'medium' | 'large'
 * - disabled: boolean
 * 
 * 示例用法:
 * <Button variant="primary" size="large" @click="handleClick">
 *   点击我
 * </Button>
 * 
 * 可访问性:
 * - 支持键盘导航 (Enter/Space)
 * - 支持屏幕阅读器
 * - 提供清晰的 focus 状态
 * 
 * 规范:
 * - 按钮文案应该清晰简洁，动词开头
 * - 危险操作（删除、清空）使用 'danger' 变体
 * - 禁用状态应该明显可见
 * - 加载状态下显示加载指示器
 */

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  loading?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: 'primary',
  size: 'medium',
  disabled: false,
  loading: false,
  type: 'button'
})`
          },
          {
            title: 'SCSS 设计系统工具库',
            code: `/* styles/_tokens.scss */
$colors: (
  'primary': #007bff,
  'secondary': #6c757d,
  'success': #28a745,
  'danger': #dc3545,
  'warning': #ffc107,
  'info': #17a2b8,
);

$font-sizes: (
  'xs': 12px,
  'sm': 14px,
  'base': 16px,
  'lg': 18px,
  'xl': 20px,
  '2xl': 24px,
);

$spacing: (
  'xs': 4px,
  'sm': 8px,
  'md': 16px,
  'lg': 24px,
  'xl': 32px,
);

$shadows: (
  'sm': 0 1px 2px rgba(0, 0, 0, 0.05),
  'md': 0 4px 6px rgba(0, 0, 0, 0.1),
  'lg': 0 10px 25px rgba(0, 0, 0, 0.15),
);

/* styles/_mixins.scss */
@mixin color($key) {
  color: map-get($colors, $key);
}

@mixin bg-color($key) {
  background-color: map-get($colors, $key);
}

@mixin font-size($key) {
  font-size: map-get($font-sizes, $key);
}

@mixin spacing($key) {
  @if length($key) == 1 {
    margin: map-get($spacing, $key);
  } @else if length($key) == 2 {
    margin: map-get($spacing, nth($key, 1)) map-get($spacing, nth($key, 2));
  }
}

@mixin button-variant($color-key) {
  @include bg-color($color-key);
  
  &:hover {
    opacity: 0.9;
  }
  
  &:active {
    opacity: 0.8;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

@mixin shadow($key) {
  box-shadow: map-get($shadows, $key);
}

/* 使用示例 */
.button {
  @include font-size('base');
  @include spacing('md');
  @include button-variant('primary');
  @include shadow('md');
  
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}`
          },
          {
            title: '暗黑模式和多主题',
            code: `/* types/theme.ts */
export type ThemeType = 'light' | 'dark'

export type BrandColor = 'blue' | 'green' | 'purple' | 'red'

export interface Theme {
  mode: ThemeType
  brand: BrandColor
  colors: {
    primary: string
    secondary: string
    background: string
    text: string
    border: string
  }
}

/* themes.ts */
export const lightTheme: Record<BrandColor, Theme> = {
  blue: {
    mode: 'light',
    brand: 'blue',
    colors: {
      primary: '#007bff',
      secondary: '#6c757d',
      background: '#ffffff',
      text: '#333333',
      border: '#e5e5e5'
    }
  },
  green: {
    mode: 'light',
    brand: 'green',
    colors: {
      primary: '#28a745',
      secondary: '#6c757d',
      background: '#ffffff',
      text: '#333333',
      border: '#e5e5e5'
    }
  }
}

export const darkTheme: Record<BrandColor, Theme> = {
  blue: {
    mode: 'dark',
    brand: 'blue',
    colors: {
      primary: '#0d6efd',
      secondary: '#6c757d',
      background: '#1a1a1a',
      text: '#ffffff',
      border: '#333333'
    }
  },
  green: {
    mode: 'dark',
    brand: 'green',
    colors: {
      primary: '#198754',
      secondary: '#6c757d',
      background: '#1a1a1a',
      text: '#ffffff',
      border: '#333333'
    }
  }
}

/* composables/useDesignSystem.ts */
export function useDesignSystem() {
  const mode = ref<ThemeType>('light')
  const brand = ref<BrandColor>('blue')

  const theme = computed(() => {
    return mode.value === 'light' 
      ? lightTheme[brand.value]
      : darkTheme[brand.value]
  })

  const setTheme = (newMode: ThemeType, newBrand: BrandColor) => {
    mode.value = newMode
    brand.value = newBrand
    
    // 应用 CSS 变量
    Object.entries(theme.value.colors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(\\\`--color-\\\${key}\\\`, value)
    })
  }

  return { mode, brand, theme, setTheme }
}`
          },
          {
            title: '可访问性 (a11y) 规范',
            code: `/* 颜色对比度规范 */
// WCAG 2.0 AA 标准要求:
// - 大型文本（18pt+）: 最少 3:1 对比度
// - 普通文本: 最少 4.5:1 对比度
// - 图形元素: 最少 3:1 对比度

// 示例
.text-primary {
  color: #000000; /* 对比度 21:1 */
  background: #ffffff;
}

.text-secondary {
  color: #666666; /* 对比度 7:1 */
  background: #ffffff;
}

/* 焦点管理 */
button:focus-visible {
  outline: 2px solid #007bff;
  outline-offset: 2px;
}

input:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
}

/* 禁用状态的清晰指示 */
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 减少动画 */
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}

/* 图像替代文本 */
img {
  alt: "描述图像内容"; /* 必须提供有意义的替代文本 */
}

/* 按钮无障碍最佳实践 */
.button {
  /* 保证最小点击区域（44x44px） */
  min-width: 44px;
  min-height: 44px;
  
  /* 清晰的文本标签 */
  font-weight: 500;
  
  /* 支持键盘导航 */
  &:focus-visible {
    outline: 2px solid currentColor;
  }
}`
          }
        ],
        resources: [
          { title: 'Design Token 最佳实践', url: 'https://www.designtokens.org/' },
          { title: 'Figma Design System 指南', url: 'https://www.figma.com/' },
          { title: 'WCAG 可访问性指南', url: 'https://www.w3.org/WAI/WCAG21/quickref/' },
          { title: '暗黑模式 CSS 指南', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme' },
          { title: 'Material Design 系统', url: 'https://m3.material.io/' }
        ]
      },
      {
        id: 'icons',
        title: '图标库',
        summary: 'Icon 图标库选型与使用',
        topics: ['@element-plus/icons-vue', '@vicons (Naive UI)', 'unplugin-icons', 'iconify', 'Font Awesome', 'Iconfont', 'SVG Sprite', '自定义图标组件'],
      },
    ],
  },
  {
    id: 'cross-platform',
    title: '跨端方案',
    summary: 'Electron、Tauri、uni-app、Taro 跨平台开发',
    tags: ['cross-platform'],
    children: [
      {
        id: 'electron',
        title: 'Electron 桌面应用',
        summary: '基于 Web 技术的跨平台桌面应用',
        description: 'Electron 是由 GitHub 开发的一个开源框架，允许使用 HTML、CSS 和 JavaScript 构建跨平台的桌面应用。它结合了 Chromium 和 Node.js，让前端开发者能够开发原生桌面应用。著名的应用如 VS Code、Slack、Discord 都是用 Electron 构建的。',
        topics: ['Electron 架构', '主进程与渲染进程', 'IPC 通信', 'Electron Builder', '自动更新', '原生菜单', '系统托盘', '打包与分发', 'Electron Vite'],
        useCases: [
          '跨平台桌面应用开发',
          '企业内部工具',
          '代码编辑器/IDE',
          '客户端软件'
        ],
        bestPractices: [
          '主进程和渲染进程分离',
          '使用 contextBridge 安全暴露 API',
          '开启 webSecurity 防止安全问题',
          '使用 electron-builder 打包',
          '集成自动更新功能'
        ],
        codeExamples: [
          {
            title: '主进程 main.js',
            code: `const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  // 开发环境加载本地
  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:5173')
  } else {
    win.loadFile('dist/index.html')
  }
}

app.whenReady().then(createWindow)`
          },
          {
            title: 'IPC 通信',
            code: `// preload.js
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  sendMessage: (msg) => ipcRenderer.send('message', msg),
  onReply: (callback) => ipcRenderer.on('reply', callback)
})

// 渲染进程
window.electronAPI.sendMessage('Hello')
window.electronAPI.onReply((event, data) => {
  console.log(data)
})`
          }
        ],
        resources: [
          { title: 'Electron 官网', url: 'https://www.electronjs.org/' },
          { title: 'Electron Builder', url: 'https://www.electron.build/' },
          { title: 'Electron Vite', url: 'https://electron-vite.org/' }
        ]
      },
      {
        id: 'tauri',
        title: 'Tauri 桌面应用',
        summary: '使用 Rust 的轻量级桌面应用框架',
        topics: ['Tauri 架构', 'Rust 后端', 'JavaScript API', '窗口管理', '系统权限', '打包优化', '应用签名', '更新机制'],
      },
      {
        id: 'uni-app',
        title: 'uni-app 跨端框架',
        summary: '一套代码，多端运行（小程序、H5、App）',
        description: 'uni-app 是使用 Vue.js 开发所有前端应用的框架，开发者编写一套代码，可发布到 iOS、Android、Web（响应式）、以及各种小程序（微信/支付宝/百度/头条/QQ/钉钉/淘宝）、快应用等多个平台。',
        topics: ['uni-app 项目结构', 'pages.json 配置', 'uni API', '条件编译', 'nvue 原生渲染', 'HBuilderX', 'uniCloud', '多端适配', 'App 打包'],
        useCases: [
          '需要同时支持小程序和 H5',
          '快速构建跨平台应用',
          '人力成本有限的中小团队',
          '移动App + 小程序一体化项目'
        ],
        bestPractices: [
          '使用条件编译处理平台差异',
          '小程序分包优化包体积',
          'App 端使用 nvue 提升性能',
          '封装统一的 API 调用层'
        ],
        codeExamples: [
          {
            title: 'pages.json 配置',
            code: `{
  "pages": [
    {
      "path": "pages/index/index",
      "style": {
        "navigationBarTitleText": "首页"
      }
    }
  ],
  "globalStyle": {
    "navigationBarTextStyle": "black",
    "navigationBarBackgroundColor": "#F8F8F8",
    "backgroundColor": "#F8F8F8"
  },
  "tabBar": {
    "list": [
      {
        "pagePath": "pages/index/index",
        "text": "首页"
      }
    ]
  }
}`
          },
          {
            title: '条件编译',
            code: `<template>
  <view>
    <!-- #ifdef MP-WEIXIN -->
    <view>微信小程序专用</view>
    <!-- #endif -->
    
    <!-- #ifdef H5 -->
    <view>H5 专用</view>
    <!-- #endif -->
    
    <!-- #ifndef MP -->
    <view>除小程序外都显示</view>
    <!-- #endif -->
  </view>
</template>

<script>
// #ifdef MP-WEIXIN
import wechatSDK from '@/utils/wechat'
// #endif
</script>`
          }
        ],
        resources: [
          { title: 'uni-app 官网', url: 'https://uniapp.dcloud.net.cn/' },
          { title: 'HBuilderX 下载', url: 'https://www.dcloud.io/hbuilderx.html' }
        ],
        children: [
          {
            id: 'uni-app-mp',
            title: 'uni-app 小程序',
            summary: '微信、支付宝、抖音等小程序开发',
            topics: ['微信小程序', '支付宝小程序', '抖音小程序', '快手小程序', '小程序分包', '性能优化', '原生插件'],
          },
          {
            id: 'uni-app-h5',
            title: 'uni-app H5',
            summary: '发布为 Web H5 应用',
            topics: ['H5 路由模式', 'Vite 构建', '移动端适配', 'PWA 支持'],
          },
          {
            id: 'uni-app-native',
            title: 'uni-app App',
            summary: '打包为 Android/iOS 原生应用',
            topics: ['云打包', '离线打包', 'nvue 页面', '原生插件开发', 'App 权限配置'],
          },
        ],
      },
      {
        id: 'taro',
        title: 'Taro 多端框架',
        summary: '京东凹凸实验室跨端解决方案',
        topics: ['Taro 3 React/Vue', 'Taro 配置', '小程序开发', 'H5 适配', 'RN 支持', '跨端组件库', 'Taro UI', 'NutUI Taro'],
      },
      {
        id: 'capacitor',
        title: 'Capacitor',
        summary: 'Ionic 团队的跨平台运行时',
        topics: ['Capacitor 架构', '插件系统', 'iOS/Android 开发', '原生 API 调用', 'PWA 支持', 'Live Reload'],
      },
      {
        id: 'quasar',
        title: 'Quasar Framework',
        summary: '全平台统一开发框架',
        topics: ['Quasar CLI', 'SPA/PWA/SSR', 'Mobile App', 'Desktop App', 'Browser Extension', 'Quasar 组件库'],
      },
    ],
  },
  {
    id: 'mini-program',
    title: '小程序开发',
    summary: '微信、支付宝、抖音等各平台小程序原生开发',
    tags: [],
    children: [
      {
        id: 'wechat-mp',
        title: '微信小程序',
        summary: '微信原生小程序开发',
        topics: ['小程序框架', 'WXML/WXSS/WXS', 'App/Page 生命周期', '组件系统', 'API 调用', '分包加载', '自定义组件', '云开发', '性能优化', '审核与发布'],
        description: '微信小程序是一种不需要下载安装即可使用的应用，它实现了应用"触手可及"的梦想，用户扫一扫或搜一下即可打开应用。使用微信提供的原生框架开发小程序，具有性能优异、生态完善等特点。',
        useCases: [
          '开发营销推广工具',
          '电商购物应用',
          '生活服务应用',
          '企业信息系统',
          '游戏和娱乐应用'
        ],
        bestPractices: [
          '合理使用分包加载减小初始包体积',
          '定期清理事件监听避免内存泄漏',
          '使用 wx.request 时做好错误处理和超时控制',
          '利用云开发快速搭建后端服务',
          '性能监控和优化应该贯穿开发全程'
        ],
        codeExamples: [
          {
            title: 'app.json 配置',
            language: 'json',
            code: `{
  "pages": [
    "pages/index/index",
    "pages/logs/logs"
  ],
  "window": {
    "backgroundTextStyle": "light",
    "navigationBarBackgroundColor": "#fff",
    "navigationBarTitleText": "WeChat",
    "navigationBarTextStyle": "black"
  },
  "style": "v2",
  "sitemapLocation": "sitemap.json",
  "lazyCodeLoading": "requiredComponents"
}`
          },
          {
            title: 'Page 页面生命周期',
            language: 'javascript',
            code: `Page({
  data: {
    text: "This is page data."
  },
  
  onLoad(options) {
    // 页面加载
    console.log(options)
  },
  
  onShow() {
    // 页面显示
  },
  
  onReady() {
    // 页面初次渲染完成
  },
  
  onHide() {
    // 页面隐藏
  },
  
  onUnload() {
    // 页面卸载
  },
  
  // 页面事件处理函数
  onPullDownRefresh() {
    // 下拉刷新
  },
  
  onReachBottom() {
    // 上拉触底
  }
})`
          },
          {
            title: 'WXML 基础语法',
            language: 'xml',
            code: `<!-- 数据绑定 -->
<view>{{ message }}</view>

<!-- 列表渲染 -->
<view wx:for="{{items}}" wx:key="id">
  {{item.name}}
</view>

<!-- 条件渲染 -->
<view wx:if="{{view == 'WEBVIEW'}}">
  WEBVIEW
</view>
<view wx:elif="{{view == 'APP'}}">
  APP
</view>
<view wx:else>
  OTHER
</view>

<!-- 事件绑定 -->
<button bindtap="handleTap">点击</button>

<!-- 模板使用 -->
<template name="msgitem">
  <view>
    <text>{{index}}: {{msg}}</text>
  </view>
</template>
<template is="msgitem" data="{{index: 0, msg: item}}"/>`
          },
          {
            title: 'API 请求示例',
            language: 'javascript',
            code: `// 发送请求
wx.request({
  url: 'https://example.com/api/data',
  method: 'GET',
  data: {
    id: 1
  },
  header: {
    'content-type': 'application/json'
  },
  success(res) {
    console.log(res.data)
  },
  fail(err) {
    console.error(err)
  },
  complete() {
    // 请求完成
  }
})

// 获取用户信息
wx.getUserProfile({
  desc: '获取您的昵称、头像、地区及性别信息',
  success(res) {
    console.log(res.userInfo)
  }
})`
          },
          {
            title: '自定义组件',
            language: 'javascript',
            code: `// component.js - 自定义组件定义
Component({
  properties: {
    myProperty: {
      type: String,
      value: 'default value',
      observer(newVal, oldVal) {
        console.log(newVal, oldVal)
      }
    }
  },
  data: {
    someData: {}
  },
  methods: {
    customMethod() {
      this.triggerEvent('eventname', {})
    }
  },
  lifetimes: {
    created() {
      // 组件实例创建
    },
    attached() {
      // 组件实例进入页面节点树
    },
    ready() {
      // 组件布局完成
    },
    detached() {
      // 组件实例被移除
    }
  }
})`
          },
          {
            title: '分包加载',
            language: 'json',
            code: `{
  "pages": [
    "pages/index",
    "pages/logs"
  ],
  "subpackages": [
    {
      "root": "packageA",
      "name": "pack1",
      "pages": [
        "pages/cat",
        "pages/dog"
      ]
    },
    {
      "root": "packageB",
      "pages": [
        "pages/apple",
        "pages/banana"
      ]
    }
  ],
  "preloadRule": {
    "pages/index": {
      "network": "all",
      "packages": ["pack1"]
    }
  }
}`
          },
          {
            title: '云函数调用',
            language: 'javascript',
            code: `// 调用云函数
wx.cloud.callFunction({
  name: 'sum',
  data: {
    a: 1,
    b: 2
  },
  success(res) {
    console.log(res.result)
  },
  fail(err) {
    console.error(err)
  }
})

// 云函数定义 (cloud/functions/sum/index.js)
exports.main = async (event, context) => {
  return {
    sum: event.a + event.b
  }
}`
          },
          {
            title: '存储和状态管理',
            language: 'javascript',
            code: `// 本地存储
wx.setStorageSync('key', 'value')
const value = wx.getStorageSync('key')

wx.setStorage({
  key: 'key',
  data: { user: 'John' },
  success() {
    console.log('保存成功')
  }
})

// 全局应用状态
// app.js
App({
  globalData: {
    userInfo: null
  },
  setUserInfo(info) {
    this.globalData.userInfo = info
  }
})

// 在页面中使用全局状态
const app = getApp()
console.log(app.globalData.userInfo)`
          }
        ],
        children: [
          {
            id: 'wechat-cloud',
            title: '微信云开发',
            summary: '云函数、云数据库、云存储',
            topics: ['云函数', '云数据库', '云存储', 'HTTP API', '云调用'],
            description: '微信云开发是一套完整的小程序后端云服务，包括计算、数据库、存储、CDN、日志等功能，无需搭建和维护后端服务器。',
            useCases: [
              '快速开发小程序后端',
              '实现数据的增删改查',
              '文件上传和分享',
              '实时数据库操作',
              '统计和分析用户行为'
            ],
            bestPractices: [
              '使用云函数处理敏感操作和数据验证',
              '合理设置云数据库权限控制',
              '定期清理过期文件节省存储空间',
              '使用云调用实现支付等安全功能',
              '监控云函数性能和执行日志'
            ],
            codeExamples: [
              {
                title: '云函数 - 数据操作',
                language: 'javascript',
                code: `// cloud/functions/getUserInfo/index.js
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const { userId } = event
  
  try {
    const res = await db.collection('users')
      .doc(userId)
      .get()
    return {
      success: true,
      data: res.data
    }
  } catch(err) {
    return {
      success: false,
      error: err
    }
  }
}`
              },
              {
                title: '云数据库操作',
                language: 'javascript',
                code: `// 增
db.collection('todos').add({
  data: {
    title: '学习云开发',
    done: false,
    createTime: db.serverDate()
  }
})

// 删
db.collection('todos').doc(docId).remove()

// 改
db.collection('todos').doc(docId).update({
  data: {
    done: true
  }
})

// 查
db.collection('todos')
  .where({ done: false })
  .orderBy('createTime', 'desc')
  .limit(10)
  .get()`
              },
              {
                title: '文件上传和下载',
                language: 'javascript',
                code: `// 上传文件
wx.chooseImage({
  success(res) {
    const tempFilePath = res.tempFilePaths[0]
    wx.cloud.uploadFile({
      cloudPath: 'images/' + Date.now() + '.png',
      filePath: tempFilePath,
      success(res) {
        console.log('上传成功', res.fileID)
      },
      fail(err) {
        console.error('上传失败', err)
      }
    })
  }
})

// 下载文件
wx.cloud.downloadFile({
  fileID: 'cloud://xxx.jpg',
  success(res) {
    wx.saveFile({
      tempFilePath: res.tempFilePath,
      success(res) {
        console.log('保存成功', res.savedFilePath)
      }
    })
  }
})`
              },
              {
                title: '云调用 - 发送消息',
                language: 'javascript',
                code: `// cloud/functions/sendMessage/index.js
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event, context) => {
  const { userId, message } = event
  
  // 向用户发送模板消息
  try {
    await cloud.openapi.subscriptionMessage.send({
      touser: userId,
      template_id: 'xxxxxxxxx',
      miniprogram_state: 'trial',
      data: {
        thing1: { value: message }
      }
    })
    return { success: true }
  } catch(err) {
    return { success: false, error: err }
  }
}`
              }
            ]
          },
          {
            id: 'wechat-plugin',
            title: '小程序插件',
            summary: '开发和使用小程序插件',
            topics: ['插件开发', '插件使用', '插件市场'],
            description: '小程序插件是一种可复用的应用模块，插件开发者可以将功能打包为插件提供给第三方小程序使用。',
            useCases: [
              '开发通用业务模块共享给他人',
              '集成第三方服务（支付、分享等）',
              '实现功能的模块化复用',
              '扩展小程序功能而无需修改主程序'
            ],
            bestPractices: [
              '合理规划插件的功能边界',
              '提供清晰的插件文档和示例',
              '对插件版本进行合理管理',
              '及时修复插件的 bug 和安全问题'
            ],
            codeExamples: [
              {
                title: '插件配置 - plugin.json',
                language: 'json',
                code: `{
  "publicPages": [
    "pages/list"
  ],
  "pages": [
    "pages/detail"
  ],
  "usingComponents": {
    "slide-view": "/components/slide-view/index"
  }
}`
              },
              {
                title: '在小程序中使用插件',
                language: 'json',
                code: `// app.json
{
  "pages": [
    "pages/index"
  ],
  "plugins": {
    "myPlugin": {
      "version": "1.0.0",
      "provider": "wx1234567890"
    }
  }
}

// pages/index.json - 在页面中使用插件组件
{
  "usingComponents": {
    "ad": "plugin://myPlugin/ad"
  }
}`
              },
              {
                title: '插件中导出接口',
                language: 'javascript',
                code: `// plugin/index.js
module.exports = {
  getData() {
    return {
      data: 'from plugin'
    }
  },
  process(data) {
    return data.toUpperCase()
  }
}

// 小程序中调用插件方法
const plugin = requirePlugin('myPlugin')
const result = plugin.getData()
console.log(result)`
              }
            ]
          },
        ],
      },
      {
        id: 'alipay-mp',
        title: '支付宝小程序',
        summary: '支付宝原生小程序开发',
        topics: ['框架结构', 'AXML/ACSS', '生命周期', '组件与 API', '支付能力', '云开发', '多端适配'],
        description: '支付宝小程序是蚂蚁集团为商家和开发者提供的一套完整的小程序开发框架。支付宝小程序拥有特有的支付能力和金融属性，广泛应用于电商、生活服务、金融等领域。',
        useCases: [
          '支付宝生态内的商户应用',
          '集成支付宝支付功能',
          '扫一扫接入应用',
          '线下门店的数字化管理',
          '社交和生活服务应用'
        ],
        bestPractices: [
          '充分利用支付宝的支付和金融能力',
          '使用生命周期管理应用状态',
          '合理使用开放能力和授权',
          '性能优化和用户体验并重',
          '及时适配支付宝新版本特性'
        ],
        codeExamples: [
          {
            title: 'app.json 基础配置',
            language: 'json',
            code: `{
  "pages": [
    "pages/index/index",
    "pages/user/user"
  ],
  "window": {
    "defaultTitle": "支付宝小程序",
    "navigationBarTitleText": "支付宝小程序",
    "navigationBarBackgroundColor": "#1890ff",
    "navigationBarTextStyle": "white"
  },
  "tabBar": {
    "textColor": "#666",
    "selectedColor": "#1890ff",
    "items": [
      {
        "pagePath": "pages/index/index",
        "name": "首页"
      },
      {
        "pagePath": "pages/user/user",
        "name": "我的"
      }
    ]
  }
}`
          },
          {
            title: 'Page 生命周期',
            language: 'javascript',
            code: `Page({
  data: {
    title: 'Hello',
    items: []
  },
  
  onLoad(query) {
    // 页面加载时触发
    console.log('onLoad', query)
    this.fetchData()
  },
  
  onReady() {
    // 页面初次渲染完成时触发
  },
  
  onShow() {
    // 页面显示时触发
  },
  
  onHide() {
    // 页面隐藏时触发
  },
  
  onUnload() {
    // 页面卸载时触发
  },
  
  async fetchData() {
    try {
      const res = await my.request({
        url: 'https://api.example.com/items',
        method: 'GET'
      })
      this.setData({ items: res.data })
    } catch(err) {
      console.error('Error:', err)
    }
  }
})`
          },
          {
            title: 'AXML 模板语法',
            language: 'xml',
            code: `<!-- 数据绑定 -->
<view>{{message}}</view>

<!-- 条件渲染 -->
<view a:if="{{isShow}}">
  显示内容
</view>
<view a:else>
  隐藏内容
</view>

<!-- 列表渲染 -->
<view a:for="{{items}}" a:key="{{item.id}}">
  {{index}}: {{item.name}}
</view>

<!-- 事件绑定 -->
<button type="primary" onTap="handleClick">
  点击我
</button>
<button type="primary" onTap="handleWithArg" data-id="123">
  传递参数
</button>

<!-- 内联样式 -->
<view style="color: {{textColor}}">
  动态样式
</view>

<!-- 组件使用 -->
<form onSubmit="onSubmit">
  <input placeholder="输入名称" name="username" />
  <button formType="submit">提交</button>
</form>`
          },
          {
            title: 'my.request 网络请求',
            language: 'javascript',
            code: `// 基础请求
my.request({
  url: 'https://api.example.com/data',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  },
  success(res) {
    console.log('Success:', res.data)
  },
  fail(err) {
    console.error('Error:', err)
  },
  complete() {
    console.log('Complete')
  }
})

// POST 请求
my.request({
  url: 'https://api.example.com/user',
  method: 'POST',
  data: {
    name: 'John',
    age: 30
  },
  success(res) {
    console.log(res.data)
  }
})

// 超时设置
my.request({
  url: 'https://api.example.com/data',
  timeout: 10000,
  success(res) {
    console.log(res.data)
  }
})`
          },
          {
            title: '支付功能集成',
            language: 'javascript',
            code: `// 调用支付接口
function pay() {
  my.request({
    url: 'https://api.example.com/order',
    method: 'POST',
    data: { amount: 100 },
    success(res) {
      if (res.data.success) {
        my.tradePay({
          tradeNO: res.data.tradeNo,
          success(result) {
            console.log('支付成功', result)
            my.navigateTo({ url: '/pages/success/success' })
          },
          fail(err) {
            console.error('支付失败', err)
          }
        })
      }
    }
  })
}

// 查询订单状态
function queryOrder(tradeNo) {
  my.request({
    url: 'https://api.example.com/order/query',
    method: 'POST',
    data: { tradeNo },
    success(res) {
      console.log('订单状态:', res.data.status)
    }
  })
}`
          },
          {
            title: '获取用户信息',
            language: 'javascript',
            code: `// 获取用户绑定的支付宝账户
my.getAuthCode({
  scopes: 'auth_user',
  success(result) {
    // 使用 authCode 调用后端接口获取用户信息
    my.request({
      url: 'https://api.example.com/user/info',
      method: 'POST',
      data: { authCode: result.authCode },
      success(res) {
        console.log('用户信息:', res.data)
      }
    })
  },
  fail(err) {
    console.error('授权失败:', err)
  }
})

// 获取用户电话号码（需要授权）
my.getPhoneNumber({
  success(res) {
    console.log('电话号码:', res.phone)
  },
  fail(err) {
    console.error('获取失败:', err)
  }
})`
          },
          {
            title: '存储和分享',
            language: 'javascript',
            code: `// 本地存储
my.setStorage({
  key: 'userInfo',
  data: { name: 'John', id: 123 },
  success() {
    console.log('保存成功')
  }
})

my.getStorage({
  key: 'userInfo',
  success(res) {
    console.log('数据:', res.data)
  }
})

// 分享
my.shareAppMessage({
  title: '分享标题',
  desc: '分享描述',
  path: '/pages/index/index?id=123'
})

// 调起分享菜单
function share() {
  my.showShareMenu({
    success() {
      console.log('分享菜单显示')
    }
  })
}`
          }
        ],
      },
      {
        id: 'douyin-mp',
        title: '抖音小程序',
        summary: '字节跳动系小程序',
        topics: ['抖音小程序', '头条小程序', 'TTML/TTSS', '开放能力', '视频组件'],
        description: '抖音小程序是字节跳动推出的小程序平台，集成了抖音的短视频、直播等能力。抖音小程序在抖音平台拥有强大的流量优势和社交属性。',
        useCases: [
          '创意视频推广应用',
          '内容营销和转化',
          '直播带货和电商',
          '社交互动和用户增长',
          '短视频内容集成'
        ],
        bestPractices: [
          '充分发挥短视频和直播能力',
          '优化用户在抖音生态内的体验',
          '合理使用内容分发和推荐机制',
          '支持视频和音频媒体特性',
          '关注用户隐私和内容审核'
        ],
        codeExamples: [
          {
            title: 'app.json 配置',
            language: 'json',
            code: `{
  "pages": [
    "pages/index",
    "pages/video",
    "pages/user"
  ],
  "window": {
    "navigationStyle": "custom",
    "navigationBarBackgroundColor": "#000000",
    "navigationBarTextStyle": "white",
    "navigationBarTitleText": "抖音小程序"
  },
  "tabBar": {
    "color": "#999",
    "selectedColor": "#000",
    "borderStyle": "black",
    "list": [
      {
        "pagePath": "pages/index",
        "text": "首页"
      },
      {
        "pagePath": "pages/video",
        "text": "视频"
      }
    ]
  }
}`
          },
          {
            title: 'TTML 模板和事件',
            language: 'xml',
            code: `<!-- 视频播放组件 -->
<video
  id="video"
  src="https://example.com/video.mp4"
  controls
  autoplay
  loop
  muted
  onPlay="handlePlay"
  onPause="handlePause"
  onEnded="handleEnded"
  style="width: 100%; height: 300px;"
/>

<!-- 数据绑定 -->
<view class="container">
  <text>{{videoTitle}}</text>
  <text>播放量: {{playCount}}</text>
</view>

<!-- 列表渲染视频 -->
<scroll-view scroll-y="true" class="video-list">
  <view tt:for="{{videos}}" tt:key="{{item.id}}" class="video-item">
    <video src="{{item.url}}" style="width: 100%; height: 200px;" />
    <text>{{item.title}}</text>
  </view>
</scroll-view>

<!-- 触发事件 -->
<button type="primary" onTap="shareVideo">
  分享视频
</button>`
          },
          {
            title: '视频上传和处理',
            language: 'javascript',
            code: `// 选择视频
function chooseVideo() {
  tt.chooseVideo({
    sourceType: ['album', 'camera'],
    compressed: false,
    maxDuration: 60,
    success(res) {
      console.log('视频路径:', res.tempFilePath)
      uploadVideo(res.tempFilePath)
    }
  })
}

// 上传视频
function uploadVideo(filePath) {
  tt.uploadFile({
    url: 'https://api.example.com/upload/video',
    filePath: filePath,
    name: 'video',
    success(res) {
      console.log('上传成功:', res.data)
    },
    fail(err) {
      console.error('上传失败:', err)
    }
  })
}

// 压缩视频
tt.compressVideo({
  src: '/path/to/video.mp4',
  quality: 'low',
  success(res) {
    console.log('压缩成功:', res.tempFilePath)
  }
})`
          },
          {
            title: '分享和互动',
            language: 'javascript',
            code: `// 分享视频
function shareVideo(videoId) {
  tt.shareAppMessage({
    title: '看看这个视频',
    desc: '超有趣的内容',
    path: '/pages/video?id=' + videoId,
    imageUrl: 'https://example.com/cover.jpg',
    success() {
      console.log('分享成功')
    }
  })
}

// 打开直播间
function openLive(liveId) {
  tt.navigateTo({
    url: '/pages/live/live?id=' + liveId
  })
}

// 点赞和评论
function likeVideo(videoId) {
  tt.request({
    url: 'https://api.example.com/video/like',
    method: 'POST',
    data: { videoId },
    success(res) {
      console.log('点赞成功')
    }
  })
}`
          },
          {
            title: 'API 请求',
            language: 'javascript',
            code: `// 基础请求
tt.request({
  url: 'https://api.example.com/data',
  method: 'GET',
  success(res) {
    console.log('响应:', res.data)
  },
  fail(err) {
    console.error('请求失败:', err)
  }
})

// 获取用户信息
tt.getUserInfo({
  success(res) {
    console.log('用户信息:', res.userInfo)
  }
})

// 获取推荐内容
tt.request({
  url: 'https://api.example.com/recommend',
  method: 'GET',
  data: { 
    pageNum: 1,
    pageSize: 10 
  },
  success(res) {
    console.log('推荐视频:', res.data)
  }
})`
          }
        ],
      },
      {
        id: 'qq-mp',
        title: 'QQ 小程序',
        summary: 'QQ 平台小程序开发',
        topics: ['QQ 小程序框架', 'API 差异', '审核规范'],
        description: 'QQ 小程序是腾讯推出的小程序平台，依托 QQ 的海量用户和社交生态，具有强大的社交分享和传播能力。',
        useCases: [
          '社交分享和传播',
          '游戏和娱乐应用',
          'QQ 生态内的轻应用',
          '用户增长和裂变营销',
          '内容分发和消费'
        ],
        bestPractices: [
          '充分利用 QQ 的社交属性',
          '合理使用分享和推荐机制',
          '注意 QQ 和微信 API 的差异',
          '关注审核规范避免被拒',
          '优化在 QQ 客户端的显示效果'
        ],
        codeExamples: [
          {
            title: 'app.json 配置',
            language: 'json',
            code: `{
  "pages": [
    "pages/index",
    "pages/detail"
  ],
  "window": {
    "navigationBarBackgroundColor": "#0084ff",
    "navigationBarTextStyle": "white",
    "navigationBarTitleText": "QQ 小程序",
    "backgroundColor": "#ffffff"
  },
  "permission": {
    "scope.userLocation": {
      "desc": "需要获取您的位置信息"
    }
  }
}`
          },
          {
            title: 'Page 生命周期',
            language: 'javascript',
            code: `Page({
  data: {
    title: '',
    content: []
  },
  
  onLoad(options) {
    // 页面加载
    console.log('页面加载', options)
  },
  
  onReady() {
    // 页面就绪
  },
  
  onShow() {
    // 页面显示
  },
  
  onHide() {
    // 页面隐藏
  },
  
  onUnload() {
    // 页面卸载
  },
  
  // 事件处理
  handleShare() {
    qq.shareAppMessage({
      title: '分享标题',
      desc: '分享描述',
      path: '/pages/index',
      imageUrl: 'https://example.com/share.jpg'
    })
  }
})`
          },
          {
            title: 'API 请求',
            language: 'javascript',
            code: `// 基础请求
qq.request({
  url: 'https://api.example.com/data',
  method: 'GET',
  success(res) {
    console.log('响应:', res.data)
  },
  fail(err) {
    console.error('请求失败:', err)
  }
})

// 获取用户信息
qq.getUserInfo({
  success(res) {
    console.log('用户信息:', res.userInfo)
  }
})

// 获取位置信息
qq.getLocation({
  type: 'gcj02',
  success(res) {
    console.log('位置:', res.latitude, res.longitude)
  }
})`
          },
          {
            title: '分享机制',
            language: 'javascript',
            code: `// 设置分享菜单
qq.showShareMenu({
  withShareTicket: true,
  menus: ['shareAppMessage', 'shareTimeline'],
  success() {
    console.log('分享菜单显示成功')
  }
})

// 自定义分享
Page({
  onShareAppMessage() {
    return {
      title: '快来看看',
      desc: '这是一个很有趣的小程序',
      path: '/pages/index?from=share',
      imageUrl: 'https://example.com/cover.jpg'
    }
  },
  
  onShareTimeline() {
    return {
      title: '分享到说说',
      query: 'from=timeline'
    }
  }
})`
          },
          {
            title: '存储操作',
            language: 'javascript',
            code: `// 设置存储
qq.setStorage({
  key: 'userInfo',
  data: { name: 'John', age: 30 },
  success() {
    console.log('保存成功')
  }
})

// 获取存储
qq.getStorage({
  key: 'userInfo',
  success(res) {
    console.log('用户信息:', res.data)
  }
})

// 删除存储
qq.removeStorage({
  key: 'userInfo',
  success() {
    console.log('删除成功')
  }
})`
          }
        ],
      },
      {
        id: 'baidu-mp',
        title: '百度智能小程序',
        summary: '百度系小程序开发',
        topics: ['智能小程序', 'Swan 语法', 'AI 能力', '搜索直达'],
        description: '百度智能小程序是百度推出的小程序平台，具有搜索直达、AI 能力集成等特色，通过搜索引擎获得海量流量。',
        useCases: [
          '搜索引擎驱动的应用',
          'AI 能力集成应用',
          '知识图谱相关应用',
          '百度生态内的服务',
          '智能语音和图像识别应用'
        ],
        bestPractices: [
          '优化搜索引擎排名和直达',
          '充分利用 AI 和机器学习能力',
          '关注用户隐私和数据安全',
          '使用百度云服务加快开发',
          '利用百度生态的流量优势'
        ],
        codeExamples: [
          {
            title: 'app.json 配置',
            language: 'json',
            code: `{
  "pages": [
    "pages/index",
    "pages/search"
  ],
  "window": {
    "navigationBarBackgroundColor": "#ff6600",
    "navigationBarTextStyle": "white",
    "navigationBarTitleText": "百度智能小程序"
  },
  "permissionScope": [
    {
      "origin": "*"
    }
  ]
}`
          },
          {
            title: 'Swan 模板语法',
            language: 'xml',
            code: `<!-- 数据绑定 -->
<text>{{message}}</text>

<!-- 条件渲染 -->
<view s-if="show">
  显示
</view>
<view s-else>
  隐藏
</view>

<!-- 列表渲染 -->
<view s-for="item, index in items" s-key="item.id">
  {{index}}: {{item.name}}
</view>

<!-- 事件绑定 -->
<button on-tap="handleClick" data-id="123">
  点击
</button>

<!-- 模板使用 -->
<import src="./common.swan" />
<view component="{{comp}}"/>`
          },
          {
            title: 'Page 生命周期',
            language: 'javascript',
            code: `Page({
  data: {
    message: 'Hello Baidu'
  },
  
  onLoad(options) {
    // 页面加载
    console.log('onLoad', options)
  },
  
  onReady() {
    // 页面就绪
  },
  
  onShow() {
    // 页面显示
  },
  
  onHide() {
    // 页面隐藏
  },
  
  onUnload() {
    // 页面卸载
  },
  
  handleClick() {
    console.log('点击事件')
  }
})`
          },
          {
            title: 'API 请求',
            language: 'javascript',
            code: `// 基础请求
swan.request({
  url: 'https://api.example.com/data',
  method: 'GET',
  success(res) {
    console.log('响应:', res.data)
  },
  fail(err) {
    console.error('请求失败:', err)
  }
})

// 获取用户信息
swan.login({
  success(res) {
    console.log('登录码:', res.code)
  }
})

// 获取设备信息
swan.getSystemInfo({
  success(res) {
    console.log('系统信息:', res)
  }
})`
          },
          {
            title: '百度 AI 能力集成',
            language: 'javascript',
            code: `// 文本识别
swan.request({
  url: 'https://api.baidu.com/ocr/v1/general',
  method: 'POST',
  header: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  data: {
    image: base64Image,
    access_token: 'your_access_token'
  },
  success(res) {
    console.log('识别结果:', res.data)
  }
})

// 人脸识别
swan.chooseImage({
  count: 1,
  sizeType: ['compressed'],
  sourceType: ['album', 'camera'],
  success(res) {
    const image = res.tempFilePaths[0]
    detectFace(image)
  }
})

function detectFace(imagePath) {
  swan.request({
    url: 'https://api.baidu.com/faceapi/v3/detect',
    method: 'POST',
    data: { image: imagePath },
    success(res) {
      console.log('人脸检测:', res.data)
    }
  })
}`
          },
          {
            title: '搜索结果页配置',
            language: 'json',
            code: `{
  "pages": ["pages/index"],
  "darkmode": false,
  "searchUi": {
    "icon": "https://example.com/icon.png",
    "title": "我的应用",
    "description": "应用描述"
  },
  "routes": [
    {
      "path": "pages/search",
      "query": "keyword",
      "icon": "https://example.com/search-icon.png",
      "title": "搜索结果"
    }
  ]
}`
          }
        ],
      },
    ],
  },
  {
    id: 'ssr-sg',
    title: 'SSR / SSG',
    summary: 'Nuxt 3、服务端渲染、预渲染与部署',
    tags: ['ssr', 'nuxt'],
    children: [
      {
        id: 'nuxt3',
        title: 'Nuxt 3',
        summary: 'Vue 3 全栈框架',
        topics: ['文件路由系统', 'Server Routes', 'useAsyncData/useFetch', 'Nitro 引擎', '自动导入', 'Nuxt Modules', '数据获取', 'SEO 优化', '部署方案'],
        children: [
          {
            id: 'nuxt-data',
            title: 'Nuxt 数据获取',
            summary: 'useAsyncData、useFetch、状态共享',
            topics: ['useAsyncData', 'useFetch', 'useLazyFetch', 'useState', 'useNuxtData', '错误处理'],
          },
          {
            id: 'nuxt-deploy',
            title: 'Nuxt 部署',
            summary: 'Node、静态、边缘部署方案',
            topics: ['Node.js 部署', 'Vercel/Netlify', 'Cloudflare Workers', 'Docker 部署', 'PM2 进程管理'],
          },
        ],
      },
      {
        id: 'ssr-strategy',
        title: '渲染策略',
        summary: 'CSR/SSR/SSG/ISR 渲染模式选择',
        topics: ['客户端渲染 CSR', '服务端渲染 SSR', '静态生成 SSG', '增量静态再生 ISR', '混合渲染', 'Hydration 水合', 'Islands 架构', '流式 SSR'],
      },
      {
        id: 'seo',
        title: 'SEO 优化',
        summary: 'Meta 标签、结构化数据、性能优化',
        topics: ['Meta 标签', 'Open Graph', 'Schema.org', 'Sitemap', 'robots.txt', 'Core Web Vitals', '预渲染'],
      },
    ],
  },
  {
    id: 'tooling',
    title: '工程化与构建',
    summary: 'Vite、构建工具、包管理、Monorepo',
    tags: ['vite', 'build', 'engineering'],
    children: [
      {
        id: 'vite',
        title: 'Vite 配置',
        summary: 'Vite 构建工具深度配置',
        description: 'Vite 是新一代前端构建工具，基于原生 ES 模块提供极速的开发服务器，使用 Rollup 打包生产代码。它利用浏览器原生 ESM 支持，实现真正的按需编译，开发时无需打包，冷启动速度极快。Vite 对 Vue 3 有第一优先级支持，提供了官方的 @vitejs/plugin-vue 插件。通过丰富的插件生态和灵活的配置选项，可以满足各种项目需求。',
        topics: ['基础配置', '别名 alias', '环境变量', '插件系统', '构建优化', 'Rollup Options', 'SSR 配置', 'Library Mode', 'Worker 支持', 'WASM 支持'],
        useCases: [
          'Vue 3 单页应用开发',
          '组件库开发与打包',
          'SSR 应用构建',
          '多页应用（MPA）开发'
        ],
        bestPractices: [
          '使用路径别名简化导入路径',
          '环境变量使用 .env 文件管理',
          '生产构建启用 gzip 或 brotli 压缩',
          '合理配置 chunk 分割策略',
          '使用 vite-plugin-inspect 调试插件'
        ],
        codeExamples: [
          {
            title: 'vite.config.ts 基础配置',
            code: `import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  
  // 路径别名
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components')
    }
  },
  
  // 开发服务器
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  },
  
  // 构建配置
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router', 'pinia']
        }
      }
    }
  }
})`
          },
          {
            title: '环境变量使用',
            code: `// .env.development
VITE_API_URL=http://localhost:8080
VITE_APP_TITLE=My App Dev

// .env.production
VITE_API_URL=https://api.example.com
VITE_APP_TITLE=My App

// 在代码中使用
const apiUrl = import.meta.env.VITE_API_URL
const appTitle = import.meta.env.VITE_APP_TITLE

// TypeScript 类型定义
// env.d.ts
interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_APP_TITLE: string
}`
          }
        ],
        resources: [
          { title: 'Vite 官方文档', url: 'https://cn.vitejs.dev/' },
          { title: 'Awesome Vite' }
        ],
        children: [
          {
            id: 'vite-plugins',
            title: 'Vite 插件',
            summary: '常用 Vite 插件与自定义插件',
            topics: ['@vitejs/plugin-vue', 'unplugin-auto-import', 'unplugin-vue-components', 'vite-plugin-pwa', 'vite-plugin-compression', '自定义插件开发'],
          },
          {
            id: 'vite-optimization',
            title: 'Vite 性能优化',
            summary: '预构建、分包、Tree Shaking',
            topics: ['依赖预构建', 'Code Splitting', 'Chunk 分割策略', 'Tree Shaking', 'CSS Code Split', '资源内联', 'Gzip/Brotli'],
            description: 'Vite 提供了多种内置的性能优化机制，包括依赖预构建、智能代码分割、Tree Shaking 等。通过合理配置这些功能，可以显著提升应用的构建速度和运行时性能。',
            useCases: [
              '减少应用的初始加载时间',
              '优化首屏内容显示性能',
              '降低网络传输的文件体积',
              '提升开发环境的热更新速度',
              '支持大型项目的高效构建'
            ],
            bestPractices: [
              '合理配置 optimizeDeps 预构建依赖',
              '使用 rollupOptions 控制代码分割策略',
              '启用 Tree Shaking 消除未使用代码',
              '利用动态导入实现路由和组件懒加载',
              '监控构建产物大小并进行持续优化'
            ],
            codeExamples: [
              {
                title: 'vite.config.ts - 依赖预构建',
                language: 'typescript',
                code: `import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  optimizeDeps: {
    // 指定需要预构建的依赖
    include: ['vue', 'vue-router', 'axios', 'lodash-es'],
    // 排除不需要预构建的依赖
    exclude: ['my-local-package'],
    // 是否需要缓存预构建结果，dev 时建议 true
    force: false,
    // 预构建的输出目录
    esbuildOptions: {
      // esbuild 选项
      define: {
        __DEV__: JSON.stringify(true)
      }
    }
  }
})`
              },
              {
                title: 'vite.config.ts - 代码分割策略',
                language: 'typescript',
                code: `import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    rollupOptions: {
      output: {
        // 配置代码分割
        manualChunks: {
          // 将 vue 及相关库分割到单独的 chunk
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          // 将 ui 库分割出去
          'ui-vendor': ['element-plus'],
          // 将工具库分割出去
          'utils': ['axios', 'lodash-es']
        },
        // 修改 chunk 的输出文件名
        chunkFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'index') {
            return 'entries/[name]-[hash].js'
          }
          if (chunkInfo.isDynamicEntry) {
            return 'dynamic/[name]-[hash].js'
          }
          return 'chunks/[name]-[hash].js'
        },
        // 修改入口文件名
        entryFileNames: 'entries/[name]-[hash].js'
      }
    },
    // 配置 chunk 大小警告阈值
    chunkSizeWarningLimit: 1000
  }
})`
              },
              {
                title: 'vite.config.ts - Tree Shaking',
                language: 'typescript',
                code: `import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    // 启用 minify 时自动 tree shaking
    minify: 'terser',
    terserOptions: {
      compress: {
        // 删除未使用的变量
        unused: true,
        // 删除无效的代码
        dead_code: true
      }
    },
    rollupOptions: {
      output: {
        // 确保 sideEffects 正确配置
        // 需要在 package.json 中设置
        // "sideEffects": false
      }
    }
  }
})`
              },
              {
                title: 'vite.config.ts - CSS 代码分割',
                language: 'typescript',
                code: `import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    // CSS 提取和分割策略
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        // CSS 文件输出位置
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.css')) {
            return 'styles/[name]-[hash][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        }
      }
    }
  }
})`
              },
              {
                title: '动态导入和路由懒加载',
                language: 'typescript',
                code: `// router.ts - 使用动态导入实现路由懒加载
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('./views/Home.vue'),
    name: 'Home'
  },
  {
    path: '/about',
    component: () => import('./views/About.vue'),
    name: 'About'
  },
  {
    path: '/dashboard',
    component: () => import(/* webpackChunkName: "dashboard" */ './views/Dashboard.vue'),
    name: 'Dashboard'
  },
  {
    path: '/admin',
    component: () => import(/* webpackChunkName: "admin" */ './views/Admin.vue'),
    meta: { requiresAuth: true }
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})

// 组件懒加载示例
import { defineAsyncComponent } from 'vue'

export const AsyncComponent = defineAsyncComponent(() =>
  import('./components/AsyncComponent.vue')
)

// 带加载和错误处理的异步组件
export const SafeAsyncComponent = defineAsyncComponent({
  loader: () => import('./components/SafeAsyncComponent.vue'),
  loadingComponent: () => import('./components/Loading.vue'),
  errorComponent: () => import('./components/Error.vue'),
  delay: 200,
  timeout: 10000
})`
              },
              {
                title: 'package.json - 配置 sideEffects',
                language: 'json',
                code: `{
  "name": "my-app",
  "version": "1.0.0",
  "description": "My Vite app",
  "type": "module",
  "main": "dist/index.js",
  // 声明没有副作用，允许完整的 tree shaking
  "sideEffects": false,
  // 也可以指定有副作用的文件
  // "sideEffects": [
  //   "./src/some-file.js",
  //   "*.css"
  // ],
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.es.js",
      "require": "./dist/index.cjs"
    }
  },
  "files": [
    "dist"
  ],
  "dependencies": {
    "vue": "^3.3.0"
  },
  "devDependencies": {
    "vite": "^4.3.0",
    "@vitejs/plugin-vue": "^4.2.0"
  }
}`
              },
              {
                title: '资源压缩配置',
                language: 'typescript',
                code: `import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import viteCompression from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    vue(),
    // Gzip 压缩
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: 'gzip',
      ext: '.gz'
    }),
    // Brotli 压缩
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: 'brotliCompress',
      ext: '.br'
    })
  ],
  build: {
    // 配置输出
    target: 'esnext',
    // 启用报告
    reportCompressedSize: true,
    // 启用 sourcemap 用于生产调试
    sourcemap: false,
    // 资源内联阈值（bytes）
    assetsInlineLimit: 4096,
    // 配置 esbuild
    minify: 'terser'
  }
})`
              },
              {
                title: '图片和资源优化',
                language: 'typescript',
                code: `import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import viteImagemin from 'vite-plugin-imagemin'

export default defineConfig({
  plugins: [
    vue(),
    // 图片压缩
    viteImagemin({
      gifsicle: {
        optimizationLevel: 7,
        interlaced: false
      },
      optipng: {
        optimizationLevel: 7
      },
      mozjpeg: {
        quality: 20
      },
      pngquant: {
        quality: [0.8, 0.9],
        speed: 4
      },
      svg: {
        multipass: true,
        plugins: [
          {
            name: 'removeViewBox'
          },
          {
            name: 'removeEmptyAttrs',
            params: {
              removeAll: true
            }
          }
        ]
      }
    })
  ],
  build: {
    rollupOptions: {
      output: {
        // 分离资源到单独目录
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.')
          const ext = info[info.length - 1]
          if (/png|jpe?g|gif|tiff|bmp|ico/i.test(ext)) {
            return 'images/[name]-[hash][extname]'
          } else if (/woff|woff2|eot|ttf|otf/.test(ext)) {
            return 'fonts/[name]-[hash][extname]'
          } else {
            return 'assets/[name]-[hash][extname]'
          }
        }
      }
    }
  }
})`
              }
            ],
          },
        ],
      },
      {
        id: 'package-managers',
        title: '包管理器',
        summary: 'npm、pnpm、yarn 包管理',
        topics: ['npm 使用', 'pnpm 工作区', 'yarn berry', 'package.json', 'package-lock.json', 'pnpm-workspace.yaml', '依赖管理', '版本管理', 'npm scripts'],
        description: '包管理器是前端工程化的核心工具，用于管理项目的依赖关系。常见的包管理器有 npm、yarn 和 pnpm，各有特点。npm 是最常用的，yarn 提供了更好的依赖锁定，pnpm 则以高效的磁盘使用著称。',
        useCases: [
          '安装和管理项目依赖',
          '发布和维护 npm 包',
          '管理 npm scripts 自动化任务',
          '使用工作区管理单体仓库',
          '版本管理和更新依赖'
        ],
        bestPractices: [
          '使用 lockfile 锁定依赖版本确保一致性',
          '定期更新依赖保持安全性',
          '使用 npm scripts 统一团队命令',
          '合理区分生产和开发依赖',
          '使用 engines 指定 Node.js 版本要求'
        ],
        codeExamples: [
          {
            title: 'package.json - 完整示例',
            language: 'json',
            code: `{
  "name": "@my-org/my-app",
  "version": "1.0.0",
  "description": "My awesome application",
  "type": "module",
  "main": "dist/index.js",
  "module": "dist/index.es.js",
  "types": "dist/index.d.ts",
  "engines": {
    "node": ">=16.0.0",
    "npm": ">=8.0.0"
  },
  "keywords": ["vue", "app"],
  "author": "Your Name",
  "license": "MIT",
  "homepage": "https://github.com/user/repo",
  "repository": {
    "type": "git",
    "url": "https://github.com/user/repo.git"
  },
  "bugs": {
    "url": "https://github.com/user/repo/issues"
  },
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "type-check": "vue-tsc --noEmit",
    "lint": "eslint src --ext .ts,.vue",
    "format": "prettier --write src",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  },
  "dependencies": {
    "vue": "^3.3.0",
    "vue-router": "^4.2.0",
    "pinia": "^2.1.0",
    "axios": "^1.4.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^4.2.0",
    "vite": "^4.3.0",
    "typescript": "^5.0.0",
    "vue-tsc": "^1.8.0",
    "eslint": "^8.40.0",
    "@typescript-eslint/eslint-plugin": "^5.59.0",
    "prettier": "^2.8.0",
    "vitest": "^0.32.0"
  },
  "peerDependencies": {
    "vue": "^3.0.0"
  },
  "sideEffects": false
}`
          },
          {
            title: 'npm scripts 常用命令',
            language: 'bash',
            code: `# 安装依赖
npm install
npm install --save-dev @types/node  # 安装开发依赖
npm install --global typescript      # 全局安装

# 更新依赖
npm update
npm update lodash                    # 更新指定包
npm outdated                         # 查看过期依赖

# 删除依赖
npm uninstall lodash
npm prune                            # 删除未在 package.json 中列出的包

# 发布 npm 包
npm login
npm publish
npm unpublish package-name --force

# 查看信息
npm list                             # 列出已安装的包
npm list --depth=0                   # 只显示顶级包
npm view lodash versions             # 查看包的所有版本

# 其他常用命令
npm audit                            # 检查安全漏洞
npm audit fix                        # 自动修复漏洞
npm cache clean --force              # 清理缓存`
          },
          {
            title: 'pnpm workspace 配置',
            language: 'yaml',
            code: `# pnpm-workspace.yaml
packages:
  - 'packages/*'
  - 'apps/*'

# packages/
#   ├── ui/
#   │   └── package.json
#   ├── utils/
#   │   └── package.json
# apps/
#   ├── web/
#   │   └── package.json
#   ├── admin/
#   │   └── package.json`
          },
          {
            title: 'pnpm 工作区命令',
            language: 'bash',
            code: `# 在根目录安装所有工作区的依赖
pnpm install

# 在特定工作区运行命令
pnpm -C packages/ui build
pnpm --filter=@my-org/ui build

# 递归在所有工作区运行命令
pnpm -r build
pnpm -r test

# 给工作区添加依赖
pnpm add lodash --filter=@my-org/utils
pnpm add -D typescript -r              # 递归添加开发依赖

# 删除工作区依赖
pnpm remove lodash --filter=@my-org/utils`
          },
          {
            title: 'yarn 工作区配置',
            language: 'json',
            code: `{
  "name": "my-monorepo",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "packages/*",
    "apps/*"
  ],
  "devDependencies": {
    "typescript": "^5.0.0"
  }
}`
          }
        ],
      },
      {
        id: 'monorepo',
        title: 'Monorepo',
        summary: 'pnpm workspace、Turborepo、Nx',
        topics: ['pnpm workspace', 'Turborepo', 'Nx', 'Lerna', '共享依赖', '增量构建', '缓存策略', 'changesets 版本管理'],
        description: 'Monorepo（单体仓库）是指在一个 Git 仓库中管理多个项目或包的开发模式。通过 pnpm workspace、Turborepo、Nx 等工具，可以高效地管理依赖关系、实现代码共享和构建优化。',
        useCases: [
          '组件库和业务库的统一管理',
          '前后端分离的全栈项目',
          '多应用共享公共代码和配置',
          '微前端架构中的包管理',
          '开源项目集合管理'
        ],
        bestPractices: [
          '使用包管理器的 workspace 功能管理依赖',
          '建立清晰的包划分和边界',
          '实现增量构建提高效率',
          '使用 changesets 统一版本管理',
          '建立共享的 eslint、prettier 配置'
        ],
        codeExamples: [
          {
            title: 'pnpm workspace 项目结构',
            language: 'bash',
            code: `my-monorepo/
├── pnpm-workspace.yaml
├── package.json
├── turbo.json (可选)
├── packages/
│   ├── ui/
│   │   ├── package.json
│   │   ├── src/
│   │   └── tsconfig.json
│   ├── utils/
│   │   ├── package.json
│   │   └── src/
│   └── hooks/
│       ├── package.json
│       └── src/
├── apps/
│   ├── web/
│   │   ├── package.json
│   │   ├── src/
│   │   └── vite.config.ts
│   ├── admin/
│   │   ├── package.json
│   │   ├── src/
│   │   └── vite.config.ts
└── .github/
    └── workflows/`
          },
          {
            title: 'Turborepo 配置',
            language: 'json',
            code: `{
  "turbo": {
    "version": "1",
    "baseBranch": "main",
    "experimentalSpaces": false,
    "pipeline": {
      "dev": {
        "cache": false,
        "outputs": []
      },
      "build": {
        "dependsOn": ["^build"],
        "outputs": ["dist/**"],
        "cache": true
      },
      "lint": {
        "dependsOn": ["^lint"],
        "outputs": [],
        "cache": true
      },
      "test": {
        "dependsOn": ["^build"],
        "outputs": ["coverage/**"],
        "cache": true,
        "inputs": ["src/**/*.ts", "src/**/*.tsx", "test/**"]
      },
      "type-check": {
        "dependsOn": ["^type-check"],
        "cache": true
      }
    },
    "globalDependencies": ["**/.env*"],
    "globalEnv": ["NODE_ENV", "VERCEL_ENV"],
    "ignorePatterns": ["**/.next/**", "dist/**"],
    "remoteCache": {
      "enabled": false
    }
  }
}`
          },
          {
            title: 'monorepo 中的 package.json',
            language: 'json',
            code: `// apps/web/package.json
{
  "name": "@my-org/web",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "type-check": "vue-tsc --noEmit",
    "lint": "eslint src"
  },
  "dependencies": {
    "vue": "^3.3.0",
    "vue-router": "^4.2.0",
    "@my-org/ui": "workspace:^1.0.0",
    "@my-org/utils": "workspace:*",
    "@my-org/hooks": "workspace:*"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^4.2.0",
    "vite": "^4.3.0"
  }
}

// packages/ui/package.json
{
  "name": "@my-org/ui",
  "version": "1.0.0",
  "type": "module",
  "main": "dist/index.js",
  "module": "dist/index.es.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.es.js",
      "require": "./dist/index.js"
    }
  },
  "scripts": {
    "build": "vite build",
    "type-check": "vue-tsc --noEmit"
  },
  "dependencies": {
    "vue": "^3.3.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^4.2.0",
    "vite": "^4.3.0"
  }
}`
          },
          {
            title: 'Nx 工作区配置',
            language: 'json',
            code: `// nx.json
{
  "$schema": "./node_modules/nx/schemas/nx-schema.json",
  "extends": "nx/presets/npm.json",
  "namedInputs": {
    "default": ["{projectRoot}/**/*"],
    "source": ["{projectRoot}/src/**/*"]
  },
  "targetDefaults": {
    "build": {
      "cache": true,
      "dependsOn": ["^build"],
      "inputs": ["source", "^source"]
    },
    "lint": {
      "cache": true,
      "outputs": ["{options.outputFile}"]
    },
    "test": {
      "cache": true,
      "dependsOn": ["build"],
      "inputs": ["source", "^source", "{workspaceRoot}/package.json"]
    }
  },
  "plugins": [
    "@nx/vite/plugin",
    "@nx/eslint/plugin"
  ]
}`
          },
          {
            title: 'changesets 版本管理',
            language: 'bash',
            code: `# 初始化 changesets
pnpm add -D @changesets/cli
pnpm changeset init

# 添加 changeset
pnpm changeset
# 交互式选择需要发布的包和版本类型

# 生成变更日志
pnpm changeset version

# 发布更新
pnpm changeset publish`
          },
          {
            title: '.changeset/config.json',
            language: 'json',
            code: `{
  "$schema": "https://unpkg.com/@changesets/config@2.3.0/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": ["@my-org/example"]
}`
          }
        ],
      },
      {
        id: 'bundlers',
        title: '构建工具',
        summary: 'Webpack、Rollup、esbuild、SWC',
        topics: ['Webpack 5', 'Rollup', 'esbuild', 'SWC', 'Parcel', 'Rspack', 'Turbopack', '构建性能对比'],
        description: '构建工具是前端工程化的核心，用于将源代码转换为可在浏览器运行的文件。Webpack 是功能最全面的打包工具，Rollup 专注于库打包，esbuild 以极快的速度著称，SWC 是用 Rust 实现的高性能编译器。',
        useCases: [
          '应用级项目的完整构建',
          'npm 包和库的打包发布',
          '高性能构建系统搭建',
          '多框架项目的兼容性处理',
          '大型项目的增量构建优化'
        ],
        bestPractices: [
          '选择适合项目规模的构建工具',
          '配置合理的代码分割和懒加载',
          '监控和优化构建时间',
          '使用 sourcemap 便于线上调试',
          '定期更新构建工具版本'
        ],
        codeExamples: [
          {
            title: 'Webpack 基础配置',
            language: 'javascript',
            code: `// webpack.config.js
const path = require('path')
const HtmlPlugin = require('html-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
  mode: 'development',
  entry: './src/main.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].chunk.js',
    clean: true
  },
  module: {
    rules: [
      {
        test: /\\.vue$/,
        use: 'vue-loader'
      },
      {
        test: /\\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlPlugin({
      template: './index.html'
    })
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.vue'],
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\\\/]node_modules[\\\\/]/,
          name: 'vendors',
          priority: 10
        }
      }
    }
  }
}`
          },
          {
            title: 'Rollup 库打包配置',
            language: 'javascript',
            code: `// rollup.config.js
import vue from 'rollup-plugin-vue'
import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'esm',
      sourcemap: true
    },
    {
      file: 'dist/index.cjs',
      format: 'cjs',
      sourcemap: true
    },
    {
      file: 'dist/index.umd.js',
      format: 'umd',
      name: 'MyLib',
      globals: {
        vue: 'Vue'
      }
    }
  ],
  external: ['vue'],
  plugins: [
    resolve(),
    commonjs(),
    vue(),
    typescript({
      tsconfig: false,
      compilerOptions: {
        declaration: true,
        declarationDir: 'dist'
      }
    }),
    terser()
  ]
}`
          },
          {
            title: 'esbuild API 使用',
            language: 'javascript',
            code: `import * as esbuild from 'esbuild'

// 简单构建
esbuild.buildSync({
  entryPoints: ['src/main.ts'],
  bundle: true,
  outfile: 'dist/bundle.js',
  minify: true,
  sourcemap: true,
  target: 'es2020'
})

// 异步构建
const result = await esbuild.build({
  entryPoints: ['src/index.ts', 'src/other.ts'],
  outdir: 'dist',
  bundle: true,
  splitting: true,
  format: 'esm',
  minify: true,
  sourcemap: true,
  metafile: true,
  jsxFactory: 'h',
  jsxFragment: 'Fragment'
})

// 分析元数据
const text = await esbuild.analyzeMetafile(result.metafile)
console.log(text)`
          },
          {
            title: 'SWC 转译配置',
            language: 'json',
            code: `// .swcrc
{
  "env": {
    "targets": "defaults"
  },
  "module": {
    "type": "es6"
  },
  "jsc": {
    "parser": {
      "syntax": "typescript",
      "tsx": true,
      "decorators": true,
      "dynamicImport": true
    },
    "transform": {
      "react": {
        "runtime": "automatic",
        "development": false,
        "useBuiltins": true
      }
    },
    "minify": {
      "compress": {
        "unused": true
      },
      "mangle": true
    }
  },
  "minify": true
}`
          },
          {
            title: '性能对比命令',
            language: 'bash',
            code: `# Webpack 构建
time webpack

# Rollup 构建
time rollup -c

# esbuild 构建
time esbuild src/index.ts --bundle --minify --outfile=dist/bundle.js

# 监测构建时间和输出大小
webpack --analyze

# 使用 bundlesize 监测产物大小
npm install bundlesize --save-dev
# 在 package.json 中配置
{
  "bundlesize": [
    {
      "path": "dist/bundle.js",
      "maxSize": "100kb"
    }
  ]
}`
          }
        ],
      },
      {
        id: 'testing',
        title: '测试',
        summary: '单元测试、组件测试、E2E 测试',
        topics: ['Vitest', 'Jest', 'Vue Test Utils', 'Testing Library', 'Playwright', 'Cypress', 'Storybook', '测试覆盖率', 'Mock 与 Stub'],
        description: '自动化测试是保证代码质量的重要手段。Vitest 是 Vite 原生的单元测试框架，Jest 是最流行的通用测试框架，Playwright 和 Cypress 用于端到端测试。通过合理的测试策略，可以大幅提高开发效率和代码可靠性。',
        useCases: [
          '单元测试验证函数和模块逻辑',
          '组件测试验证 UI 行为',
          'E2E 测试验证完整用户流程',
          '集成测试验证多个模块的交互',
          '性能测试和基准测试'
        ],
        bestPractices: [
          '追求合理的测试覆盖率（80% 左右）',
          '测试应该专注于用户行为而非实现细节',
          '使用 beforeEach/afterEach 管理测试状态',
          '利用 Mock 和 Stub 隔离依赖',
          '集成测试进 CI/CD 流程'
        ],
        codeExamples: [
          {
            title: 'Vitest 单元测试',
            language: 'typescript',
            code: `// sum.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { sum, multiply } from './math'

describe('Math Functions', () => {
  beforeEach(() => {
    console.log('Test started')
  })

  afterEach(() => {
    console.log('Test ended')
  })

  describe('sum', () => {
    it('should add two numbers correctly', () => {
      expect(sum(1, 2)).toBe(3)
      expect(sum(-1, 1)).toBe(0)
    })

    it('should handle floats', () => {
      expect(sum(0.1, 0.2)).toBeCloseTo(0.3)
    })
  })

  describe('multiply', () => {
    it('should multiply two numbers', () => {
      expect(multiply(3, 4)).toBe(12)
      expect(multiply(-2, 3)).toBe(-6)
    })
  })
})`
          },
          {
            title: 'Vue 组件测试',
            language: 'typescript',
            code: `// Counter.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Counter from './Counter.vue'

describe('Counter Component', () => {
  it('renders properly', () => {
    const wrapper = mount(Counter, { props: { initialCount: 5 } })
    expect(wrapper.text()).toContain('Count: 5')
  })

  it('increments count when button is clicked', async () => {
    const wrapper = mount(Counter)
    const button = wrapper.find('button:nth-of-type(1)')
    
    await button.trigger('click')
    expect(wrapper.vm.count).toBe(1)
    
    await button.trigger('click')
    expect(wrapper.vm.count).toBe(2)
  })

  it('emits increment event', async () => {
    const wrapper = mount(Counter)
    await wrapper.find('button').trigger('click')
    
    expect(wrapper.emitted('update:count')).toBeTruthy()
  })

  it('respects v-model binding', async () => {
    const wrapper = mount(Counter, {
      props: {
        modelValue: 10
      }
    })
    
    expect(wrapper.vm.count).toBe(10)
  })
})`
          },
          {
            title: 'Mock 和 Stub',
            language: 'typescript',
            code: `import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchUserData } from './api'

// Mock 整个模块
vi.mock('./api')

describe('User Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch user data', async () => {
    // Mock 返回值
    vi.mocked(fetchUserData).mockResolvedValue({
      id: 1,
      name: 'John Doe'
    })

    const user = await fetchUserData(1)
    expect(user.name).toBe('John Doe')
  })

  it('should handle errors', async () => {
    // Mock 错误
    vi.mocked(fetchUserData).mockRejectedValue(
      new Error('Network error')
    )

    await expect(fetchUserData(999)).rejects.toThrow('Network error')
  })

  it('should call api with correct parameters', async () => {
    vi.mocked(fetchUserData).mockResolvedValue({ id: 1, name: 'Test' })

    await fetchUserData(1)
    
    // 验证调用
    expect(fetchUserData).toHaveBeenCalledWith(1)
    expect(fetchUserData).toHaveBeenCalledTimes(1)
  })
})`
          },
          {
            title: 'Playwright E2E 测试',
            language: 'typescript',
            code: `// tests/e2e/checkout.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000')
  })

  test('should complete checkout', async ({ page }) => {
    // 添加商品到购物车
    await page.click('button:has-text("Add to Cart")')
    
    // 进入购物车
    await page.click('a[href="/cart"]')
    expect(page).toHaveURL('**/cart')
    
    // 结账
    await page.click('button:has-text("Checkout")')
    
    // 填写表单
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="phone"]', '1234567890')
    
    // 提交
    await page.click('button[type="submit"]')
    
    // 验证成功
    await expect(page).toHaveURL('**/success')
    await expect(page.locator('h1')).toContainText('Order Confirmed')
  })

  test('should show errors for invalid inputs', async ({ page }) => {
    await page.goto('http://localhost:3000/checkout')
    
    await page.click('button[type="submit"]')
    
    // 验证错误提示
    await expect(page.locator('.error')).toContainText('Email is required')
  })
})`
          },
          {
            title: 'vitest.config.ts',
            language: 'typescript',
            code: `import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'dist/',
        'coverage/',
        '**/*.d.ts',
        '**/*.config.*'
      ]
    },
    include: ['src/**/*.{test,spec}.{js,ts}'],
    setupFiles: ['./tests/setup.ts'],
    testTimeout: 10000
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
})`
          }
        ],
      },
      {
        id: 'ci-cd',
        title: 'CI/CD',
        summary: '持续集成与持续部署',
        topics: ['GitHub Actions', 'GitLab CI', 'Jenkins', 'CircleCI', 'Travis CI', '自动化测试', '自动化部署', 'Docker 构建', 'Kubernetes'],
        description: 'CI/CD（持续集成/持续部署）是现代软件开发的最佳实践。通过 GitHub Actions、GitLab CI 等工具，可以自动化代码测试、构建和部署流程，提高开发效率并确保代码质量。',
        useCases: [
          '自动化代码测试和检查',
          '自动构建和部署应用',
          '多环境部署（开发、测试、生产）',
          '自动化发布流程和版本管理',
          '性能监控和灰度发布'
        ],
        bestPractices: [
          '将构建和测试纳入 CI 流程',
          '使用环境隔离和部署策略',
          '实现自动化回滚机制',
          '监控部署质量指标',
          '保护敏感信息和密钥管理'
        ],
        codeExamples: [
          {
            title: 'GitHub Actions - 构建和测试',
            language: 'yaml',
            code: `name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [16.x, 18.x]
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: \${{ matrix.node-version }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Type check
      run: npm run type-check
    
    - name: Lint code
      run: npm run lint
    
    - name: Run tests
      run: npm run test:coverage
    
    - name: Upload coverage
      uses: codecov/codecov-action@v3
      with:
        files: ./coverage/lcov.info`
          },
          {
            title: 'GitHub Actions - 构建和发布',
            language: 'yaml',
            code: `name: Deploy

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pages: write
      id-token: write
    
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
    
    - name: Setup Pages
      uses: actions/configure-pages@v3
    
    - name: Upload artifact
      uses: actions/upload-pages-artifact@v2
      with:
        path: './dist'
    
    - name: Deploy to GitHub Pages
      id: deployment
      uses: actions/deploy-pages@v2`
          },
          {
            title: 'GitLab CI/CD 配置',
            language: 'yaml',
            code: `stages:
  - install
  - lint
  - test
  - build
  - deploy

variables:
  NODE_VERSION: '18'

cache:
  paths:
    - node_modules/
    - .npm/
  key:
    files:
      - package-lock.json

install:
  stage: install
  image: node:\${NODE_VERSION}
  script:
    - npm ci
  artifacts:
    paths:
      - node_modules/

lint:
  stage: lint
  image: node:\${NODE_VERSION}
  needs: ['install']
  script:
    - npm run lint
    - npm run type-check

test:
  stage: test
  image: node:\${NODE_VERSION}
  needs: ['install']
  script:
    - npm run test:coverage
  coverage: '/Lines\\s*:\\s(\\d+\\.?\\d*)%/'
  artifacts:
    paths:
      - coverage/

build:
  stage: build
  image: node:\${NODE_VERSION}
  needs: ['lint', 'test']
  script:
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 30 days

deploy_prod:
  stage: deploy
  image: node:\${NODE_VERSION}
  needs: ['build']
  only:
    - main
  environment:
    name: production
    url: https://example.com
  script:
    - npm run build
    - npm install -g vercel
    - vercel --prod --token \$VERCEL_TOKEN`
          },
          {
            title: 'Docker 构建镜像',
            language: 'dockerfile',
            code: `FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build && npm run test

# 生产镜像
FROM node:18-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]`
          },
          {
            title: 'Kubernetes 部署配置',
            language: 'yaml',
            code: `apiVersion: v1
kind: Service
metadata:
  name: my-app-service
spec:
  type: LoadBalancer
  ports:
    - port: 80
      targetPort: 3000
  selector:
    app: my-app

---

apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - name: my-app
        image: my-registry.azurecr.io/my-app:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: VITE_API_URL
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: api-url
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10`
          },
          {
            title: '环境变量和密钥管理',
            language: 'bash',
            code: `# GitHub Actions 中设置密钥
# 通过 Settings > Secrets and variables > Actions 添加

# 在 workflow 中使用
- name: Deploy
  env:
    DEPLOY_KEY: \${{ secrets.DEPLOY_KEY }}
    API_TOKEN: \${{ secrets.API_TOKEN }}
  run: |
    echo \$DEPLOY_KEY | base64 -d > deploy-key.pem
    chmod 600 deploy-key.pem
    ssh -i deploy-key.pem user@host 'cd /app && git pull && npm install && npm run build'

# 使用环境变量文件
- name: Create env file
  run: |
    echo "VITE_API_URL=\${{ secrets.API_URL }}" > .env.production
    echo "VITE_APP_NAME=\${{ secrets.APP_NAME }}" >> .env.production`
          }
        ],
      },
    ],
  },
  {
    id: 'performance',
    title: '性能优化',
    summary: '加载性能、运行时性能、构建优化',
    tags: ['performance', 'optimization'],
    children: [
      {
        id: 'loading-performance',
        title: '加载性能',
        summary: '首屏加载、资源优化、懒加载',
        topics: ['代码分割', '路由懒加载', '组件懒加载', '图片懒加载', 'Preload/Prefetch', '资源压缩', 'CDN 加速', 'HTTP/2 Push', 'Service Worker', 'PWA'],
        description: '加载性能优化是提升用户体验的关键环节。通过代码分割、懒加载、资源压缩等技术，可以显著减少首屏加载时间，提升页面响应速度。',
        useCases: [
          '首屏快速加载优化',
          '大型应用的资源分割',
          '移动端网络优化',
          'SEO 优化和 Core Web Vitals',
          'PWA 离线访问支持'
        ],
        bestPractices: [
          '使用路由懒加载减少初始包体积',
          '图片使用懒加载和响应式图片',
          '合理使用 Preload 和 Prefetch',
          '启用资源压缩和缓存策略',
          '利用 CDN 加速静态资源'
        ],
        codeExamples: [
          {
            title: '路由懒加载',
            language: 'typescript',
            code: `// router/index.ts
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/Home.vue')
    },
    {
      path: '/about',
      name: 'About',
      // 路由级别的代码分割
      // 生成独立的 chunk (about.[hash].js)
      component: () => import(/* webpackChunkName: "about" */ '@/views/About.vue')
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('@/views/Dashboard.vue'),
      children: [
        {
          path: 'settings',
          component: () => import('@/views/Settings.vue')
        }
      ]
    }
  ]
})`
          },
          {
            title: '组件懒加载',
            language: 'vue',
            code: `<template>
  <div>
    <!-- 使用 Suspense 包裹异步组件 -->
    <Suspense>
      <template #default>
        <AsyncComponent />
      </template>
      <template #fallback>
        <div>Loading...</div>
      </template>
    </Suspense>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

// 简单的异步组件
const AsyncComponent = defineAsyncComponent(() =>
  import('./components/HeavyComponent.vue')
)

// 带选项的异步组件
const AsyncComponentWithOptions = defineAsyncComponent({
  loader: () => import('./components/HeavyComponent.vue'),
  loadingComponent: () => import('./components/Loading.vue'),
  errorComponent: () => import('./components/Error.vue'),
  delay: 200,
  timeout: 10000,
  suspensible: false,
  onError(error, retry, fail, attempts) {
    if (attempts <= 3) {
      retry()
    } else {
      fail()
    }
  }
})
</script>`
          },
          {
            title: '图片懒加载',
            language: 'vue',
            code: `<template>
  <div class="image-list">
    <!-- 使用 loading="lazy" 原生懒加载 -->
    <img
      v-for="img in images"
      :key="img.id"
      :src="img.url"
      :alt="img.title"
      loading="lazy"
      decoding="async"
    />
    
    <!-- 使用 IntersectionObserver 自定义懒加载 -->
    <div v-for="item in lazyImages" :key="item.id" class="lazy-image">
      <img
        :data-src="item.url"
        :alt="item.title"
        ref="lazyImgRefs"
        class="lazy"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const lazyImgRefs = ref<HTMLImageElement[]>([])
let observer: IntersectionObserver

onMounted(() => {
  // 使用 IntersectionObserver 实现懒加载
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement
        const src = img.dataset.src
        if (src) {
          img.src = src
          img.classList.remove('lazy')
          observer.unobserve(img)
        }
      }
    })
  }, {
    rootMargin: '50px'
  })

  lazyImgRefs.value.forEach(img => {
    if (img) observer.observe(img)
  })
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>`
          },
          {
            title: 'Preload 和 Prefetch',
            language: 'html',
            code: `<!-- index.html -->
<!DOCTYPE html>
<html>
<head>
  <!-- Preload 关键资源 -->
  <link rel="preload" href="/fonts/main.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/css/critical.css" as="style">
  <link rel="preload" href="/js/main.js" as="script">
  
  <!-- Prefetch 未来可能需要的资源 -->
  <link rel="prefetch" href="/images/hero-lg.jpg">
  <link rel="prefetch" href="/js/analytics.js">
  
  <!-- Preconnect 预连接到第三方域 -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://api.example.com">
  
  <!-- DNS-Prefetch -->
  <link rel="dns-prefetch" href="https://cdn.example.com">
</head>
<body>
  <div id="app"></div>
</body>
</html>

<!-- 在 Vue 组件中动态添加 -->
<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  // 动态添加 prefetch
  const link = document.createElement('link')
  link.rel = 'prefetch'
  link.href = '/data/future-page.json'
  document.head.appendChild(link)
})
</script>`
          },
          {
            title: '响应式图片',
            language: 'html',
            code: `<!-- 使用 srcset 和 sizes 实现响应式图片 -->
<img
  src="/images/small.jpg"
  srcset="
    /images/small.jpg 480w,
    /images/medium.jpg 768w,
    /images/large.jpg 1200w
  "
  sizes="
    (max-width: 480px) 100vw,
    (max-width: 768px) 50vw,
    33vw
  "
  alt="Responsive image"
  loading="lazy"
/>

<!-- 使用 picture 元素支持不同格式 -->
<picture>
  <source
    type="image/webp"
    srcset="/images/hero.webp 1x, /images/hero@2x.webp 2x"
  />
  <source
    type="image/jpeg"
    srcset="/images/hero.jpg 1x, /images/hero@2x.jpg 2x"
  />
  <img src="/images/hero.jpg" alt="Hero image" loading="lazy" />
</picture>`
          },
          {
            title: 'Service Worker 缓存',
            language: 'javascript',
            code: `// sw.js - Service Worker
const CACHE_NAME = 'v1'
const urlsToCache = [
  '/',
  '/css/main.css',
  '/js/main.js',
  '/images/logo.png'
]

// 安装 Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  )
})

// 拦截请求
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 缓存命中，返回缓存
        if (response) {
          return response
        }
        
        // 发起网络请求
        return fetch(event.request).then(response => {
          // 检查响应是否有效
          if (!response || response.status !== 200) {
            return response
          }
          
          // 克隆响应
          const responseToCache = response.clone()
          
          // 缓存新资源
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache)
            })
          
          return response
        })
      })
  )
})

// 清理旧缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})`
          }
        ],
      },
      {
        id: 'runtime-performance',
        title: '运行时性能',
        summary: 'Vue 性能优化、虚拟列表、缓存策略',
        topics: ['v-once/v-memo', 'KeepAlive 缓存', 'computed vs watch', '虚拟滚动', '防抖节流', 'Web Worker', 'requestIdleCallback', 'IntersectionObserver'],
        description: '运行时性能优化关注应用运行过程中的响应速度和流畅度。通过合理使用 Vue 的优化指令、虚拟滚动、防抖节流等技术，可以提升应用的交互体验。',
        useCases: [
          '大数据列表的渲染优化',
          '复杂组件的性能提升',
          '频繁交互的响应优化',
          '长列表的滚动性能',
          '计算密集任务的处理'
        ],
        bestPractices: [
          '使用 v-memo 缓存组件渲染结果',
          '对大列表使用虚拟滚动',
          '合理使用 computed 代替 watch',
          '使用 KeepAlive 缓存组件状态',
          '对高频事件使用防抖或节流'
        ],
        codeExamples: [
          {
            title: 'v-once 和 v-memo 优化',
            language: 'vue',
            code: `<template>
  <div>
    <!-- v-once: 只渲染一次，后续更新跳过 -->
    <div v-once>
      <h1>{{ title }}</h1>
      <p>这部分内容只渲染一次</p>
    </div>
    
    <!-- v-memo: 条件缓存，只在依赖变化时更新 -->
    <div v-memo="[item.id, item.isSelected]">
      <p>{{ item.title }}</p>
      <p>{{ item.description }}</p>
    </div>
    
    <!-- 列表渲染中使用 v-memo -->
    <div
      v-for="item in list"
      :key="item.id"
      v-memo="[item.id === selected]"
    >
      <p>{{ item.name }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const title = ref('Static Title')
const selected = ref(1)
const list = ref([
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' }
])
</script>`
          },
          {
            title: 'KeepAlive 组件缓存',
            language: 'vue',
            code: `<template>
  <div>
    <!-- 基础用法 -->
    <KeepAlive>
      <component :is="currentView" />
    </KeepAlive>
    
    <!-- 指定缓存的组件 -->
    <KeepAlive :include="['ComponentA', 'ComponentB']">
      <component :is="currentView" />
    </KeepAlive>
    
    <!-- 排除某些组件 -->
    <KeepAlive :exclude="['ComponentC']">
      <component :is="currentView" />
    </KeepAlive>
    
    <!-- 限制缓存数量 -->
    <KeepAlive :max="10">
      <component :is="currentView" />
    </KeepAlive>
    
    <!-- 在路由中使用 -->
    <router-view v-slot="{ Component }">
      <KeepAlive :include="cachedViews">
        <component :is="Component" />
      </KeepAlive>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import { ref, onActivated, onDeactivated } from 'vue'

const currentView = ref('ComponentA')
const cachedViews = ref(['Home', 'Dashboard'])

// 组件激活时调用
onActivated(() => {
  console.log('Component activated')
})

// 组件停用时调用
onDeactivated(() => {
  console.log('Component deactivated')
})
</script>`
          },
          {
            title: 'computed vs watch 性能对比',
            language: 'typescript',
            code: `import { ref, computed, watch } from 'vue'

// ❌ 不推荐：使用 watch 计算派生值
const firstName = ref('John')
const lastName = ref('Doe')
const fullName = ref('')

watch([firstName, lastName], ([first, last]) => {
  fullName.value = \`\${first} \${last}\`
})

// ✅ 推荐：使用 computed 计算派生值
const fullNameComputed = computed(() => {
  return \`\${firstName.value} \${lastName.value}\`
})

// computed 会自动缓存，只在依赖变化时重新计算
const expensiveValue = computed(() => {
  console.log('Computing expensive value...')
  // 复杂计算
  return someExpensiveOperation()
})

// watch 用于副作用
watch(fullName, (newVal) => {
  // 执行副作用，如 API 调用
  console.log('Name changed:', newVal)
  saveToServer(newVal)
})`
          },
          {
            title: '虚拟滚动实现',
            language: 'vue',
            code: `<template>
  <div class="virtual-list" ref="containerRef" @scroll="handleScroll">
    <div class="virtual-list-phantom" :style="{ height: totalHeight + 'px' }"></div>
    <div class="virtual-list-content" :style="{ transform: \`translateY(\${offset}px)\` }">
      <div
        v-for="item in visibleData"
        :key="item.id"
        class="virtual-list-item"
        :style="{ height: itemHeight + 'px' }"
      >
        <slot :item="item"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Props {
  items: any[]
  itemHeight: number
  visibleCount?: number
}

const props = withDefaults(defineProps<Props>(), {
  visibleCount: 10
})

const containerRef = ref<HTMLElement>()
const scrollTop = ref(0)

// 计算总高度
const totalHeight = computed(() => props.items.length * props.itemHeight)

// 计算开始索引
const startIndex = computed(() => Math.floor(scrollTop.value / props.itemHeight))

// 计算结束索引
const endIndex = computed(() => startIndex.value + props.visibleCount)

// 计算可见数据
const visibleData = computed(() => {
  return props.items.slice(startIndex.value, endIndex.value)
})

// 计算偏移量
const offset = computed(() => startIndex.value * props.itemHeight)

// 滚动处理
const handleScroll = (e: Event) => {
  scrollTop.value = (e.target as HTMLElement).scrollTop
}
</script>

<style scoped>
.virtual-list {
  height: 400px;
  overflow-y: auto;
  position: relative;
}

.virtual-list-phantom {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  z-index: -1;
}

.virtual-list-content {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
}
</style>`
          },
          {
            title: '防抖和节流',
            language: 'typescript',
            code: `// 防抖：延迟执行，只执行最后一次
function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null
  
  return function(this: any, ...args: Parameters<T>) {
    if (timer) clearTimeout(timer)
    
    timer = setTimeout(() => {
      fn.apply(this, args)
      timer = null
    }, delay)
  }
}

// 节流：固定时间内只执行一次
function throttle<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastTime = 0
  
  return function(this: any, ...args: Parameters<T>) {
    const now = Date.now()
    
    if (now - lastTime >= delay) {
      fn.apply(this, args)
      lastTime = now
    }
  }
}

// 在 Vue 中使用
import { ref } from 'vue'

const searchQuery = ref('')

// 防抖搜索
const handleSearch = debounce((query: string) => {
  console.log('Searching for:', query)
  // 发起 API 请求
}, 300)

// 节流滚动
const handleScroll = throttle((e: Event) => {
  console.log('Scroll position:', (e.target as Element).scrollTop)
}, 100)

// 在模板中使用
// <input @input="handleSearch($event.target.value)" />
// <div @scroll="handleScroll">...</div>`
          },
          {
            title: 'Web Worker 处理密集计算',
            language: 'typescript',
            code: `// worker.ts
self.onmessage = (e: MessageEvent) => {
  const { type, data } = e.data
  
  if (type === 'HEAVY_COMPUTATION') {
    // 执行密集计算
    const result = performHeavyComputation(data)
    self.postMessage({ type: 'RESULT', result })
  }
}

function performHeavyComputation(data: number[]): number {
  // 模拟复杂计算
  return data.reduce((sum, num) => sum + Math.sqrt(num), 0)
}

// main.ts - 在 Vue 组件中使用
import { ref, onMounted, onUnmounted } from 'vue'

export default {
  setup() {
    const result = ref<number>(0)
    let worker: Worker | null = null
    
    onMounted(() => {
      worker = new Worker(new URL('./worker.ts', import.meta.url))
      
      worker.onmessage = (e: MessageEvent) => {
        if (e.data.type === 'RESULT') {
          result.value = e.data.result
        }
      }
    })
    
    const compute = (data: number[]) => {
      worker?.postMessage({ type: 'HEAVY_COMPUTATION', data })
    }
    
    onUnmounted(() => {
      worker?.terminate()
    })
    
    return { result, compute }
  }
}`
          },
          {
            title: 'requestIdleCallback 优化',
            language: 'typescript',
            code: `// 使用 requestIdleCallback 执行低优先级任务
function scheduleIdleTask(task: () => void) {
  if ('requestIdleCallback' in window) {
    requestIdleCallback((deadline) => {
      // 只在浏览器空闲时执行
      if (deadline.timeRemaining() > 0) {
        task()
      } else {
        // 重新调度
        scheduleIdleTask(task)
      }
    })
  } else {
    // 降级方案
    setTimeout(task, 1)
  }
}

// 在 Vue 中使用
import { onMounted } from 'vue'

onMounted(() => {
  // 高优先级任务立即执行
  renderCriticalContent()
  
  // 低优先级任务延迟执行
  scheduleIdleTask(() => {
    loadAnalytics()
  })
  
  scheduleIdleTask(() => {
    preloadImages()
  })
})

// 批量处理任务
function processBatch(items: any[], processor: (item: any) => void) {
  let index = 0
  
  function processBatchIdleCallback(deadline: IdleDeadline) {
    while (index < items.length && deadline.timeRemaining() > 0) {
      processor(items[index])
      index++
    }
    
    if (index < items.length) {
      requestIdleCallback(processBatchIdleCallback)
    }
  }
  
  requestIdleCallback(processBatchIdleCallback)
}`
          }
        ],
      },
      {
        id: 'core-web-vitals',
        title: 'Core Web Vitals',
        summary: 'LCP、FID、CLS 性能指标',
        topics: ['LCP 最大内容绘制', 'FID 首次输入延迟', 'CLS 累积布局偏移', 'TTFB', 'FCP', 'TTI', 'Lighthouse', 'PageSpeed Insights'],
        description: 'Core Web Vitals 是 Google 提出的三个核心性能指标：LCP（最大内容绘制）、FID（首次输入延迟）和 CLS（累积布局偏移）。这些指标直接影响用户体验和 SEO 排名。',
        useCases: [
          'SEO 优化和搜索排名提升',
          '用户体验质量评估',
          '性能基准测试和监控',
          '页面加载性能诊断',
          'A/B 测试性能对比'
        ],
        bestPractices: [
          'LCP 目标：2.5 秒内完成',
          'FID 目标：100 毫秒内响应',
          'CLS 目标：0.1 以下',
          '使用 web-vitals 库监控指标',
          '定期使用 Lighthouse 审计'
        ],
        codeExamples: [
          {
            title: '使用 web-vitals 监控',
            language: 'typescript',
            code: `// 安装: npm install web-vitals
import { onCLS, onFID, onLCP, onFCP, onTTFB } from 'web-vitals'

// 监控 LCP (Largest Contentful Paint)
onLCP((metric) => {
  console.log('LCP:', metric)
  // 上报到服务器
  sendToAnalytics({
    name: 'LCP',
    value: metric.value,
    rating: metric.rating, // 'good', 'needs-improvement', 'poor'
    delta: metric.delta,
    id: metric.id
  })
})

// 监控 FID (First Input Delay)
onFID((metric) => {
  console.log('FID:', metric)
  sendToAnalytics({
    name: 'FID',
    value: metric.value,
    rating: metric.rating
  })
})

// 监控 CLS (Cumulative Layout Shift)
onCLS((metric) => {
  console.log('CLS:', metric)
  sendToAnalytics({
    name: 'CLS',
    value: metric.value,
    rating: metric.rating
  })
})

// 监控 FCP (First Contentful Paint)
onFCP((metric) => {
  console.log('FCP:', metric)
})

// 监控 TTFB (Time to First Byte)
onTTFB((metric) => {
  console.log('TTFB:', metric)
})

function sendToAnalytics(metric: any) {
  // 发送到 Google Analytics
  if (typeof gtag !== 'undefined') {
    gtag('event', metric.name, {
      value: Math.round(metric.value),
      event_category: 'Web Vitals',
      event_label: metric.id,
      non_interaction: true
    })
  }
  
  // 或发送到自定义分析服务
  fetch('/api/analytics', {
    method: 'POST',
    body: JSON.stringify(metric),
    headers: { 'Content-Type': 'application/json' }
  })
}`
          },
          {
            title: '优化 LCP',
            language: 'html',
            code: `<!-- 优化 LCP 的几种方法 -->

<!-- 1. 预加载关键资源 -->
<link rel="preload" as="image" href="/hero-image.jpg">
<link rel="preload" as="font" href="/fonts/main.woff2" crossorigin>

<!-- 2. 优先加载首屏内容 -->
<img 
  src="/hero.jpg" 
  alt="Hero" 
  fetchpriority="high"
  decoding="async"
/>

<!-- 3. 使用响应式图片 -->
<img
  srcset="
    /images/hero-320w.jpg 320w,
    /images/hero-640w.jpg 640w,
    /images/hero-1280w.jpg 1280w
  "
  sizes="(max-width: 640px) 100vw, 640px"
  src="/images/hero-640w.jpg"
  alt="Hero"
/>

<!-- 4. 内联关键 CSS -->
<style>
  /* 首屏关键样式内联在 head 中 */
  .hero { background: #000; height: 100vh; }
</style>

<!-- 5. 避免渲染阻塞的 JavaScript -->
<script src="/app.js" defer></script>
<script src="/analytics.js" async></script>`
          },
          {
            title: '优化 FID',
            language: 'typescript',
            code: `// 优化 FID (首次输入延迟)

// 1. 代码分割，减少主线程阻塞
import { defineAsyncComponent } from 'vue'

const HeavyComponent = defineAsyncComponent(() =>
  import('./HeavyComponent.vue')
)

// 2. 延迟执行非关键 JavaScript
function deferNonCriticalJS() {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      loadAnalytics()
      loadChatWidget()
    })
  } else {
    setTimeout(() => {
      loadAnalytics()
      loadChatWidget()
    }, 1000)
  }
}

// 3. 使用 Web Worker 处理复杂计算
const worker = new Worker(new URL('./compute.worker.ts', import.meta.url))

worker.postMessage({ data: largeDataset })
worker.onmessage = (e) => {
  console.log('Computation result:', e.data)
}

// 4. 优化事件处理器
import { throttle } from 'lodash-es'

const handleScroll = throttle((e: Event) => {
  // 处理滚动
}, 100)

// 5. 避免长任务
async function processLargeDataset(items: any[]) {
  const chunkSize = 50
  
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize)
    processChunk(chunk)
    
    // 让出主线程
    await new Promise(resolve => setTimeout(resolve, 0))
  }
}`
          },
          {
            title: '优化 CLS',
            language: 'vue',
            code: `<template>
  <div>
    <!-- 1. 为图片设置明确的尺寸 -->
    <img 
      src="/image.jpg" 
      alt="Example"
      width="800"
      height="600"
      style="max-width: 100%; height: auto;"
    />
    
    <!-- 2. 为动态内容预留空间 -->
    <div class="ad-placeholder" style="min-height: 250px;">
      <AdComponent v-if="adLoaded" />
    </div>
    
    <!-- 3. 使用 CSS aspect-ratio -->
    <div class="video-container" style="aspect-ratio: 16 / 9;">
      <iframe src="..." />
    </div>
    
    <!-- 4. 避免在已存在内容上方插入 -->
    <div>
      <!-- 固定位置的 banner -->
      <div class="banner" style="position: fixed; top: 0;">
        Banner content
      </div>
      
      <!-- 主内容有足够的 padding-top -->
      <div class="content" style="padding-top: 60px;">
        Main content
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 使用 font-display 避免字体加载导致的布局偏移 */
@font-face {
  font-family: 'CustomFont';
  src: url('/fonts/custom.woff2') format('woff2');
  font-display: swap; /* 或 optional */
}

/* 为懒加载图片设置占位 */
.lazy-image {
  background: #f0f0f0;
  min-height: 400px;
}

/* 为动态内容预留空间 */
.dynamic-content {
  min-height: 200px;
}
</style>`
          },
          {
            title: 'Performance API 使用',
            language: 'typescript',
            code: `// 使用 Performance API 测量性能

// 1. 测量导航时间
const navTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming

console.log('DNS 查询时间:', navTiming.domainLookupEnd - navTiming.domainLookupStart)
console.log('TCP 连接时间:', navTiming.connectEnd - navTiming.connectStart)
console.log('请求时间:', navTiming.responseStart - navTiming.requestStart)
console.log('响应时间:', navTiming.responseEnd - navTiming.responseStart)
console.log('DOM 解析时间:', navTiming.domComplete - navTiming.domInteractive)
console.log('页面加载时间:', navTiming.loadEventEnd - navTiming.fetchStart)

// 2. 使用 PerformanceObserver 监控
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log('Resource:', entry.name, 'Duration:', entry.duration)
  }
})

observer.observe({ entryTypes: ['resource', 'navigation', 'paint'] })

// 3. 自定义性能标记
performance.mark('start-render')

// 执行操作
renderComponent()

performance.mark('end-render')

// 测量两个标记之间的时间
performance.measure('component-render', 'start-render', 'end-render')

const measure = performance.getEntriesByName('component-render')[0]
console.log('Component render time:', measure.duration)

// 4. 监控长任务
const longTaskObserver = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.warn('Long task detected:', entry.duration, 'ms')
    // 上报长任务
    sendToAnalytics({
      type: 'long-task',
      duration: entry.duration,
      startTime: entry.startTime
    })
  }
})

longTaskObserver.observe({ entryTypes: ['longtask'] })`
          },
          {
            title: 'Lighthouse CI 集成',
            language: 'yaml',
            code: `# .github/workflows/lighthouse.yml
name: Lighthouse CI

on:
  pull_request:
    branches: [ main ]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v9
        with:
          urls: |
            http://localhost:3000
            http://localhost:3000/about
          configPath: './lighthouserc.json'
          uploadArtifacts: true
          temporaryPublicStorage: true

# lighthouserc.json
{
  "ci": {
    "collect": {
      "numberOfRuns": 3,
      "startServerCommand": "npm run preview",
      "url": ["http://localhost:3000"]
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.9 }],
        "categories:best-practices": ["error", { "minScore": 0.9 }],
        "categories:seo": ["error", { "minScore": 0.9 }]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}`
          }
        ],
      },
      {
        id: 'monitoring',
        title: '性能监控',
        summary: '前端监控、错误追踪、用户行为分析',
        topics: ['Performance API', 'PerformanceObserver', 'Sentry 错误监控', '埋点系统', '用户行为追踪', 'Web Vitals 上报', 'Source Map', 'Google Analytics'],
        description: '前端监控是保证应用质量的重要手段。通过性能监控、错误追踪、用户行为分析等技术，可以及时发现和解决问题，持续优化用户体验。',
        useCases: [
          '实时监控应用性能指标',
          '捕获和追踪线上错误',
          '分析用户行为和使用习惯',
          '评估新功能的用户接受度',
          'A/B 测试和数据分析'
        ],
        bestPractices: [
          '建立完善的错误上报机制',
          '监控关键性能指标和业务指标',
          '使用 Source Map 定位线上错误',
          '合理设置采样率避免数据过载',
          '保护用户隐私和敏感信息'
        ],
        codeExamples: [
          {
            title: 'Sentry 错误监控集成',
            language: 'typescript',
            code: `// main.ts
import { createApp } from 'vue'
import * as Sentry from '@sentry/vue'
import App from './App.vue'

const app = createApp(App)

Sentry.init({
  app,
  dsn: 'https://your-dsn@sentry.io/project-id',
  environment: import.meta.env.MODE,
  release: import.meta.env.VITE_APP_VERSION,
  
  // 设置采样率
  tracesSampleRate: 0.1,
  
  // 捕获错误类型
  integrations: [
    new Sentry.BrowserTracing({
      routingInstrumentation: Sentry.vueRouterInstrumentation(router),
      tracingOrigins: ['localhost', 'api.example.com', /^\\//]
    }),
    new Sentry.Replay({
      maskAllText: false,
      blockAllMedia: false
    })
  ],
  
  // 过滤不需要上报的错误
  beforeSend(event, hint) {
    const error = hint.originalException
    
    // 忽略某些错误
    if (error && error.message?.includes('ResizeObserver')) {
      return null
    }
    
    return event
  },
  
  // 添加用户上下文
  beforeBreadcrumb(breadcrumb) {
    if (breadcrumb.category === 'console') {
      return null
    }
    return breadcrumb
  }
})

// 手动捕获错误
try {
  riskyOperation()
} catch (error) {
  Sentry.captureException(error)
}

// 设置用户信息
Sentry.setUser({
  id: '12345',
  username: 'john.doe',
  email: 'john@example.com'
})

// 添加面包屑
Sentry.addBreadcrumb({
  category: 'auth',
  message: 'User logged in',
  level: 'info'
})`
          },
          {
            title: '自定义性能监控',
            language: 'typescript',
            code: `// performanceMonitor.ts
interface PerformanceMetric {
  name: string
  value: number
  timestamp: number
  url: string
  userAgent: string
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = []
  private batchSize = 10
  private flushInterval = 30000 // 30秒
  private timer: number | null = null

  constructor() {
    this.init()
  }

  private init() {
    // 监听页面性能
    this.observePerformance()
    
    // 定期上报
    this.startAutoFlush()
    
    // 页面卸载时上报
    window.addEventListener('beforeunload', () => {
      this.flush()
    })
  }

  private observePerformance() {
    // 监听资源加载
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.recordMetric({
          name: \`resource:\${entry.name}\`,
          value: entry.duration,
          timestamp: Date.now(),
          url: window.location.href,
          userAgent: navigator.userAgent
        })
      }
    })

    observer.observe({ 
      entryTypes: ['resource', 'navigation', 'paint', 'longtask'] 
    })
  }

  recordMetric(metric: PerformanceMetric) {
    this.metrics.push(metric)
    
    // 达到批次大小立即上报
    if (this.metrics.length >= this.batchSize) {
      this.flush()
    }
  }

  private startAutoFlush() {
    this.timer = window.setInterval(() => {
      if (this.metrics.length > 0) {
        this.flush()
      }
    }, this.flushInterval)
  }

  private async flush() {
    if (this.metrics.length === 0) return

    const data = [...this.metrics]
    this.metrics = []

    try {
      // 使用 sendBeacon 确保数据发送
      const blob = new Blob([JSON.stringify(data)], {
        type: 'application/json'
      })
      
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/performance', blob)
      } else {
        await fetch('/api/performance', {
          method: 'POST',
          body: blob,
          keepalive: true
        })
      }
    } catch (error) {
      console.error('Failed to send metrics:', error)
    }
  }

  destroy() {
    if (this.timer) {
      clearInterval(this.timer)
    }
    this.flush()
  }
}

export const performanceMonitor = new PerformanceMonitor()`
          },
          {
            title: '用户行为埋点',
            language: 'typescript',
            code: `// analytics.ts
interface TrackEvent {
  event: string
  category: string
  properties?: Record<string, any>
  timestamp: number
  userId?: string
  sessionId: string
}

class Analytics {
  private sessionId: string
  private userId?: string
  private queue: TrackEvent[] = []

  constructor() {
    this.sessionId = this.generateSessionId()
    this.init()
  }

  private generateSessionId(): string {
    return \`\${Date.now()}-\${Math.random().toString(36).substr(2, 9)}\`
  }

  private init() {
    // 自动追踪页面浏览
    this.trackPageView()
    
    // 监听路由变化
    window.addEventListener('popstate', () => {
      this.trackPageView()
    })
  }

  setUserId(userId: string) {
    this.userId = userId
  }

  // 追踪页面浏览
  trackPageView() {
    this.track('page_view', 'navigation', {
      url: window.location.href,
      title: document.title,
      referrer: document.referrer
    })
  }

  // 追踪点击事件
  trackClick(element: string, properties?: Record<string, any>) {
    this.track('click', 'interaction', {
      element,
      ...properties
    })
  }

  // 追踪自定义事件
  track(event: string, category: string, properties?: Record<string, any>) {
    const trackEvent: TrackEvent = {
      event,
      category,
      properties,
      timestamp: Date.now(),
      userId: this.userId,
      sessionId: this.sessionId
    }

    this.queue.push(trackEvent)
    
    // 批量发送
    if (this.queue.length >= 5) {
      this.flush()
    }
  }

  private async flush() {
    if (this.queue.length === 0) return

    const events = [...this.queue]
    this.queue = []

    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(events)
      })
    } catch (error) {
      console.error('Analytics flush failed:', error)
      // 重新加入队列
      this.queue.unshift(...events)
    }
  }
}

export const analytics = new Analytics()

// 在 Vue 组件中使用
import { onMounted } from 'vue'

onMounted(() => {
  analytics.track('component_mounted', 'lifecycle', {
    component: 'Dashboard'
  })
})

// 追踪按钮点击
const handleClick = () => {
  analytics.trackClick('submit_button', {
    form: 'contact',
    value: formData.value
  })
}`
          },
          {
            title: 'Vue 指令自动埋点',
            language: 'typescript',
            code: `// directives/track.ts
import { Directive } from 'vue'
import { analytics } from '@/utils/analytics'

export const vTrack: Directive = {
  mounted(el, binding) {
    const { value, modifiers } = binding
    
    // 默认追踪点击事件
    const eventType = modifiers.click ? 'click' :
                      modifiers.view ? 'view' :
                      'click'

    if (eventType === 'click') {
      el.addEventListener('click', () => {
        analytics.track('element_click', 'interaction', {
          element: value.element || el.tagName,
          label: value.label,
          ...value.properties
        })
      })
    } else if (eventType === 'view') {
      // 使用 IntersectionObserver 追踪曝光
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            analytics.track('element_view', 'impression', {
              element: value.element || el.tagName,
              label: value.label,
              ...value.properties
            })
            observer.unobserve(el)
          }
        })
      })
      
      observer.observe(el)
    }
  }
}

// 在 main.ts 注册
app.directive('track', vTrack)

// 在组件中使用
<template>
  <!-- 追踪点击 -->
  <button 
    v-track="{ 
      element: 'purchase_button',
      label: 'Buy Now',
      properties: { price: 99.99 }
    }"
  >
    Buy Now
  </button>

  <!-- 追踪曝光 -->
  <div 
    v-track.view="{ 
      element: 'product_card',
      label: product.name,
      properties: { id: product.id }
    }"
  >
    {{ product.name }}
  </div>
</template>`
          },
          {
            title: 'Source Map 错误定位',
            language: 'typescript',
            code: `// vite.config.ts - 生成 Source Map
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    sourcemap: true, // 生产环境也生成 sourcemap
    // 或使用 hidden source map（不在生成的文件中引用）
    // sourcemap: 'hidden'
  }
})

// 服务端解析 Source Map
import { SourceMapConsumer } from 'source-map'
import fs from 'fs'

async function parseError(error: any) {
  const { line, column, file } = error
  
  // 读取 source map 文件
  const mapContent = fs.readFileSync(\`./dist/\${file}.map\`, 'utf-8')
  
  const consumer = await new SourceMapConsumer(JSON.parse(mapContent))
  
  // 获取原始位置
  const original = consumer.originalPositionFor({
    line: line,
    column: column
  })
  
  console.log('Original position:', {
    source: original.source,
    line: original.line,
    column: original.column,
    name: original.name
  })
  
  consumer.destroy()
}

// 在错误上报时包含 stack trace
window.addEventListener('error', (event) => {
  const errorInfo = {
    message: event.message,
    filename: event.filename,
    line: event.lineno,
    column: event.colno,
    stack: event.error?.stack
  }
  
  // 上报到服务器进行 source map 解析
  fetch('/api/errors', {
    method: 'POST',
    body: JSON.stringify(errorInfo)
  })
})`
          },
          {
            title: 'Google Analytics 4 集成',
            language: 'typescript',
            code: `// plugins/gtag.ts
export function setupGoogleAnalytics(measurementId: string) {
  // 加载 GA4 脚本
  const script = document.createElement('script')
  script.async = true
  script.src = \`https://www.googletagmanager.com/gtag/js?id=\${measurementId}\`
  document.head.appendChild(script)

  // 初始化
  window.dataLayer = window.dataLayer || []
  function gtag(...args: any[]) {
    window.dataLayer.push(arguments)
  }
  
  gtag('js', new Date())
  gtag('config', measurementId, {
    send_page_view: false // 手动控制页面浏览
  })

  return gtag
}

// 在 Vue Router 中追踪页面浏览
import { useRouter } from 'vue-router'

const router = useRouter()
const gtag = setupGoogleAnalytics('G-XXXXXXXXXX')

router.afterEach((to) => {
  gtag('event', 'page_view', {
    page_title: to.meta.title || to.name,
    page_path: to.path,
    page_location: window.location.href
  })
})

// 追踪自定义事件
function trackEvent(eventName: string, params?: Record<string, any>) {
  gtag('event', eventName, params)
}

// 使用示例
trackEvent('purchase', {
  transaction_id: 'T12345',
  value: 99.99,
  currency: 'USD',
  items: [
    {
      item_id: 'SKU_123',
      item_name: 'Product Name',
      price: 99.99,
      quantity: 1
    }
  ]
})

trackEvent('sign_up', {
  method: 'Google'
})`
          }
        ],
      },
    ],
  },
  {
    id: 'data-management',
    title: '数据管理',
    summary: 'HTTP 请求、数据缓存、实时通信',
    tags: ['http', 'data', 'api'],
    children: [
      {
        id: 'http-client',
        title: 'HTTP 客户端',
        summary: 'Axios、Fetch、请求封装',
        description: 'Axios 是一个基于 Promise 的 HTTP 客户端，支持浏览器和 Node.js。它提供了拦截器、取消请求、自动转换 JSON 等功能。Fetch API 是现代浏览器原生的网络请求接口，更轻量但功能相对简单。',
        topics: ['Axios 封装', 'Fetch API', '请求拦截器', '响应拦截器', '取消请求', '超时处理', '重试机制', 'useAxios/useFetch'],
        useCases: [
          'RESTful API 请求',
          '文件上传和下载',
          '请求统一处理',
          '错误统一拦截'
        ],
        bestPractices: [
          '封装统一的请求实例',
          '在拦截器中处理 token 和错误',
          '使用 AbortController 取消请求',
          '合理设置超时时间'
        ],
        codeExamples: [
          {
            title: 'Axios 封装',
            code: `import axios from 'axios'

// 创建实例
const request = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = \`Bearer \${token}\`
    }
    return config
  },
  error => Promise.reject(error)
)

// 响应拦截器
request.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response?.status === 401) {
      // 跳转登录
    }
    return Promise.reject(error)
  }
)

export default request`
          },
          {
            title: '使用示例',
            code: `import request from '@/utils/request'

// GET 请求
export function getUser(id: string) {
  return request.get(\`/user/\${id}\`)
}

// POST 请求
export function createUser(data: any) {
  return request.post('/user', data)
}

// 文件上传
export function uploadFile(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  return request.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}`
          }
        ],
        resources: [
          { title: 'Axios 官网', url: 'https://axios-http.com/' },
          { title: 'Axios 中文文档', url: 'https://www.axios-http.cn/' }
        ]
      },
      {
        id: 'data-fetching',
        title: '数据获取',
        summary: 'VueUse、TanStack Query、SWR',
        topics: ['@vueuse/core', 'VueQuery (TanStack)', 'SWR for Vue', '缓存策略', '乐观更新', '无限滚动', '轮询'],
      },
      {
        id: 'graphql',
        title: 'GraphQL',
        summary: 'Apollo Client、Villus、GraphQL 查询',
        topics: ['GraphQL 基础', 'Apollo Client Vue', 'Villus', 'urql', 'Query/Mutation', 'Fragment', 'Cache 管理'],
      },
      {
        id: 'realtime',
        title: '实时通信',
        summary: 'WebSocket、Server-Sent Events、轮询',
        topics: ['WebSocket', 'Socket.io', 'SSE Server-Sent Events', '长轮询', '心跳机制', '断线重连'],
      },
      {
        id: 'local-storage',
        title: '本地存储',
        summary: 'LocalStorage、IndexedDB、缓存策略',
        topics: ['LocalStorage/SessionStorage', 'IndexedDB', 'Dexie.js', 'localForage', 'Cookie', '缓存策略', '离线存储'],
      },
    ],
  },
  {
    id: 'utils-libraries',
    title: '工具库',
    summary: '常用 JavaScript 工具库',
    tags: ['utils', 'libraries'],
    children: [
      {
        id: 'vueuse',
        title: 'VueUse',
        summary: 'Vue 组合式工具集',
        description: 'VueUse 是一个基于 Vue 组合式 API 的实用工具库，提供了 200+ 个常用的组合式函数。涵盖状态管理、浏览器 API、传感器、动画、网络请求等各个方面。它是 Vue 3 项目的必备工具库。',
        topics: ['@vueuse/core', 'State 状态', 'Browser 浏览器', 'Sensors 传感器', 'Animation 动画', 'Network 网络', 'useLocalStorage', 'useDebounce/useThrottle', 'useMouse/useScroll'],
        useCases: [
          '快速实现常用功能',
          '浏览器 API 封装',
          '响应式数据管理',
          '事件监听和处理'
        ],
        bestPractices: [
          '按需引入需要的组合式函数',
          '结合 TypeScript 获得类型提示',
          '利用 watch 系列函数监听变化'
        ],
        codeExamples: [
          {
            title: '常用组合式函数',
            code: `<script setup>
import { 
  useLocalStorage, 
  useMouse, 
  useDebounce,
  useFetch
} from '@vueuse/core'

// 本地存储
const token = useLocalStorage('token', '')

// 鼠标位置
const { x, y } = useMouse()

// 防抖
const input = ref('')
const debouncedInput = useDebounce(input, 500)

// 网络请求
const { data, error } = useFetch('/api/user').json()
</script>`
          }
        ],
        resources: [
          { title: 'VueUse 官网', url: 'https://vueuse.org/' },
          { title: 'VueUse 函数列表', url: 'https://vueuse.org/functions.html' }
        ]
      },
      {
        id: 'lodash',
        title: 'Lodash / Lodash-es',
        summary: 'JavaScript 实用工具库',
        description: 'Lodash 是一个一致性、模块化、高性能的 JavaScript 实用工具库。提供了数组、对象、字符串、函数等操作方法。lodash-es 是 ES 模块版本，支持 Tree Shaking。',
        topics: ['数组方法', '对象操作', '函数式编程', 'debounce/throttle', 'cloneDeep', 'merge', '按需引入'],
        useCases: [
          '数组和对象的复杂操作',
          '深克隆和对象合并',
          '防抖和节流函数',
          '函数式编程工具'
        ],
        bestPractices: [
          '使用 lodash-es 支持 Tree Shaking',
          '按需引入需要的方法',
          '避免全量引入 lodash'
        ],
        codeExamples: [
          {
            title: '常用方法',
            code: `import { debounce, cloneDeep, merge } from 'lodash-es'

// 防抖
const search = debounce((value) => {
  console.log(value)
}, 300)

// 深克隆
const original = { a: { b: 1 } }
const copy = cloneDeep(original)

// 对象合并
const obj1 = { a: 1 }
const obj2 = { b: 2 }
const result = merge(obj1, obj2)`
          }
        ],
        resources: [
          { title: 'Lodash 官网', url: 'https://lodash.com/' },
          { title: 'Lodash 中文文档', url: 'https://www.lodashjs.com/' }
        ]
      },
      {
        id: 'dayjs',
        title: '日期时间',
        summary: 'Day.js、date-fns 日期处理',
        description: 'Day.js 是一个轻量级的日期处理库，只有 2KB，API 与 Moment.js 兼容。date-fns 是另一个流行的函数式日期工具库，支持 Tree Shaking。',
        topics: ['Day.js', 'date-fns', 'Moment.js', '日期格式化', '时区处理', '相对时间'],
        useCases: [
          '日期格式化和解析',
          '时间计算和比较',
          '相对时间显示',
          '时区转换'
        ],
        bestPractices: [
          '推荐使用 Day.js 而非 Moment.js',
          '按需导入插件',
          '统一日期格式化方法'
        ],
        codeExamples: [
          {
            title: 'Day.js 使用',
            code: `import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

// 启用插件
dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

// 格式化
const date = dayjs('2024-01-01')
date.format('YYYY-MM-DD') // '2024-01-01'

// 相对时间
dayjs().from(dayjs('2024-01-01')) // '2天前'

// 时间计算
dayjs().add(7, 'day')
dayjs().subtract(1, 'month')`
          }
        ],
        resources: [
          { title: 'Day.js 官网', url: 'https://day.js.org/' },
          { title: 'date-fns 官网', url: 'https://date-fns.org/' }
        ]
      },
      {
        id: 'validation',
        title: '表单验证',
        summary: 'Vuelidate、VeeValidate、Yup',
        topics: ['Vuelidate', 'VeeValidate', 'Yup', 'Zod', 'Joi', '自定义验证规则', '异步验证'],
        description: '表单验证是前端开发中的重要环节，确保用户输入的数据符合预期格式和业务规则。现代 Vue3 应用通常使用成熟的验证库来简化验证逻辑。',
        useCases: [
          '用户注册和登录表单验证',
          '复杂多步骤表单验证',
          '动态表单字段验证',
          '异步验证（用户名唯一性检查）',
          '跨字段验证（密码确认）'
        ],
        bestPractices: [
          '前后端双重验证，前端验证提升体验',
          '使用 TypeScript 增强类型安全',
          '提供清晰的错误提示信息',
          '支持国际化错误消息',
          '合理使用防抖减少验证频率'
        ],
        codeExamples: [
          {
            title: 'VeeValidate 4 基础用法',
            language: 'vue',
            code: `<script setup lang="ts">
import { useForm } from 'vee-validate'
import * as yup from 'yup'

// 定义验证规则
const schema = yup.object({
  email: yup.string().required('邮箱必填').email('邮箱格式不正确'),
  password: yup.string().required('密码必填').min(8, '密码至少8位'),
  confirmPassword: yup.string()
    .required('请确认密码')
    .oneOf([yup.ref('password')], '两次密码不一致')
})

const { errors, defineField, handleSubmit } = useForm({
  validationSchema: schema
})

const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')
const [confirmPassword, confirmPasswordAttrs] = defineField('confirmPassword')

const onSubmit = handleSubmit((values) => {
  console.log('表单数据:', values)
})
</script>

<template>
  <form @submit="onSubmit">
    <div>
      <input v-model="email" v-bind="emailAttrs" placeholder="邮箱" />
      <span class="error">{{ errors.email }}</span>
    </div>
    
    <div>
      <input v-model="password" v-bind="passwordAttrs" type="password" placeholder="密码" />
      <span class="error">{{ errors.password }}</span>
    </div>
    
    <div>
      <input v-model="confirmPassword" v-bind="confirmPasswordAttrs" type="password" placeholder="确认密码" />
      <span class="error">{{ errors.confirmPassword }}</span>
    </div>
    
    <button type="submit">提交</button>
  </form>
</template>`
          },
          {
            title: 'Zod Schema 验证',
            language: 'typescript',
            code: `import { z } from 'zod'
import { ref } from 'vue'

// 定义验证 Schema
const userSchema = z.object({
  username: z.string()
    .min(3, '用户名至少3个字符')
    .max(20, '用户名最多20个字符')
    .regex(/^[a-zA-Z0-9_]+$/, '用户名只能包含字母、数字和下划线'),
  
  email: z.string()
    .email('邮箱格式不正确'),
  
  age: z.number()
    .int('年龄必须是整数')
    .min(18, '必须年满18岁')
    .max(100, '年龄不能超过100'),
  
  password: z.string()
    .min(8, '密码至少8位')
    .regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)/, '密码必须包含大小写字母和数字'),
  
  confirmPassword: z.string(),
  
  website: z.string().url('网址格式不正确').optional(),
  
  role: z.enum(['admin', 'user', 'guest'], {
    errorMap: () => ({ message: '角色必须是 admin、user 或 guest' })
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: '两次密码不一致',
  path: ['confirmPassword']
})

// 类型推导
type User = z.infer<typeof userSchema>

// 使用示例
export function useFormValidation() {
  const errors = ref<Record<string, string>>({})

  const validate = (data: unknown) => {
    try {
      const result = userSchema.parse(data)
      errors.value = {}
      return { success: true, data: result }
    } catch (error) {
      if (error instanceof z.ZodError) {
        errors.value = error.errors.reduce((acc, curr) => {
          const path = curr.path.join('.')
          acc[path] = curr.message
          return acc
        }, {} as Record<string, string>)
      }
      return { success: false, errors: errors.value }
    }
  }

  return { validate, errors }
}`
          }
        ],
      },
      {
        id: 'animation',
        title: '动画库',
        summary: 'GSAP、Anime.js、Motion One',
        topics: ['GSAP', 'Anime.js', 'Motion One', 'Lottie', 'Three.js', 'D3.js', 'ECharts', 'Chart.js'],
        description: '动画库为 Web 应用提供流畅、高性能的动画效果，提升用户体验。从简单的过渡动画到复杂的数据可视化，现代动画库提供了丰富的 API 和优秀的性能。',
        useCases: [
          '页面加载和过渡动画',
          '交互反馈和微动效',
          '数据可视化和图表动画',
          '3D 场景和游戏开发',
          '复杂时间轴动画编排'
        ],
        bestPractices: [
          '优先使用 CSS 动画处理简单效果',
          '使用 requestAnimationFrame 优化性能',
          '避免在动画中触发 layout/reflow',
          '合理使用硬件加速（transform/opacity）',
          '提供降级方案和性能优化'
        ],
        codeExamples: [
          {
            title: 'GSAP 基础动画',
            language: 'vue',
            code: `<script setup lang="ts">
import { ref, onMounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const box = ref<HTMLElement>()
const timeline = ref<gsap.core.Timeline>()

onMounted(() => {
  // 基础动画
  gsap.to(box.value, {
    x: 300,
    rotation: 360,
    duration: 2,
    ease: 'power2.inOut'
  })
  
  // 时间轴动画
  timeline.value = gsap.timeline({
    scrollTrigger: {
      trigger: '.container',
      start: 'top center',
      end: 'bottom center',
      scrub: true
    }
  })
  
  timeline.value
    .to('.box1', { x: 400, duration: 1 })
    .to('.box2', { y: 300, duration: 1 }, '<0.5')
    .to('.box3', { rotation: 180, duration: 1 })
})
</script>

<template>
  <div class="container">
    <div ref="box" class="box">动画元素</div>
  </div>
</template>`
          },
          {
            title: 'Lottie JSON 动画',
            language: 'vue',
            code: `<script setup lang="ts">
import { ref, onMounted } from 'vue'
import lottie, { AnimationItem } from 'lottie-web'

const container = ref<HTMLElement>()
const animation = ref<AnimationItem>()
const isPlaying = ref(false)

onMounted(() => {
  animation.value = lottie.loadAnimation({
    container: container.value!,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: '/animations/loading.json'
  })
})

const togglePlay = () => {
  if (isPlaying.value) {
    animation.value?.pause()
  } else {
    animation.value?.play()
  }
  isPlaying.value = !isPlaying.value
}
</script>

<template>
  <div class="lottie-wrapper">
    <div ref="container" class="lottie-container"></div>
    <button @click="togglePlay">
      {{ isPlaying ? '暂停' : '播放' }}
    </button>
  </div>
</template>`
          }
        ],
      },
    ],
  },
  {
    id: 'security',
    title: '安全',
    summary: 'XSS、CSRF、认证授权、数据加密',
    tags: ['security', 'auth'],
    children: [
      {
        id: 'web-security',
        title: 'Web 安全',
        summary: 'XSS、CSRF、SQL 注入防护',
        topics: ['XSS 跨站脚本', 'CSRF 跨站请求伪造', 'SQL 注入', 'CSP 内容安全策略', 'HTTPS', 'Same-Origin Policy', 'CORS 配置'],
      },
      {
        id: 'authentication',
        title: '认证授权',
        summary: 'JWT、OAuth、SSO 单点登录',
        topics: ['JWT Token', 'OAuth 2.0', 'SSO 单点登录', 'Session vs Token', 'Refresh Token', '权限控制', 'RBAC 角色权限'],
      },
      {
        id: 'encryption',
        title: '数据加密',
        summary: '前端加密、HTTPS、敏感数据保护',
        topics: ['crypto-js', 'bcrypt.js', 'HTTPS/TLS', 'RSA/AES 加密', '敏感信息脱敏', 'Content Security Policy'],
      },
    ],
  },
  {
    id: 'deploy',
    title: '部署与运维',
    summary: 'Nginx、Docker、云服务部署',
    tags: ['deploy', 'devops'],
    children: [
      {
        id: 'nginx',
        title: 'Nginx',
        summary: 'Nginx 配置、反向代理、负载均衡',
        topics: ['Nginx 安装', '静态资源服务', '反向代理', 'Gzip 压缩', '缓存配置', 'HTTPS 配置', '负载均衡'],
        description: 'Nginx 是高性能的 HTTP 和反向代理服务器。它可以作为静态资源服务器、反向代理、负载均衡器使用，是前端应用部署的常用工具。',
        useCases: [
          '静态网站和 SPA 应用部署',
          'API 反向代理和负载均衡',
          'HTTPS 证书配置和 SSL 终止',
          '静态资源缓存和压缩',
          '多域名和多站点管理'
        ],
        bestPractices: [
          '启用 Gzip 压缩减少传输体积',
          '配置合理的缓存策略',
          '使用 HTTP/2 提升性能',
          '配置 HTTPS 和安全头',
          '定期更新 Nginx 版本'
        ],
        codeExamples: [
          {
            title: 'Nginx 静态资源服务配置',
            language: 'nginx',
            code: `# /etc/nginx/sites-available/example.com
server {
    listen 80;
    server_name example.com www.example.com;
    
    # 网站根目录
    root /var/www/example.com/dist;
    index index.html;
    
    # SPA 路由配置
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # 静态资源缓存
    location ~* \\.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }
    
    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript 
               application/x-javascript application/xml+rss 
               application/json application/javascript;
    
    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # 禁止访问隐藏文件
    location ~ /\\. {
        deny all;
    }
}`
          },
          {
            title: 'Nginx 反向代理配置',
            language: 'nginx',
            code: `server {
    listen 80;
    server_name api.example.com;
    
    # 反向代理到后端服务
    location /api/ {
        proxy_pass http://localhost:3000/;
        
        # 传递请求头
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # 超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # 缓冲设置
        proxy_buffering on;
        proxy_buffer_size 4k;
        proxy_buffers 8 4k;
    }
    
    # WebSocket 代理
    location /ws/ {
        proxy_pass http://localhost:3000/ws/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
    
    # 静态文件直接服务
    location /static/ {
        alias /var/www/static/;
        expires 30d;
    }
}`
          },
          {
            title: 'HTTPS 和 SSL 配置',
            language: 'nginx',
            code: `# HTTP 重定向到 HTTPS
server {
    listen 80;
    server_name example.com www.example.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS 配置
server {
    listen 443 ssl http2;
    server_name example.com www.example.com;
    
    # SSL 证书
    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
    
    # SSL 配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # HSTS
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # OCSP Stapling
    ssl_stapling on;
    ssl_stapling_verify on;
    ssl_trusted_certificate /etc/letsencrypt/live/example.com/chain.pem;
    
    root /var/www/example.com;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}`
          },
          {
            title: '负载均衡配置',
            language: 'nginx',
            code: `# 定义上游服务器组
upstream backend {
    # 负载均衡策略: 轮询（默认）
    # 其他策略: ip_hash, least_conn, hash
    
    server 192.168.1.10:3000 weight=3;
    server 192.168.1.11:3000 weight=2;
    server 192.168.1.12:3000 weight=1 backup;
    
    # 健康检查
    keepalive 32;
}

server {
    listen 80;
    server_name app.example.com;
    
    location / {
        proxy_pass http://backend;
        
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        
        # 失败重试
        proxy_next_upstream error timeout invalid_header http_500 http_502 http_503;
        proxy_next_upstream_tries 3;
        proxy_next_upstream_timeout 10s;
    }
}

# IP Hash 负载均衡（会话保持）
upstream backend_ip_hash {
    ip_hash;
    server 192.168.1.10:3000;
    server 192.168.1.11:3000;
}

# 最少连接负载均衡
upstream backend_least_conn {
    least_conn;
    server 192.168.1.10:3000;
    server 192.168.1.11:3000;
}`
          },
          {
            title: '缓存配置',
            language: 'nginx',
            code: `# 定义缓存路径
proxy_cache_path /var/cache/nginx 
                 levels=1:2 
                 keys_zone=my_cache:10m 
                 max_size=1g 
                 inactive=60m 
                 use_temp_path=off;

server {
    listen 80;
    server_name example.com;
    
    location / {
        root /var/www/html;
        index index.html;
    }
    
    # API 缓存
    location /api/ {
        proxy_pass http://backend;
        
        # 启用缓存
        proxy_cache my_cache;
        proxy_cache_key $scheme$proxy_host$request_uri;
        proxy_cache_valid 200 304 10m;
        proxy_cache_valid 404 1m;
        
        # 缓存头信息
        add_header X-Cache-Status $upstream_cache_status;
        
        # 缓存锁定（避免缓存击穿）
        proxy_cache_lock on;
        proxy_cache_lock_timeout 5s;
        
        # 缓存使用陈旧数据
        proxy_cache_use_stale error timeout updating http_500 http_502 http_503 http_504;
        
        # 后台更新缓存
        proxy_cache_background_update on;
    }
    
    # 清除缓存接口
    location ~ /purge(/.*) {
        allow 127.0.0.1;
        deny all;
        proxy_cache_purge my_cache $scheme$proxy_host$1;
    }
}`
          },
          {
            title: 'Docker 中运行 Nginx',
            language: 'dockerfile',
            code: `# Dockerfile
FROM nginx:alpine

# 复制构建产物
COPY dist/ /usr/share/nginx/html/

# 复制 nginx 配置
COPY nginx.conf /etc/nginx/nginx.conf
COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]`
          }
        ],
      },
      {
        id: 'docker',
        title: 'Docker',
        summary: '容器化部署、Docker Compose',
        topics: ['Dockerfile 编写', '镜像构建', 'Docker Compose', '多阶段构建', '容器编排', 'Docker Registry'],
        description: 'Docker 是一个开源的容器化平台，可以将应用及其依赖打包到轻量级、可移植的容器中。通过 Docker，可以实现环境一致性、快速部署和资源隔离。',
        useCases: [
          '前端应用容器化部署',
          '开发环境标准化',
          '微服务架构部署',
          'CI/CD 流程集成',
          '多环境部署管理'
        ],
        bestPractices: [
          '使用多阶段构建减小镜像体积',
          '合理利用镜像层缓存',
          '使用 .dockerignore 排除不必要文件',
          '不要在镜像中存储敏感信息',
          '定期更新基础镜像'
        ],
        codeExamples: [
          {
            title: 'Dockerfile - 单阶段构建',
            language: 'dockerfile',
            code: `# 使用 Node.js 基础镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制 package 文件
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 暴露端口
EXPOSE 3000

# 启动命令
CMD ["npm", "run", "preview"]`
          },
          {
            title: 'Dockerfile - 多阶段构建',
            language: 'dockerfile',
            code: `# 第一阶段：构建
FROM node:18-alpine AS builder

WORKDIR /app

# 复制依赖文件
COPY package*.json ./

# 安装所有依赖（包括 devDependencies）
RUN npm ci

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 第二阶段：运行
FROM nginx:alpine

# 从构建阶段复制产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制 nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]`
          },
          {
            title: '.dockerignore',
            language: 'text',
            code: `node_modules
npm-debug.log
.git
.gitignore
.env
.env.local
dist
coverage
.vscode
.idea
*.md
.DS_Store
Thumbs.db`
          },
          {
            title: 'Docker Compose - 前端 + 后端',
            language: 'yaml',
            code: `# docker-compose.yml
version: '3.8'

services:
  # 前端服务
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
      - VITE_API_URL=http://backend:3000
    depends_on:
      - backend
    restart: unless-stopped
    networks:
      - app-network

  # 后端服务
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:password@db:5432/myapp
    depends_on:
      - db
    restart: unless-stopped
    networks:
      - app-network
    volumes:
      - ./backend/uploads:/app/uploads

  # 数据库服务
  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=myapp
    volumes:
      - postgres-data:/var/lib/postgresql/data
    restart: unless-stopped
    networks:
      - app-network

  # Redis 缓存
  redis:
    image: redis:7-alpine
    restart: unless-stopped
    networks:
      - app-network

networks:
  app-network:
    driver: bridge

volumes:
  postgres-data:`
          },
          {
            title: 'Docker 常用命令',
            language: 'bash',
            code: `# 构建镜像
docker build -t my-app:latest .

# 使用构建参数
docker build --build-arg NODE_ENV=production -t my-app:v1.0 .

# 运行容器
docker run -d -p 80:80 --name my-app my-app:latest

# 使用环境变量
docker run -d -p 80:80 \\
  -e VITE_API_URL=https://api.example.com \\
  --name my-app my-app:latest

# 查看运行中的容器
docker ps

# 查看所有容器
docker ps -a

# 查看容器日志
docker logs my-app
docker logs -f my-app  # 跟踪日志

# 进入容器
docker exec -it my-app sh

# 停止容器
docker stop my-app

# 删除容器
docker rm my-app

# 删除镜像
docker rmi my-app:latest

# Docker Compose 命令
docker-compose up -d           # 启动所有服务
docker-compose down            # 停止并删除所有服务
docker-compose logs -f         # 查看日志
docker-compose ps              # 查看服务状态
docker-compose restart         # 重启服务
docker-compose build           # 重新构建镜像

# 清理未使用的资源
docker system prune -a         # 清理所有未使用的镜像、容器、网络
docker volume prune            # 清理未使用的卷`
          },
          {
            title: 'Docker 健康检查',
            language: 'dockerfile',
            code: `FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

# 添加健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \\
  CMD node healthcheck.js || exit 1

CMD ["npm", "start"]

# healthcheck.js
const http = require('http')

const options = {
  host: 'localhost',
  port: 3000,
  timeout: 2000,
  path: '/health'
}

const request = http.request(options, (res) => {
  console.log(\`STATUS: \${res.statusCode}\`)
  if (res.statusCode === 200) {
    process.exit(0)
  } else {
    process.exit(1)
  }
})

request.on('error', (err) => {
  console.error('ERROR', err)
  process.exit(1)
})

request.end()`
          },
          {
            title: 'Docker 推送到 Registry',
            language: 'bash',
            code: `# 登录 Docker Hub
docker login

# 标记镜像
docker tag my-app:latest username/my-app:latest
docker tag my-app:latest username/my-app:v1.0.0

# 推送镜像
docker push username/my-app:latest
docker push username/my-app:v1.0.0

# 使用私有 Registry
docker login registry.example.com

docker tag my-app:latest registry.example.com/my-app:latest
docker push registry.example.com/my-app:latest

# 从 Registry 拉取镜像
docker pull username/my-app:latest

# GitHub Container Registry
echo \$GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin
docker tag my-app:latest ghcr.io/username/my-app:latest
docker push ghcr.io/username/my-app:latest`
          }
        ],
      },
      {
        id: 'cloud-platforms',
        title: '云平台部署',
        summary: 'Vercel、Netlify、阿里云、腾讯云',
        topics: ['Vercel 部署', 'Netlify 部署', 'GitHub Pages', '阿里云 OSS', '腾讯云 COS', 'AWS S3', 'Cloudflare Pages'],
        description: '云平台提供了便捷的前端应用部署方案。Vercel 和 Netlify 专注于前端部署，提供自动构建和 CDN 加速。阿里云 OSS、腾讯云 COS、AWS S3 等对象存储服务也常用于静态网站托管。',
        useCases: [
          '静态网站和 SPA 快速部署',
          '自动化 CI/CD 部署',
          '全球 CDN 加速',
          '无服务器函数部署',
          '预览环境和分支部署'
        ],
        bestPractices: [
          '使用环境变量管理配置',
          '配置自定义域名和 HTTPS',
          '利用预览部署测试新功能',
          '监控部署状态和性能',
          '设置合理的缓存策略'
        ],
        codeExamples: [
          {
            title: 'Vercel 配置文件',
            language: 'json',
            code: `{
  "version": 2,
  "name": "my-app",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "VITE_API_URL": "@vite-api-url"
  },
  "build": {
    "env": {
      "NODE_ENV": "production"
    }
  },
  "headers": [
    {
      "source": "/fonts/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/old-path",
      "destination": "/new-path",
      "permanent": true
    }
  ],
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://api.example.com/:path*"
    }
  ]
}`
          },
          {
            title: 'Netlify 配置文件',
            language: 'toml',
            code: `# netlify.toml
[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"
  NPM_FLAGS = "--legacy-peer-deps"

# SPA 路由重定向
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# API 代理
[[redirects]]
  from = "/api/*"
  to = "https://api.example.com/:splat"
  status = 200
  force = true

# 301 重定向
[[redirects]]
  from = "/old-url"
  to = "/new-url"
  status = 301

# 自定义头
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

# 环境变量（在 Netlify UI 中设置）
# VITE_API_URL
# VITE_GA_ID

# Serverless Functions
[functions]
  directory = "netlify/functions"
  node_bundler = "esbuild"`
          },
          {
            title: 'GitHub Pages 部署脚本',
            language: 'bash',
            code: `#!/bin/bash

# deploy.sh - 部署到 GitHub Pages

# 构建项目
npm run build

# 进入构建产物目录
cd dist

# 初始化 git
git init
git add -A
git commit -m 'deploy'

# 推送到 gh-pages 分支
git push -f git@github.com:username/repo.git main:gh-pages

cd -

# 或使用 gh-pages 包
# npm install -D gh-pages
# 在 package.json 中添加：
# "scripts": {
#   "deploy": "gh-pages -d dist"
# }`
          },
          {
            title: 'GitHub Actions 部署到 Pages',
            language: 'yaml',
            code: `name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          VITE_API_URL: \${{ secrets.VITE_API_URL }}
      
      - name: Setup Pages
        uses: actions/configure-pages@v3
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v2
        with:
          path: './dist'
      
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v2`
          },
          {
            title: '阿里云 OSS 部署脚本',
            language: 'javascript',
            code: `// deploy-oss.js
const OSS = require('ali-oss')
const fs = require('fs')
const path = require('path')

const client = new OSS({
  region: 'oss-cn-hangzhou',
  accessKeyId: process.env.OSS_ACCESS_KEY_ID,
  accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
  bucket: 'my-bucket'
})

async function uploadDir(dir, prefix = '') {
  const files = fs.readdirSync(dir)
  
  for (const file of files) {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    
    if (stat.isDirectory()) {
      await uploadDir(filePath, path.join(prefix, file))
    } else {
      const ossPath = path.join(prefix, file).replace(/\\\\/g, '/')
      
      try {
        await client.put(ossPath, filePath, {
          headers: getCacheHeaders(file)
        })
        console.log(\`Uploaded: \${ossPath}\`)
      } catch (err) {
        console.error(\`Failed to upload \${ossPath}:\`, err)
      }
    }
  }
}

function getCacheHeaders(filename) {
  const ext = path.extname(filename)
  const staticExts = ['.js', '.css', '.jpg', '.png', '.gif', '.svg', '.woff', '.woff2']
  
  if (staticExts.includes(ext)) {
    return {
      'Cache-Control': 'public, max-age=31536000, immutable'
    }
  } else if (ext === '.html') {
    return {
      'Cache-Control': 'no-cache'
    }
  }
  
  return {}
}

// 清空 bucket（可选）
async function clearBucket() {
  const list = await client.list()
  
  if (list.objects) {
    for (const obj of list.objects) {
      await client.delete(obj.name)
      console.log(\`Deleted: \${obj.name}\`)
    }
  }
}

async function deploy() {
  console.log('Starting deployment...')
  
  // await clearBucket()
  await uploadDir('./dist')
  
  console.log('Deployment completed!')
}

deploy().catch(console.error)

// package.json scripts:
// "deploy:oss": "node deploy-oss.js"`
          },
          {
            title: 'AWS S3 + CloudFront 部署',
            language: 'bash',
            code: `# 安装 AWS CLI
# npm install -g aws-cli

# 配置 AWS 凭证
aws configure

# 创建 S3 bucket
aws s3 mb s3://my-app-bucket --region us-east-1

# 启用静态网站托管
aws s3 website s3://my-app-bucket \\
  --index-document index.html \\
  --error-document index.html

# 设置 bucket 策略（公共读取）
cat > bucket-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::my-app-bucket/*"
    }
  ]
}
EOF

aws s3api put-bucket-policy \\
  --bucket my-app-bucket \\
  --policy file://bucket-policy.json

# 上传文件
aws s3 sync dist/ s3://my-app-bucket \\
  --delete \\
  --cache-control "max-age=31536000" \\
  --exclude "*.html" \\
  --exclude "service-worker.js"

# HTML 文件不缓存
aws s3 sync dist/ s3://my-app-bucket \\
  --exclude "*" \\
  --include "*.html" \\
  --include "service-worker.js" \\
  --cache-control "no-cache"

# 使 CloudFront 失效
aws cloudfront create-invalidation \\
  --distribution-id E1234567890ABC \\
  --paths "/*"`
          },
          {
            title: 'Cloudflare Pages 配置',
            language: 'toml',
            code: `# wrangler.toml
name = "my-app"
type = "webpack"
account_id = "your-account-id"
workers_dev = true
route = ""
zone_id = ""

[site]
bucket = "./dist"

[build]
command = "npm run build"
cwd = "."
watch_dir = "src"

[build.upload]
format = "service-worker"

[env.production]
name = "my-app-production"
route = "example.com/*"

# _headers 文件（放在 public/ 目录）
# /*
#   X-Frame-Options: DENY
#   X-Content-Type-Options: nosniff
#   Referrer-Policy: strict-origin-when-cross-origin

# /static/*
#   Cache-Control: public, max-age=31536000, immutable

# _redirects 文件（放在 public/ 目录）
# /old-url /new-url 301
# /api/* https://api.example.com/:splat 200
# /* /index.html 200`
          }
        ],
      },
      {
        id: 'cdn',
        title: 'CDN 加速',
        summary: '静态资源 CDN、缓存策略',
        topics: ['CDN 原理', '缓存策略', 'CDN 回源', '防盗链', '域名解析', 'DNS 优化'],
        description: 'CDN（内容分发网络）通过将内容缓存到全球各地的边缘节点，使用户可以从最近的节点获取资源，显著提升访问速度和用户体验。',
        useCases: [
          '静态资源全球加速',
          '大文件分发和下载',
          '视频和直播加速',
          'API 接口加速',
          'DDoS 攻击防护'
        ],
        bestPractices: [
          '使用独立域名托管静态资源',
          '配置合理的缓存时间',
          '启用 HTTPS 和 HTTP/2',
          '使用 CDN 预热和刷新',
          '监控 CDN 性能和成本'
        ],
        codeExamples: [
          {
            title: 'Vite CDN 配置',
            language: 'typescript',
            code: `// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: process.env.NODE_ENV === 'production' 
    ? 'https://cdn.example.com/app/' 
    : '/',
  build: {
    rollupOptions: {
      output: {
        // 分离 vendor 和业务代码
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          'ui-vendor': ['element-plus']
        },
        // 添加 hash 用于缓存
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.')
          const ext = info[info.length - 1]
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return 'images/[name]-[hash][extname]'
          } else if (ext === 'css') {
            return 'css/[name]-[hash][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        },
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js'
      }
    }
  }
})`
          },
          {
            title: 'HTML 资源预加载和 CDN',
            language: 'html',
            code: `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- DNS 预解析 -->
  <link rel="dns-prefetch" href="//cdn.example.com">
  <link rel="dns-prefetch" href="//api.example.com">
  
  <!-- 预连接 -->
  <link rel="preconnect" href="https://cdn.example.com" crossorigin>
  
  <!-- 预加载关键资源 -->
  <link rel="preload" href="https://cdn.example.com/fonts/main.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="https://cdn.example.com/css/main.css" as="style">
  
  <!-- 从 CDN 加载样式 -->
  <link rel="stylesheet" href="https://cdn.example.com/css/main-abc123.css">
  
  <title>My App</title>
</head>
<body>
  <div id="app"></div>
  
  <!-- 从 CDN 加载脚本 -->
  <script type="module" crossorigin src="https://cdn.example.com/js/main-xyz789.js"></script>
  
  <!-- 使用公共 CDN -->
  <script src="https://cdn.jsdelivr.net/npm/vue@3.3.4/dist/vue.global.prod.js"></script>
</body>
</html>`
          },
          {
            title: '阿里云 CDN 缓存配置',
            language: 'javascript',
            code: `// 使用阿里云 SDK 配置 CDN
const CDN = require('@alicloud/cdn20180510')
const Config = require('@alicloud/openapi-client').Config

const config = new Config({
  accessKeyId: process.env.ALI_ACCESS_KEY_ID,
  accessKeySecret: process.env.ALI_ACCESS_KEY_SECRET,
  endpoint: 'cdn.aliyuncs.com'
})

const client = new CDN(config)

// 配置缓存规则
async function setCacheConfig() {
  const request = {
    domainName: 'cdn.example.com',
    cacheContent: JSON.stringify({
      CacheRules: [
        {
          // HTML 不缓存
          PathPattern: '*.html',
          CacheTime: 0,
          CacheType: 'file'
        },
        {
          // 静态资源长期缓存
          PathPattern: '*.js,*.css,*.jpg,*.png,*.gif,*.svg',
          CacheTime: 31536000,
          CacheType: 'file'
        },
        {
          // 字体文件
          PathPattern: '/fonts/*',
          CacheTime: 31536000,
          CacheType: 'path'
        }
      ]
    })
  }
  
  await client.setBatchDomainConfigs(request)
}

// 刷新 CDN 缓存
async function refreshCDN(paths) {
  const request = {
    objectPath: paths.join('\\n'),
    objectType: 'File' // 或 'Directory'
  }
  
  const response = await client.refreshObjectCaches(request)
  console.log('Refresh task ID:', response.body.refreshTaskId)
}

// 预热 CDN
async function pushCDN(urls) {
  const request = {
    objectPath: urls.join('\\n')
  }
  
  const response = await client.pushObjectCache(request)
  console.log('Push task ID:', response.body.pushTaskId)
}

// 使用示例
setCacheConfig()
refreshCDN(['https://cdn.example.com/js/main.js'])
pushCDN(['https://cdn.example.com/index.html'])`
          },
          {
            title: 'Nginx CDN 缓存配置',
            language: 'nginx',
            code: `# CDN 节点 Nginx 配置
proxy_cache_path /var/cache/nginx/cdn 
                 levels=1:2 
                 keys_zone=cdn_cache:100m 
                 max_size=10g 
                 inactive=7d 
                 use_temp_path=off;

# 回源服务器配置
upstream origin {
    server origin1.example.com;
    server origin2.example.com backup;
}

server {
    listen 80;
    server_name cdn.example.com;
    
    # 防盗链
    valid_referers none blocked cdn.example.com *.example.com;
    if ($invalid_referer) {
        return 403;
    }
    
    location / {
        # 启用缓存
        proxy_cache cdn_cache;
        proxy_cache_key $scheme$proxy_host$request_uri;
        
        # 缓存时间
        proxy_cache_valid 200 304 7d;
        proxy_cache_valid 404 1m;
        proxy_cache_valid any 1m;
        
        # 缓存锁定
        proxy_cache_lock on;
        proxy_cache_lock_timeout 5s;
        
        # 使用过期缓存
        proxy_cache_use_stale error timeout updating http_500 http_502 http_503 http_504;
        
        # 回源配置
        proxy_pass http://origin;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        
        # 添加缓存状态头
        add_header X-Cache-Status $upstream_cache_status;
        add_header X-Cache-Key $scheme$proxy_host$request_uri;
        
        # CORS 头
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods "GET, OPTIONS";
    }
    
    # 静态资源长缓存
    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        proxy_cache cdn_cache;
        proxy_cache_valid 200 30d;
        proxy_pass http://origin;
        
        expires max;
        add_header Cache-Control "public, immutable";
    }
    
    # HTML 不缓存
    location ~* \\.html$ {
        proxy_cache off;
        proxy_pass http://origin;
        
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }
}`
          },
          {
            title: 'Cloudflare Workers CDN',
            language: 'javascript',
            code: `// Cloudflare Workers - 自定义 CDN 逻辑
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  
  // 自定义缓存键
  const cacheKey = new Request(url.toString(), request)
  const cache = caches.default
  
  // 检查缓存
  let response = await cache.match(cacheKey)
  
  if (response) {
    // 缓存命中
    console.log('Cache hit:', url.pathname)
    return response
  }
  
  // 回源获取
  response = await fetch(request)
  
  // 克隆响应用于缓存
  const responseToCache = response.clone()
  
  // 根据路径设置缓存策略
  const cacheControl = getCacheControl(url.pathname)
  
  if (cacheControl) {
    const headers = new Headers(responseToCache.headers)
    headers.set('Cache-Control', cacheControl)
    
    const cachedResponse = new Response(responseToCache.body, {
      status: responseToCache.status,
      statusText: responseToCache.statusText,
      headers: headers
    })
    
    // 存入缓存
    event.waitUntil(cache.put(cacheKey, cachedResponse))
  }
  
  return response
}

function getCacheControl(pathname) {
  // HTML 不缓存
  if (pathname.endsWith('.html') || pathname === '/') {
    return 'no-cache'
  }
  
  // 静态资源长缓存
  if (/\\.(js|css|png|jpg|jpeg|gif|svg|woff2?)$/.test(pathname)) {
    return 'public, max-age=31536000, immutable'
  }
  
  // 默认缓存 1 小时
  return 'public, max-age=3600'
}`
          },
          {
            title: 'CDN 性能监控',
            language: 'typescript',
            code: `// 监控 CDN 资源加载性能
class CDNMonitor {
  private metrics: Map<string, PerformanceEntry[]> = new Map()

  init() {
    // 监听资源加载
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'resource') {
          this.trackResource(entry as PerformanceResourceTiming)
        }
      }
    })

    observer.observe({ entryTypes: ['resource'] })
    
    // 定期上报
    setInterval(() => this.report(), 60000)
  }

  trackResource(entry: PerformanceResourceTiming) {
    const url = new URL(entry.name)
    
    // 只追踪 CDN 资源
    if (url.hostname.includes('cdn.example.com')) {
      const key = url.pathname
      
      if (!this.metrics.has(key)) {
        this.metrics.set(key, [])
      }
      
      this.metrics.get(key)!.push(entry)
      
      // 检测慢资源
      if (entry.duration > 3000) {
        console.warn('Slow CDN resource:', {
          url: entry.name,
          duration: entry.duration,
          size: entry.transferSize,
          cached: entry.transferSize === 0
        })
      }
    }
  }

  report() {
    const report = {
      timestamp: Date.now(),
      resources: Array.from(this.metrics.entries()).map(([path, entries]) => ({
        path,
        count: entries.length,
        avgDuration: entries.reduce((sum, e) => sum + e.duration, 0) / entries.length,
        cacheHitRate: entries.filter(e => e.transferSize === 0).length / entries.length
      }))
    }

    // 上报到分析服务
    navigator.sendBeacon('/api/cdn-metrics', JSON.stringify(report))
    
    // 清空指标
    this.metrics.clear()
  }
}

const monitor = new CDNMonitor()
monitor.init()`
          }
        ],
      },
    ],
  },
]
