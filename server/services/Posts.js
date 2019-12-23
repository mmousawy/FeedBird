export class Posts
{
  constructor()
  {

  }

  schema()
  {
    return buildSchema(`
      type Query {
        user(id: Int!): Person
        users(gender: String): [Person]
      },
      type Person {
        id: Int
        name: String
        age: Int
        gender: String
      },
      type Mutation {
        updateUser(id: Int!, name: String!, age: String): Person
      }
    `);
  }
}
