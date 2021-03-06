import { query as q } from 'faunadb';
import { FactoryContext } from '~/types/factory/factory.context';
import { FactoryCollectionsApi } from '~/types/factory/factory.collections';

import { Query, MethodDispatch } from '~/factory/constructors/method';
import { BiotaFunctionName } from './constructors';
import { collection } from '~/factory/api/collection';
import { ResultData } from '~/factory/constructors/result';
import { Pagination } from '../constructors/pagination';

// tslint:disable-next-line: only-arrow-functions
export const collections: FactoryContext<FactoryCollectionsApi> = function (context): FactoryCollectionsApi {
  return {
    findAll(pagination) {

      const inputs = { pagination };
      // ---
      const query = Query(
        {
          docs: q.Map(q.Paginate(q.Collections(), Pagination(q.Var('pagination'))), q.Lambda('x', q.Get(q.Var('x')))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.collections.paginate';
      const online = { name: BiotaFunctionName('CollectionsFindAll'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    getMany(nameList) {
      const inputs = { nameList };
      // ---
      const query = Query(
        {
          docs: q.Map(q.Var('nameList'), q.Lambda(['name'], ResultData(collection(q.Var('ctx'))(q.Var('name')).get()))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.collections.getMany';
      const online = { name: BiotaFunctionName('CollectionsGetMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    insertMany(optionsList) {
      const inputs = { optionsList };
      // ---
      const query = Query(
        {
          docs: q.Map(q.Var('optionsList'), q.Lambda(['options'], ResultData(collection(q.Var('ctx'))().insert(q.Var('options'))))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.collections.insertMany';
      const online = { name: BiotaFunctionName('CollectionsInsertMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    updateMany(optionsList) {
      const inputs = { optionsList };
      // ---
      const query = Query(
        {
          docs: q.Map(q.Var('optionsList'), q.Lambda(['options'], ResultData(collection(q.Var('ctx'))().update(q.Var('options'))))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.collections.updateMany';
      const online = { name: BiotaFunctionName('CollectionsUpdateMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    upsertMany(optionsList) {
      const inputs = { optionsList };
      // ---
      const query = Query(
        {
          docs: q.Map(q.Var('optionsList'), q.Lambda(['options'], ResultData(collection(q.Var('ctx'))().upsert(q.Var('options'))))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.collections.upsertMany';
      const online = { name: BiotaFunctionName('CollectionsUpsertMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    replaceMany(optionsList) {
      const inputs = { optionsList };
      // ---
      const query = Query(
        {
          docs: q.Map(q.Var('optionsList'), q.Lambda(['options'], ResultData(collection(q.Var('ctx'))().replace(q.Var('options'))))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.collections.replaceMany';
      const online = { name: BiotaFunctionName('CollectionsReplaceMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    repsertMany(optionsList) {
      const inputs = { optionsList };
      // ---
      const query = Query(
        {
          docs: q.Map(q.Var('optionsList'), q.Lambda(['options'], ResultData(collection(q.Var('ctx'))().repsert(q.Var('options'))))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.collections.repsertMany';
      const online = { name: BiotaFunctionName('CollectionsRepsertMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    deleteMany(nameList) {
      const inputs = { nameList };
      // ---
      const query = Query(
        {
          docs: q.Map(q.Var('nameList'), q.Lambda(['name'], ResultData(collection(q.Var('ctx'))(q.Var('name')).delete()))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.collections.deleteMany';
      const online = { name: BiotaFunctionName('CollectionsDeleteMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    restoreMany(nameList) {
      const inputs = { nameList };
      // ---
      const query = Query(
        {
          docs: q.Map(q.Var('nameList'), q.Lambda(['name'], ResultData(collection(q.Var('ctx'))(q.Var('name')).restore()))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.collections.restoreMany';
      const online = { name: BiotaFunctionName('CollectionsRestoreMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    forgetMany(nameList) {
      const inputs = { nameList };
      // ---
      const query = Query(
        {
          docs: q.Map(q.Var('nameList'), q.Lambda(['name'], ResultData(collection(q.Var('ctx'))(q.Var('name')).forget()))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.collections.forgetMany';
      const online = { name: BiotaFunctionName('CollectionsForgetMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    dropMany(nameList) {
      const inputs = { nameList };
      // ---
      const query = Query(
        {
          docs: q.Map(q.Var('nameList'), q.Lambda(['name'], ResultData(collection(q.Var('ctx'))(q.Var('name')).drop()))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.collections.dropMany';
      const online = { name: BiotaFunctionName('CollectionsDropMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    expireManyAt(nameList, at) {
      const inputs = { nameList, at };
      // ---
      const query = Query(
        {
          docs: q.Map(q.Var('nameList'), q.Lambda(['name'], ResultData(collection(q.Var('ctx'))(q.Var('name')).expireAt(q.Var('at'))))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.collections.expireManyAt';
      const online = { name: BiotaFunctionName('CollectionsExpireManyAt'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    expireManyIn(nameList, delay) {
      const inputs = { nameList, delay };
      // ---
      const query = Query(
        {
          docs: q.Map(q.Var('nameList'), q.Lambda(['name'], ResultData(collection(q.Var('ctx'))(q.Var('name')).expireIn(q.Var('delay'))))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.collections.expireManyAt';
      const online = { name: BiotaFunctionName('CollectionsExpireManyAt'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    expireManyNow(nameList) {
      const inputs = { nameList };
      // ---
      const query = Query(
        {
          docs: q.Map(q.Var('nameList'), q.Lambda(['name'], ResultData(collection(q.Var('ctx'))(q.Var('name')).expireNow()))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.collections.expireManyNow';
      const online = { name: BiotaFunctionName('CollectionsExpireManyNow'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
  };
};
