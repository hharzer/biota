import { query as q } from 'faunadb';
import { UDFunction, BiotaFunctionName } from '~/factory/classes/udfunction';
import { role as roleFQLUDF } from '~/factory/api/fql/udf/role';

export const RoleDeleteMembership = UDFunction({
  name: BiotaFunctionName('RoleDeleteMembership'),
  body: q.Query(
    q.Lambda(['identity', 'private_key', 'name', 'resource'], roleFQLUDF.membership.delete(q.Var('name') as string, q.Var('resource'))),
  ),
});
