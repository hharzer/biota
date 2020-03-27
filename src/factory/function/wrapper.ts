// types
import { FaunaFunctionOptions, FaunaRef, Fauna } from "~/../types/db";
// external

export function UDFunction(fn: FaunaFunctionOptions): FaunaFunctionOptions {
  let { name = "", body, data, role } = fn || {};
  let self = {
    name: `biota.${name.replace("biota.", "")}`,
    body,
    data,
    role
    // setBody(newBody: Fauna.Expr) {
    //   return UDFunction({ name, body: newBody, data, role });
    // },
    // setData(newData: object) {
    //   return UDFunction({ name, body, data: newData, role });
    // },
    // setRole(newRole: FaunaRef | string) {
    //   return UDFunction({ name, body, data, role: newRole });
    // }
  };

  return self;
}