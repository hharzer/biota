import { query as q } from 'faunadb';
import { UDFunction, BiotaFunctionName } from '~/factory/classes/udfunction';
import { insert as insertFQLUDF } from '~/factory/api/fql/udf/insert';

export const InsertKey = UDFunction({
  name: BiotaFunctionName('InsertKey'),
  body: q.Query(q.Lambda(['identity', 'private_key', 'id', 'options'], insertFQLUDF.key(q.Var('id') as any, q.Var('options') as any))),
});
