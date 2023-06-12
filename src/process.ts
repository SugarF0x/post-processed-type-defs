import { writeFileSync } from "node:fs"
import { join } from "node:path"
import deepForEach from "./utils/deepForEach.ts"
import { QuestionId } from "./types.ts"

interface QuestionMeta {
  id: string
  type: string
  isDefinitive?: boolean
}

function createInterface(questionMeta: QuestionMeta[]): string {
  const output = [
    'export interface QuestionIdToAnswerTypeMap {'
  ]

  for (const { id, type, isDefinitive } of questionMeta) {
    output.push(`  ${id}${isDefinitive ? '' : '?'}: "${type}"`)
  }

  output.push('}')
  return output.join('\n')
}

async function processQuestions(questionsPath: string): Promise<QuestionMeta[]> {
  const { default: questions } = await import(questionsPath) as { default: Record<string, any> }

  const output: QuestionMeta[] = []

  for (const question of Object.values(questions)) {
    output.push({ id: question.id, type: question.config.type })
  }

  return output
}

async function processModule(modulePath: string, questionsMeta: QuestionMeta[]): Promise<QuestionMeta[]> {
  const { default: modules } = await import(modulePath) as { default: Record<string, any> }
  const allIds = questionsMeta.map(e => e.id)

  const output: QuestionMeta[] = [...questionsMeta]

  for (const module of Object.values(modules)) {
    deepForEach(module.steps, (value, key, _, path) => {
      if (key !== 'id') return
      const id = value as string

      const questionIndex = allIds.indexOf(id)
      if (questionIndex === -1) throw new Error(`Question ${id} is required in module steps but not found in configuration`)

      output[questionIndex].isDefinitive = !path.includes('nested')
    })
  }

  return output
}

async function main() {
  const questionsMeta = await processQuestions('./questions.ts')
  const moduleQuestionsMeta = await processModule('./module.ts', questionsMeta)

  const moduleQuestionsInterface = createInterface(moduleQuestionsMeta)

  writeFileSync(join(__dirname, './output.d.ts'), moduleQuestionsInterface, { encoding: 'utf-8' })
}

void main()
