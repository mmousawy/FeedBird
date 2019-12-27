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

    this.resolvers = {
      getSource: (parent, args, context, info) => {
        return new Promise((resolve, reject) => {
          this.db.all(`SELECT * FROM source WHERE uid = (?) LIMIT 1;`, [ (args.uid || parent.source_provider_uid) ], function(err, result) {
            if (err) {
              reject(null);
            }

            resolve(result[0] || {});
          });
        });
      },
      getSourcesByProvider: (parent, args, context, info) => {
        return new Promise((resolve, reject) => {
          this.db.all(`SELECT * FROM sources WHERE source_provider_uid = (?);`, [ parent.uid ], function(err, result) {
            if (err) {
              reject(null);
            }

            resolve(result);
          });
        });
      }
    }

    this.query = new GraphQLObjectType({
      name: 'SourceQuery',
      fields: {
        source: {
          type: this.type,
          args: {
            uid: { type: GraphQLInt },
            email: { type: GraphQLString },
            password: { type: GraphQLString }
          },
          resolve: this.resolvers.getSource
        },
        sourcesByProvider: {
          type: new GraphQLList(this.type),
          resolve: this.resolvers.getSourcesByProvider
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
