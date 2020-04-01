// types
import {
  DBFrameworkCollectionFieldOptions,
  FaunaIndexOptions,
  FaunaCollectionOptions,
  FaunaIndexTerm,
  FaunaIndexValue
} from "~/../types/db";
// external
import { query as q } from "faunadb";
// biota
import { execute } from "~/tasks";
import * as helpers from "~/helpers";
import { indexNameNormalized, NGramOnField, Index } from "~/factory/classes/index";
import { upsert } from "~/factory/api/upsert";
import { DB } from "~/db";

export function fieldDefinition(field: string | DBFrameworkCollectionFieldOptions) {
  let definition: DBFrameworkCollectionFieldOptions = {
    inputs: [],
    outputs: [],
    // if one field
    field: undefined,
    data: {},
    reverse: false,
    binding: undefined,
    //
    name: undefined,
    action: undefined,
    ngram: false,
    ngramMin: 3,
    ngramMax: 10,
    // values: [],
    unique: false,
    serialized: undefined,
    permissions: undefined
  };

  if (typeof field === "string") {
    definition.name = field;
    definition.field = field;
  } else if (typeof field === "object") {
    Object.assign(definition, field);
  }
  return definition;
}

export function field(this: DB, collectionDefinition: FaunaCollectionOptions) {
  let self = this;

  return async function fieldMethod(field: string | DBFrameworkCollectionFieldOptions) {
    let definition: DBFrameworkCollectionFieldOptions = fieldDefinition(field);

    let index: FaunaIndexOptions = Index({
      source: {
        collection: q.Collection(collectionDefinition.name),
        fields: {}
      },
      // values: definition.values,
      unique: definition.unique,
      serialized: definition.serialized,
      // permissions: definition.permissions,
      data: definition.data
    });

    let tasks = [];

    // index inputs [] outputs []
    // index field for search
    // index field for search - ngram
    // index binding (2 ways, as term and as value)

    const buildTerm = ({ field, binding, reverse }: { field?: any; binding?: any; reverse?: boolean }, fields = {}) => {
      if (binding) {
        let bindingName = helpers.stringPath(field || "cursor");
        fields[bindingName] = binding;
        return { binding: bindingName, reverse };
      } else if (field) {
        return {
          field: helpers.path(field),
          reverse
        };
      }
    };

    // for search
    if (definition.action === "index") {
      if (definition.field) {
        index.terms = [
          buildTerm({ field: definition.field, binding: definition.binding, reverse: definition.reverse }, index.source.fields)
        ];
      } else if (definition.inputs.length > 0) {
        index.terms = (definition.inputs as FaunaIndexTerm[]).map((input: string | FaunaIndexTerm) => {
          if (typeof input === "string") {
            return buildTerm({ field: input }, index.source.fields);
          } else if (input.binding) {
            return buildTerm({ field: input.field, binding: input.binding, reverse: input.reverse }, index.source.fields);
          } else if (input.field) {
            return buildTerm({ field: input.field }, index.source.fields);
          }
        });
      } else {
        index.terms = [
          {
            field: ["ref"]
          }
        ];
      }

      if (definition.outputs.length > 0) {
        index.values = (definition.outputs as FaunaIndexValue[]).map((input: string | FaunaIndexValue) => {
          if (typeof input === "string") {
            return buildTerm({ field: input }, index.source.fields);
          } else if (input.binding) {
            let bindingName = helpers.stringPath(input.field) || "cursor";
            index.source.fields[helpers.stringPath(bindingName)] = input.binding;
            return buildTerm({ field: input.field, binding: input.binding, reverse: input.reverse }, index.source.fields);
          } else if (input.field) {
            return buildTerm({ field: input.field }, index.source.fields);
          }
        });
      } else {
        index.values = [
          {
            field: ["ref"]
          }
        ];
      }

      index.name = indexNameNormalized(
        helpers.name([collectionDefinition.name, "search", "on", helpers.stringPath(definition.name || definition.field)])
      );

      // if (definition.field === "at") {
      //   console.log(JSON.stringify(index, null, 2));
      // }

      if (definition.ngram) {
        if (index.terms.length > 0 && index.terms.length > 1) {
          throw new Error(`Can't produce an ngram index with ${index.terms.length} terms`);
        }

        let fieldName = "";
        try {
          fieldName = helpers.stringPath(definition.field || index.terms[0].field);
        } catch (error) {
          throw new Error(`Couldn't find a correct field name`);
        }

        let ngramFieldName = "ngram:" + fieldName;
        let ngramIndex: FaunaIndexOptions = {
          name: indexNameNormalized(helpers.name([collectionDefinition.name, "ngram", "on", helpers.stringPath(fieldName)])),
          source: {
            collection: q.Collection(collectionDefinition.name),
            fields: {
              [ngramFieldName]: q.Query(q.Lambda("instance", q.Distinct(NGramOnField(definition.ngramMax, helpers.path(definition.field)))))
            }
          },
          terms: [
            {
              binding: ngramFieldName
            }
          ],
          serialized: true,
          data: definition.data
        };

        tasks.push({
          name: `Creating (ngram search) index: ${ngramIndex.name}`,
          async task() {
            return self.query(upsert.index(ngramIndex));
          },
          fullError: true
        });
      } else {
        tasks.push({
          name: `Creating (search) index: ${index.name}`,
          async task() {
            return self.query(upsert.index(index));
          }
        });
      }
    }
    // for value
    else if (definition.action === "compute") {
      const fieldOrName = definition.field || definition.name;
      index.source.fields[fieldOrName] = definition.binding;

      let indexByBinding = {
        ...index,
        name: indexNameNormalized(helpers.name([collectionDefinition.name, "compute", "on", helpers.stringPath(fieldOrName)])),
        values: [
          {
            binding: fieldOrName
          }
        ],
        terms: [
          {
            field: ["ref"]
          }
        ]
      };

      tasks.push({
        name: `Creating (search compute) index: ${indexByBinding.name}`,
        async task() {
          return self.query(upsert.index(indexByBinding));
        }
      });

      // let indexByRef = {
      //   ...index,
      //   name: indexNameNormalized(
      //     helpers.name([collectionDefinition.name, "computed", "as", helpers.stringPath(definition.name || definition.field)])
      //   ),
      //   values: [
      //     {
      //       field: ["ref"]
      //     }
      //   ],
      //   terms: [
      //     {
      //       binding: definition.field
      //     }
      //   ]
      // };

      // tasks.push({
      //   name: `Creating (compute value) index: ${indexByRef.name}`,
      //   async task() {
      //     return self.query(upsert.index(indexByRef));
      //   }
      // });
    }

    // console.log("definition", definition);

    return execute(tasks, {
      domain: "DB.collection.field"
    });
  };
}
