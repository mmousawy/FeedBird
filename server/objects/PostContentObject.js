const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt } = require('graphql');
const { GraphQLDate } = require('graphql-iso-date');
// const sourceProviderType = require('./SourceProviderSchema').sourceProviderType;
// const categoryType = require('./CategorySchema').categoryType;

class PostContentObject {
  constructor()
  {
    this.type = new GraphQLObjectType({
      name: 'PostContentType',
      fields: {
        id: {
          type: GraphQLInt
        },
        uid: {
          type: GraphQLString
        },
        content: {
          type: GraphQLString
        }
      }
    });

    this.query = new GraphQLObjectType({
      name: 'PostContentQuery',
      fields: {
        content: {
          type: this.type,
          args: {
            id: { type: GraphQLInt }
          },
          resolve: (source, {id}) => {
            return {
              id: 1,
              uid: 'content-1',
              content: 'Test content'
            };
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

module.exports = new PostContentObject();
