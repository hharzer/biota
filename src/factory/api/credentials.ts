import { query as q } from 'faunadb';
import { BiotaIndexName } from '~/factory/constructors';
import { MethodDispatch, Query } from '~/factory/constructors/method';
import { FactoryContext } from '~/types/factory/factory.context';
import { FactoryCredentialsApi } from '~/types/factory/factory.credentials';
import { Pagination } from '../constructors/pagination';
import { BiotaFunctionName } from './constructors';


// tslint:disable-next-line: only-arrow-functions
export const credentials: FactoryContext<FactoryCredentialsApi> = function (context): FactoryCredentialsApi {
  return {
    findByInstance(instance, pagination) {
      const inputs = { instance, pagination };
      // ---
      const query = Query(
        {
          docs: q.Paginate(
            q.Match(q.Index(BiotaIndexName('credentials__by__instance')), q.Var('instance')),
            Pagination(q.Var('pagination')),
          ),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.credentials.findByInstance';
      const online = { name: BiotaFunctionName('CredentialsFindByInstance'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    findAll(pagination) {
      const inputs = { pagination };
      // ---
      const query = Query(
        {
          docs: q.Map(q.Paginate(q.Documents(q.Credentials()), Pagination(q.Var('pagination'))), q.Lambda('x', q.Get(q.Var('x')))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.credentials.paginate';
      const online = { name: BiotaFunctionName('CredentialsFindAll'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
  };
};
