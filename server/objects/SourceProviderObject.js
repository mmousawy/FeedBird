const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt } = require('graphql');
const { GraphQLDate } = require('graphql-iso-date');
const SourceObject = require('./SourceObject');

class SourceProviderObject {
  constructor()
  {
    this.type = new GraphQLObjectType({
      name: 'SourceProviderType',
      fields: {
        id: {
          type: GraphQLInt
        },
        uid: {
          type: GraphQLString
        },
        name: {
          type: GraphQLString
        },
        date: {
          type: GraphQLDate
        },
        sources: {
          type: new GraphQLList(SourceObject.type)
        }
      }
    });

    this.query = new GraphQLObjectType({
      name: 'SourceProviderQuery',
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
              this.db.all(`SELECT * FROM source_providers WHERE uid = (?) OR name LIKE %(?)%;`, [ args.uid, args.name ], function(err, result) {
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
              this.db.all(`SELECT * FROM source_providers;`, function(err, result) {
                if (err) {
                  reject(null);
                }

                // TODO: Resolve nested sources as well

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

module.exports = new SourceProviderObject();
