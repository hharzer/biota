import { DB } from "~/db";
import { FaunaCollectionOptions, FaunaId } from "~/../types/fauna";
import { role } from "~/factory/api/classes/role";
import { execute } from "~/tasks";

export function delete_(this: DB, roleName: string) {
  let self = this;

  return async function deleteMethod(id: FaunaId) {
    return execute(
      [
        {
          name: `Delete (${id}) in (${roleName})`,
          task() {
            return self.query(role.delete(roleName));
          },
        },
      ],
      {
        domain: "DB.role.delete",
      }
    );
  };
}