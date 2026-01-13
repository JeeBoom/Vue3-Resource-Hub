export interface CodeExample {
  title: string
  code: string
  language?: string
}

export interface DocNode {
  id: string
  title: string
  summary: string
  tags?: string[]
  content?: string // 详细讲解内容
  topics?: string[] // 必知要点列表
  description?: string // 详细说明
  useCases?: string[] // 使用场景
  bestPractices?: string[] // 最佳实践
  codeExamples?: CodeExample[] // 代码示例
  resources?: { title: string; url?: string }[] // 相关资源
  children?: DocNode[]
}
