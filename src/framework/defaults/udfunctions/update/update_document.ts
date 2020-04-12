import { query as q } from 'faunadb';
import { UDFunction, BiotaFunctionName } from '~/factory/classes/udfunction';
import { update as updateFQLUDF } from '~/factory/api/fql/udf/update';

export const UpdateDocument = UDFunction({
  name: BiotaFunctionName('UpdateDocument'),
  body: q.Query(
    q.Lambda(
      ['identity', 'private_key', 'collection', 'id', 'data'],
      updateFQLUDF.document(q.Var('collection') as string, q.Var('id'), q.Var('data')),
    ),
  ),
});
