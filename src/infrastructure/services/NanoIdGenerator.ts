import { IdGenerator } from '../../application/ports/IdGenerator'
import { nanoid } from 'nanoid'

export class NanoIdGenerator implements IdGenerator {
  generate(): string {
    return nanoid()
  }
}
