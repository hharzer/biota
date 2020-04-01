// types
import { FaunaFunctionOptions, FaunaRef, Fauna } from "~/../types/db";
// external
// biota
import { CONVENTION } from "~/consts";

export function udfunctionNameNormalized(name: string) {
  return `${CONVENTION.UDFUNCTION_PREFIX}${name.replace(
    CONVENTION.UDFUNCTION_PREFIX,
    ""
  )}`;
}

export function UDFunction(fn: FaunaFunctionOptions): FaunaFunctionOptions {
  let { name = "", body, data, role } = fn || {};
  let self = {
    name,
    body,
    data,
    role
  };

  return self;
}