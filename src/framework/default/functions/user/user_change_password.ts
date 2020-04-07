import { query as q } from "faunadb";
import { user as userFQLUDF } from "~/factory/api/fql/udf/user";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";

export const UserChangePassword = UDFunction({
  name: udfunctionNameNormalized("UserChangePassword"),
  body: q.Query((identity, password) => userFQLUDF.changePassword(q.Var("password") as string)),
});