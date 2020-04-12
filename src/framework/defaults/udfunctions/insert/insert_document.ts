import { query as q } from 'faunadb';
import { UDFunction, BiotaFunctionName } from '~/factory/classes/udfunction';
import { insert as insertFQLUDF } from '~/factory/api/fql/udf/insert';

export const InsertDocument = UDFunction({
  name: BiotaFunctionName('InsertDocument'),
  body: q.Query(
    q.Lambda(
      ['identity', 'private_key', 'collection', 'data', 'id'],
      insertFQLUDF.document(q.Var('collection') as any, q.Var('data') as any, q.Var('id') as any),
    ),
  ),
});
