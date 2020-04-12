import { query as q } from 'faunadb';
import { UDFunction, BiotaFunctionName } from '~/factory/classes/udfunction';
import { role as roleFQLUDF } from '~/factory/api/fql/udf/role';

export const RoleUpsertPrivilege = UDFunction({
  name: BiotaFunctionName('RoleUpsertPrivilege'),
  body: q.Query(
    q.Lambda(['identity', 'private_key', 'name', 'privilege'], roleFQLUDF.privilege.upsert(q.Var('name') as string, q.Var('privilege'))),
  ),
});
