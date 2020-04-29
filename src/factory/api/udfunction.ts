import { query as q } from 'faunadb';
import { MethodDispatch, MethodQuery, SafeMethodDispatch } from '~/factory/constructors/method';
import { ResultAction, ResultData } from '~/factory/constructors/result';
import { FactoryContext } from '~/types/factory/factory.context';
import { FactoryUDFunction } from '~/types/factory/factory.udfunction';
import { BiotaRoleName } from '../constructors/role';
import { action } from './action';
import { BiotaFunctionName, DocumentRef } from './constructors';
import { document } from './document';
import { ThrowError } from '../constructors/error';

// tslint:disable-next-line: only-arrow-functions
export const udfunction: FactoryContext<FactoryUDFunction> = function (context): FactoryUDFunction {
  // tslint:disable-next-line: only-arrow-functions
  return (name = null) => {
    return {
      exists() {
        const inputs = { name };
        // ↓↓↓↓
        const query = MethodQuery(
          {
            check: q.If(q.IsString(q.Var('name')), true, ThrowError(q.Var('ctx'), "Name isn't a string", { name: q.Var('name') })),
            doc: q.Exists(q.Function(q.Var('name'))),
          },
          q.Var('doc'),
        );
        // ↓↓↓↓
        const offline = 'factory.udfunction.exists';
        const online = {
          name: BiotaFunctionName('UDFunctionExists'),
          role: q.Role(BiotaRoleName('system')),
          data: { meta: { addToRoles: [BiotaRoleName('public'), BiotaRoleName('user')] } },
        };
        return SafeMethodDispatch({ context, inputs, query })(offline, online);
      },
      get() {
        const inputs = { name };
        // ↓↓↓↓
        const query = MethodQuery(
          {
            doc: q.Get(q.Function(q.Var('name'))),
          },
          q.Var('doc'),
        );
        // ↓↓↓↓
        const offline = 'factory.udfunction.get';
        const online = { name: BiotaFunctionName('UDFunctionGet'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      insert(options) {
        const inputs = { name, options };
        // ---
        const query = MethodQuery(
          {
            annotated: ResultData(document(q.Var('ctx'))().annotate('insert', q.Select('data', q.Var('options'), {}))),
            definition: q.Merge(q.Var('options'), { name: q.Var('name'), data: q.Var('annotated') }),
            doc: q.CreateFunction(q.Var('definition')),
            action: action(q.Var('ctx'))().log('insert', DocumentRef(q.Var('doc'))),
          },
          q.Var('doc'),
          q.Var('action'),
        );
        // ---
        const offline = 'factory.udfunction.insert';
        const online = { name: BiotaFunctionName('UDFunctionInsert'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      update(options) {
        const inputs = { name, options };
        // ---
        const query = MethodQuery(
          {
            annotated: ResultData(document(q.Var('ctx'))().annotate('update', q.Select('data', q.Var('options'), {}))),
            doc: q.Update(q.Function(q.Var('name')), q.Merge(q.Var('options'), { data: q.Var('annotated') })),
            action: action(q.Var('ctx'))().log('update', DocumentRef(q.Var('doc'))),
          },
          q.Var('doc'),
          q.Var('action'),
        );
        // ---
        const offline = 'factory.udfunction.update';
        // const online = null
        const online = { name: BiotaFunctionName('UDFunctionUpdate'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      upsert(options) {
        const inputs = { name, options };
        // ---
        const query = MethodQuery(
          {
            doc: q.If(
              q.Exists(q.Function(q.Var('name'))),
              udfunction(q.Var('ctx'))(q.Var('name')).update(q.Var('options')),
              udfunction(q.Var('ctx'))(q.Var('name')).insert(q.Var('options')),
            ),
          },
          ResultData(q.Var('doc')),
          ResultAction(q.Var('doc')),
        );
        // ---
        const offline = 'factory.udfunction.upsert';
        const online = { name: BiotaFunctionName('UDFunctionUpsert'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      replace(options) {
        const inputs = { name, options };
        // ---
        const query = MethodQuery(
          {
            current_doc: ResultData(udfunction(q.Var('ctx'))(q.Var('name')).get()),
            annotated: ResultData(
              document(q.Var('ctx'))().annotate(
                'replace',
                q.Merge(q.Select('data', q.Var('options'), {}), {
                  _auth: q.Select('_auth', q.Var('current_doc'), {}),
                  _membership: q.Select('_membership', q.Var('current_doc'), {}),
                  _validity: q.Select('_validity', q.Var('current_doc'), {}),
                  _activity: q.Select('_activity', q.Var('current_doc'), {}),
                }),
              ),
            ),
            doc: q.Replace(q.Function(q.Var('name')), q.Merge(q.Var('options'), { data: q.Var('annotated') })),
            action: action(q.Var('ctx'))().log('replace', DocumentRef(q.Var('doc'))),
          },
          q.Var('doc'),
          q.Var('action'),
        );
        // ---
        const offline = 'factory.udfunction.replace';
        const online = { name: BiotaFunctionName('UDFunctionReplace'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      repsert(options) {
        const inputs = { name, options };
        // ---
        const query = MethodQuery(
          {
            doc: q.If(
              q.Exists(q.Function(q.Var('name'))),
              udfunction(q.Var('ctx'))(q.Var('name')).replace(q.Var('options')),
              udfunction(q.Var('ctx'))(q.Var('name')).insert(q.Var('options')),
            ),
          },
          ResultData(q.Var('doc')),
          ResultAction(q.Var('doc')),
        );
        // ---
        const offline = 'factory.udfunction.repsert';
        const online = { name: BiotaFunctionName('UDFunctionRepsert'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      delete() {
        const inputs = { name };
        // ---
        const query = MethodQuery(
          {
            doc: ResultData(document(q.Var('ctx'))(q.Var('name')).validity.delete()),
          },
          q.Var('doc'),
        );
        // ---
        const offline = 'factory.udfunction.delete';
        const online = { name: BiotaFunctionName('UDFunctionDelete'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      forget() {
        const inputs = { name };
        // ---
        const query = MethodQuery(
          {
            annotated: ResultData(document(q.Var('ctx'))().annotate('forget')),
            annotated_doc: ResultData(udfunction(q.Var('ctx'))(q.Var('name')).upsert(q.Var('annotated'))),
            action: action(q.Var('ctx'))().log('forget', DocumentRef(q.Var('annotated_doc'))),
            doc: q.Delete(q.Function(q.Var('name'))),
          },
          q.Var('doc'),
          q.Var('action'),
        );
        // ---
        const offline = 'factory.udfunction.forget';
        const online = { name: BiotaFunctionName('UDFunctionForget'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      drop() {
        const inputs = { name };
        // ---
        const query = MethodQuery(
          {
            doc: q.If(q.Exists(q.Function(q.Var('name'))), udfunction(q.Var('ctx'))(q.Var('name')).forget(), {}),
          },
          ResultData(q.Var('doc')),
          ResultAction(q.Var('doc')),
        );
        // ---
        const offline = 'factory.udfunction.drop';
        const online = { name: BiotaFunctionName('UDFunctionClean'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      expireAt(at) {
        // alias
        const inputs = { name, at };
        // ↓↓↓↓
        const query = MethodQuery(
          {
            doc: ResultData(document(q.Var('ctx'))(q.Var('name')).validity.expire(q.Var('at'))),
          },
          q.Var('doc'),
        );
        // ↓↓↓↓
        const offline = 'factory.udfunction.expireAt';
        const online = { name: BiotaFunctionName('UDFunctionExpireAt'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      expireIn(delay) {
        // alias
        const inputs = { name, delay };
        // ↓↓↓↓
        const query = MethodQuery(
          {
            doc: ResultData(
              document(q.Var('ctx'))(q.Var('name')).validity.expire(q.TimeAdd(q.Now(), q.ToNumber(q.Var('delay')), 'milliseconds')),
            ),
          },
          q.Var('doc'),
        );
        // ↓↓↓↓
        const offline = 'factory.udfunction.expireIn';
        const online = { name: BiotaFunctionName('UDFunctionExpireIn'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      expireNow() {
        // alias
        const inputs = { name };
        // ↓↓↓↓
        const query = MethodQuery(
          {
            doc: ResultData(document(q.Var('ctx'))(q.Var('name')).validity.expire(q.Now())),
          },
          q.Var('doc'),
        );
        // ↓↓↓↓
        const offline = 'factory.udfunction.expireNow';
        const online = { name: BiotaFunctionName('UDFunctionExpireNow'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      restore() {
        // alias
        const inputs = { name };
        // ↓↓↓↓
        const query = MethodQuery(
          {
            doc: ResultData(document(q.Var('ctx'))(q.Var('name')).validity.restore()),
          },
          q.Var('doc'),
        );
        // ↓↓↓↓
        const offline = 'factory.collection.restore';
        const online = { name: BiotaFunctionName('UDFunctionRestore'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
    };
  };
};
