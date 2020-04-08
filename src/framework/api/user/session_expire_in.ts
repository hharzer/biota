import { DB } from "~/db";
import { execute } from "~/tasks";
import { query as q } from "faunadb";
import { document } from "~/factory/api/classes/document";
import { collectionNameNormalized } from "~/factory/classes/collection";

export async function expireIn(this: DB, delayInMs: number = 3600) {
  let self = this;
  return execute(
    [
      {
        name: `Expire session in [${delayInMs}]ms`,
        task() {
          return self.query(document.expireIn(collectionNameNormalized("user_sessions"), q.Select("id", q.Identity()), delayInMs));
        },
      },
    ],
    {
      domain: "DB.user.session.expireIn",
    }
  );
}