import { writeFileSync } from "node:fs"
import { join } from "node:path"
import deepForEach from "./utils/deepForEach.ts"
import { QuestionId } from "./types.ts"

async function processQuestions(questionsPath: string): Promise<string[]> {
  const { default: questions } = await import(questionsPath) as { default: Record<string, any> }

  const output = [
    'export interface QuestionIdToAnswerTypeMap {'
  ]

  for (const question of Object.values(questions)) {
    output.push(`  ${question.id}: "${question.config.type}"`)
  }

  output.push('}')
  return output
}

async function processModule(modulePath: string): Promise<string[]> {
  const { default: modules } = await import(modulePath) as { default: Record<string, any> }

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
  ]

  for (const id of constantIds) output.push(`  ${id}: true`)
  for (const id of variableIds) output.push(`  ${id}?: true`)

  output.push('}')
  return output
}

async function main() {
  const questionTypes = await processQuestions('./questions.ts')
  const questionDefinitionState = await processModule('./module.ts')

  writeFileSync(join(__dirname, './output.d.ts'), [...questionTypes, '\n', ...questionDefinitionState].join('\n'), { encoding: 'utf-8' })
}

void main()
