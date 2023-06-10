import { Question, QuestionId, QuestionType } from "./types"

export const BLOOD: Question = {
  id: QuestionId.BLOOD,
  config: { type: QuestionType.BOOLEAN }
}

export const SUGAR: Question = {
  id: QuestionId.SUGAR,
  config: {
    type: QuestionType.NUMBER,
    range: {
      min: 0,
      max: 10
    }
  }
}

export const HEARING: Question = {
  id: QuestionId.HEARING,
  config: {
    type: QuestionType.SINGLE_CHOICE,
    options: [
      { id: 'SUBOPTIMAL', text: 'Suboptimal' },
      { id: 'OPTIMAL', text: 'Optimal' },
      { id: 'GREAT', text: 'Great' },
    ]
  }
}

export const SIGHT: Question = {
  id: QuestionId.SIGHT,
  config: {
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      { id: 'GLASSES', text: 'Glasses' },
      { id: 'CONTACTS', text: 'Contacts' },
      { id: 'NEITHER', text: 'Neither', exclusive: true },
    ]
  }
}
