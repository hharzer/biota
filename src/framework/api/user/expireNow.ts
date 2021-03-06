import { FactoryUser } from '~/types/factory/factory.user';
import { FrameworkUserApi } from '~/types/framework/framework.user';
import { user } from '~/factory/api/user';
import { execute } from '~/tools/tasks';

export const expireNow: FactoryUser<FrameworkUserApi['expireNow']> = function (idOrRef) {
  const self = this;

  return async () => {
    return execute(
      [
        {
          name: `Expire [${idOrRef}] now`,
          task() {
            return self.query(user(self.context)(idOrRef).expireNow());
          },
        },
      ],
      {
        domain: 'Biota.user.expireNow',
      },
    );
  };
};
