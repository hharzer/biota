import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { replace as replaceFQLUDF } from "~/factory/api/fql/udf/replace";

export const ReplaceCollection = UDFunction({
  name: udfunctionNameNormalized("ReplaceCollection"),
  body: q.Query((identity, name, options) => replaceFQLUDF.collection(name, options)),
});