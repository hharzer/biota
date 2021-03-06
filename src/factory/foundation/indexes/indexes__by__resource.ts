import { query as q } from 'faunadb';
import { Index, BiotaIndexName } from '~/factory/constructors/index';

// tslint:disable-next-line: variable-name
export const indexes__by__resource = Index({
  name: BiotaIndexName('indexes__by__resource'),
  source: {
    collection: q.Indexes(),
    fields: {
      source: q.Query(
        q.Lambda(
          'index',
          q.Let(
            {
              source: q.Select('source', q.Var('index'), false),
              collection: q.Select('collection', q.Var('source'), false),
            },
            q.If(q.IsRef(q.Var('collection')), q.Var('collection'), false),
          ),
        ),
      ),
    },
  },
  terms: [
    {
      binding: 'source',
    },
  ],
  values: [
    {
      field: ['ref'],
    },
  ],
});
