// types
// external
import { query as q } from "faunadb";
// biota
import { UDFunction } from "~/factory/api/udfunction";
import { IndexName } from "~/factory/api/index";

export const FindIndex = UDFunction({
  name: "FindIndex",
  body: q.Query(

    q.Lambda(
      ["resource", "terms_fields"],
      q.Let(
        {
          indexes: q.Paginate(
            q.Intersection(
              q.Match(q.Index(IndexName("indexes__by__resource")), [
                q.Var("resource")
              ]),
              q.Union(
                q.Map(
                  q.Var("terms_fields"),
                  q.Lambda(
                    ["field"],
                    q.Match(q.Index(IndexName("indexes__by__terms")), [
                      q.Var("field")
                    ])
                  )
                )
              )
            )
          ),
          termsCount: q.Count(q.Var("terms_fields"))
        },
        q.Select(
          0,
          q.Filter(
            q.Var("indexes"),
            q.Lambda(
              ["index"],
              q.Equals(
                q.Var("termsCount"),
                q.Count(q.Select("terms", q.Get(q.Var("index")), Infinity))
              )
            )
          )
        )
      )
    )
  ),
  role: q.Role("AugmentedUser")
});