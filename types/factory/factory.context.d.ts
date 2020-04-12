import { FaunaRef, FaunaString, FaunaBoolean } from '../fauna';
import { Expr } from 'faunadb';

export type FactoryContext<T> = (context?: FactoryContextDefinition) => T;

export type FactoryContextDefinition =
  | {
      identity?: FaunaRef;
      session?: FaunaRef;
      callstack?: FaunaString;
      offline?: FaunaBoolean;
      hasIdentity?: FaunaBoolean;
      hasSession?: FaunaBoolean;
      logActions?: FaunaBoolean;
      annotateDocuments?: FaunaBoolean;
      skipErrors?: FaunaBoolean;
    }
  | Expr;
