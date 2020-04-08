import { DB } from "~/db";
import { execute } from "~/tasks";
import { google } from "~/framework/api/user/auth/providers/google";
import { DBFrameworkAuthConnectUrlOptions } from "~/../types/framework/framework.user";
import { query as q } from "faunadb";
import { encrypt } from "~/framework/helpers/crypto";

export async function googleSyncUrl(this: DB, options: DBFrameworkAuthConnectUrlOptions): Promise<string> {
  let self = this;
  return execute(
    [
      {
        name: `Sync url for Google`,
        async task() {
          // client_id && redirect_uri required
          return self.query(q.HasIdentity()).then((hasIdentity) => {
            if (hasIdentity && self.secret) {
              const { iv, encrypted } = encrypt(self.secret, self.private_key || "");
              return google.connectUrl({
                ...options,
                state: {
                  ...(typeof options.state === "object" ? options.state : {}),
                  action: "register",
                  user: encrypted,
                  iv: iv,
                },
              });
            } else {
              return {
                url: undefined,
              };
            }
          });
        },
      },
    ],
    {
      domain: "DB.user.google.loginUrl",
    }
  );
}