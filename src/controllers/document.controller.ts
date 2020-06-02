import { PhoneticKeyGenerator } from '../keyGenerator'
import { ConfigObject } from './config.controller'
import { Document } from '../entities/docuent.entity'
import { createConnection } from 'typeorm'
import { dbOptions } from './database.controller'

export class DocumentHandler {
  options: ConfigObject

  constructor (options: ConfigObject) {
    this.options = options
  }

  /*
   * Helper method to generate keys using the PhoneticKeyGenerator class
   */
  private createKey (): string {
    const keyGenerator = new PhoneticKeyGenerator()

    return keyGenerator.createKey(this.options.keyLength)
  }

  /*
   * Calls createKey() until it generates a unique key.
   */
  chooseKey (): string {
    return this.createKey()
  }

  /*
   * Creates a connection to the database, then creates a new entry in the database consisting of:
   *  - Document key, generated by chooseKey() and createKey() functions
   *  - Document content, provided by arguments
   */
  async newDocument (content: string): Promise<object> {
    return new Promise((resolve, reject) => {
      createConnection(dbOptions)
        .then(async conn => {
          const doc = new Document()
          const key = this.chooseKey()

          doc.key = key
          doc.content = content

          await conn.manager.save(doc)
          console.log('Saved Doc')

          resolve({ key, content })

          conn.close()
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
}