const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt } = require('graphql');
const { GraphQLDate } = require('graphql-iso-date');
const SourceObject = require('./Source');

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
          type: new GraphQLList(SourceObject.type),
          resolve: SourceObject.resolvers.getSourcesByProvider
        }
      }
    });

    this.resolvers = {
      getSourceProvider: (parent, args, context, info) => {
        return new Promise((resolve, reject) => {
          this.db.all(`SELECT * FROM source_providers WHERE uid = (?) LIMIT 1;`, [ (args.uid || parent.source_provider_uid) ], function(err, result) {
            if (err) {
              reject(null);
            }

            resolve(result[0] || {});
          });
        });
      },
      getSourceProviders: (parent, args, context, info) => {
        return new Promise((resolve, reject) => {
          this.db.all(`SELECT * FROM source_providers;`, function(err, result) {
            if (err) {
              reject(null);
            }

            resolve(result);
          });
        });
      },
      searchSourceProvider: (parent, args, context, info) => {
        return new Promise((resolve, reject) => {
          this.db.all(`SELECT * FROM source_providers WHERE name LIKE (?);`, [ args.name ? `%${args.name}%` : null ], function(err, result) {
            if (err) {
              reject(null);
            }

            resolve(result);
          });
        });
      },
    }

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
          resolve: this.resolvers.getSourceProvider
        },
        sourceProviders: {
          type: new GraphQLList(this.type),
          resolve: this.resolvers.getSourceProviders
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
