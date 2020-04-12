import { query as q } from 'faunadb';
import { user as userFQLUDF } from '~/factory/api/fql/udf/user';
import { UDFunction, BiotaFunctionName } from '~/factory/classes/udfunction';

export const UserChangePassword = UDFunction({
  name: BiotaFunctionName('UserChangePassword'),
  body: q.Query(q.Lambda(['identity', 'private_key', 'password'], userFQLUDF.changePassword(q.Var('password') as string))),
});
