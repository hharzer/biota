import { query as q } from 'faunadb'
import { client } from './client'

const db = client()

describe('DB.collections', () => {
  test('should return collections', async () => {
    await db
      .query({
        collections: db.collections(),
        indexes: db.indexes(),
        functions: db.functions(),
        roles: db.roles(),
        keys: db.keys(),
        credentials: db.credentials()
      })
      .then(console.log)
      .catch(console.error)

    // expect(collections.data)
  })
})
