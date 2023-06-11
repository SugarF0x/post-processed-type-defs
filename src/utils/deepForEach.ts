// @ts-ignore
import deepForEach from 'deep-for-each'

export default function(data: Record<string, unknown> | Array<unknown>, cb: (value: unknown, key: string, subject: string, path: string) => void) {
  deepForEach(data, cb)
}
