import { Condition, Module, QuestionId } from "./types"

export const MODULE_1: Module = {
  id: 'module1',
  steps: [
    {
      id: QuestionId.BLOOD,
      nestedStep: {
        answer: true,
        condition: Condition.EQUALS,
        steps: [
          { id: QuestionId.SUGAR }
        ]
      }
    },
    { id: QuestionId.HEARING },
    { id: QuestionId.SIGHT },
  ]
}
