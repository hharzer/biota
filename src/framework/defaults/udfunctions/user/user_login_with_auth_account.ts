import { query as q } from 'faunadb';
import { user as userFQLUDF } from '~/factory/api/fql/udf/user';
import { UDFunction, BiotaFunctionName } from '~/factory/classes/udfunction';

export const UserLoginWithAuthAccount = UDFunction({
  name: BiotaFunctionName('UserLoginWithAuthAccount'),
  body: q.Query(q.Lambda(['identity', 'private_key', 'account'], userFQLUDF.loginWithAuthAccount(q.Var('account') as any))),
});
