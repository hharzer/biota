import { DB } from "~/db";
import { FaunaCollectionOptions, FaunaId } from "~/../types/fauna";
import { role } from "~/factory/api/classes/role";
import { execute } from "~/tasks";

export function get(this: DB, roleName: string) {
  let self = this;

  return async function getMethod() {
    return execute(
      [
        {
          name: `Get [${roleName}]`,
          task() {
            return self.query(role.get(roleName));
          },
        },
      ],
      {
        domain: "DB.role.get",
      }
    );
  };
}