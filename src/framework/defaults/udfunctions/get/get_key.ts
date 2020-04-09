import { query as q } from "faunadb";
import { get as getFQLUDF } from "~/factory/api/fql/udf/get";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";

export const GetKey = UDFunction({
  name: udfunctionNameNormalized("GetKey"),
  body: q.Query(q.Lambda(["identity", "private_key", "id"], getFQLUDF.key(q.Var("id") as any))),
});