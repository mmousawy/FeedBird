const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt } = require('graphql');
const { GraphQLDate } = require('graphql-iso-date');

class SourceObject {
  constructor()
  {
    this.type = new GraphQLObjectType({
      name: 'SourceType',
      fields: {
        id: {
          type: GraphQLInt
        },
        uid: {
          type: GraphQLString
        },
        source_provider_uid: {
          type: GraphQLString
        },
        name: {
          type: GraphQLString
        },
        url: {
          type: GraphQLString
        },
        category_suggested: {
          type: GraphQLString
        },
        date: {
          type: GraphQLDate
        }
      }
    });

    this.query = new GraphQLObjectType({
      name: 'SourceQuery',
      fields: {
        sourceProvider: {
          type: this.type,
          args: {
            uid: { type: GraphQLInt },
            email: { type: GraphQLString },
            password: { type: GraphQLString }
          },
          resolve: (args) => {
            return new Promise((resolve, reject) => {
              this.db.all(`SELECT * FROM sources WHERE uid = (?) OR name LIKE %(?)%;`, [ args.uid, args.name ], function(err, result) {
                if (err) {
                  reject(null);
                }

                resolve(result[0]);
              });
            });
          }
        },
        sourceProviders: {
          type: new GraphQLList(this.type),
          resolve: () => {
            return new Promise((resolve, reject) => {
              this.db.all(`SELECT * FROM sources;`, function(err, result) {
                if (err) {
                  reject(null);
                }

                resolve(result);
              });
            });
          }
        }
      }
    });

    this.schema = new GraphQLSchema({
      query: this.query
    });
  }

  bindDatabase(db)
  {
    this.db = db;
  }
}

module.exports = new SourceObject();
