export enum QuestionType {
  BOOLEAN = 'BOOLEAN',
  NUMBER = 'NUMBER',
  SINGLE_CHOICE = 'SINGLE_CHOICE',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
}

export enum QuestionId {
  BLOOD = 'BLOOD',
  SUGAR = 'SUGAR',
  HEARING = 'HEARING',
  SIGHT = 'SIGHT',
}

export interface BaseQuestionConfig {
  type: QuestionType
}

export interface BooleanQuestionConfig extends BaseQuestionConfig {
  type: QuestionType.BOOLEAN
}

export interface NumberQuestionConfig extends BaseQuestionConfig {
  type: QuestionType.NUMBER
  range: {
    min: number
    max: number
  }
}

export interface ChoiceOption {
  id: string
  text: string
}

export interface SingleChoiceQuestionConfig extends BaseQuestionConfig {
  type: QuestionType.SINGLE_CHOICE
  options: ChoiceOption[]
}

export interface MultipleChoiceOption extends ChoiceOption {
  exclusive?: boolean
}

export interface MultipleChoiceQuestionConfig extends BaseQuestionConfig {
  type: QuestionType.MULTIPLE_CHOICE
  options: MultipleChoiceOption[]
}

type QuestionConfig =
  | BooleanQuestionConfig
  | NumberQuestionConfig
  | SingleChoiceQuestionConfig
  | MultipleChoiceQuestionConfig

export interface Question {
  id: QuestionId
  config: QuestionConfig
}

export enum Condition {
  EQUALS = 'EQUALS',
  NOT_EQUALS = 'NOT_EQUALS',
  UNDER = 'UNDER',
  OVER = 'OVER',
  CONTAINS = 'CONTAINS',
  NOT_CONTAINS = 'NOT_CONTAINS',
}

export interface NestedStep {
  answer: unknown
  condition: Condition
  steps: Step[]
}

export interface Step {
  id: QuestionId
  nestedStep?: NestedStep
}

export interface Module {
  id: string
  steps: Step[]
  questions: Question[]
}
