import { writeFileSync } from "node:fs"
import { join } from "node:path"
import deepForEach from "./utils/deepForEach.ts"
import { QuestionId } from "./types.ts"

const TARGET_FILE = "./module.ts"
const TEMPLATE_TARGET = "<TARGET>"

;(async () => {
  const { default: modules } = await import(TARGET_FILE) as { default: Record<string, any> }

  const constantIds: QuestionId[] = []
  const variableIds: QuestionId[] = []

  for (const module of Object.values(modules)) {
    deepForEach(module.steps, (value, key, _, path) => {
      if (key === 'id') {
        const id = value as QuestionId
        if (path.includes('nested')) variableIds.push(id)
        else constantIds.push(id)
      }
    })
  }

  const output: string[] = [
    'export interface Map {',
    TEMPLATE_TARGET,
    `}`
  ]

  for (const id of constantIds) {
    const targetIndex = output.indexOf(TEMPLATE_TARGET)
    output.splice(targetIndex, 0, `  ${id}: true`)
  }

  for (const id of variableIds) {
    const targetIndex = output.indexOf(TEMPLATE_TARGET)
    output.splice(targetIndex, 0, `  ${id}?: true`)
  }

  output.splice(output.indexOf(TEMPLATE_TARGET), 1)
  writeFileSync(join(__dirname, './output.d.ts'), output.join('\n'), { encoding: 'utf-8' })
})()
