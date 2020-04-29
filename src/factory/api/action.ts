import { query as q } from 'faunadb';
import { FactoryAction } from '~/types/factory/factory.action';
import { FactoryContext } from '~/types/factory/factory.context';
import { document } from '~/factory/api/document';
import { ContextProp } from '~/factory/constructors/context';
import { BiotaCollectionName } from '~/factory/constructors/collection';
import { ThrowError } from '~/factory/constructors/error';
import { MethodDispatch, MethodQuery } from '~/factory/constructors/method';
import { BiotaFunctionName } from '~/factory/constructors/udfunction';

export const action: FactoryContext<FactoryAction> = function (context): FactoryAction {
  return (id = null) => {
    return {
      ...document(context, { prefix: 'Action' })(BiotaCollectionName('actions'), id),
      log(name = null, ref = null) {
        const inputs = { name, ref };
        // ↓↓↓↓
        const query = MethodQuery(
          {
            doc: q.If(
              q.And(
                ContextProp(q.Var('ctx'), 'logActions'),
                // Make sure not to try to log an action if collection doesn't exists
                q.Exists(q.Collection(BiotaCollectionName('actions'))),
              ),
              q.If(
                q.And(q.IsString(q.Var('name')), q.IsRef(q.Var('ref'))),
                q.Create(BiotaCollectionName('actions'), {
                  data: {
                    name: q.Var('name'),
                    instance: q.Var('ref'),
                    ts: q.Now(),
                    user: ContextProp(q.Var('ctx'), 'identity'),
                  },
                }),
                ThrowError(q.Var('ctx'), 'Wrong inputs', { name: q.Var('name'), ref: q.Var('ref'), ts: q.Now() }),
              ),
              null,
            ),
          },
          q.Var('doc'),
        );
        // ↓↓↓↓
        const offline = 'factory.action.insert';
        const online = { name: BiotaFunctionName('ActionLog'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
    };
  };
};
