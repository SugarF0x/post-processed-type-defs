import { writeFileSync } from "node:fs"
import deepForEach from "./utils/deepForEach.ts"
import { QuestionId, QuestionType } from "./types.ts"

(async () => {
  const output: string[] = []

  const { default: modules } = await import('./module.ts')

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

  console.log(constantIds)
  console.log(variableIds)

  writeFileSync('./output.d.ts', output.join('\n'), { encoding: 'utf-8' })
})()
