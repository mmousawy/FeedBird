const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt } = require('graphql');
const { GraphQLDate } = require('graphql-iso-date');
// const sourceProviderType = require('./SourceProviderSchema').sourceProviderType;
// const categoryType = require('./CategorySchema').categoryType;
const postContentType = require('./PostContentObject').type;

class PostObject {
  constructor()
  {
    this.type = new GraphQLObjectType({
      name: 'PostType',
      fields: {
        id: {
          type: GraphQLInt
        },
        uid: {
          type: GraphQLString
        },
        // source_provider: {
        //   type: sourceProviderType
        // },
        source_provider: {
          type: GraphQLString
        },
        category: {
          type: GraphQLString
        },
        // category: {
        //   type: categoryType
        // },
        title: {
          type: GraphQLString
        },
        description: {
          type: GraphQLString
        },
        content: {
          type: postContentType
        },
        url: {
          type: GraphQLString
        },
        date: {
          type: GraphQLDate
        }
      }
    });

    this.query = new GraphQLObjectType({
      name: 'PostQuery',
      fields: {
        post: {
          type: this.type,
          args: {
            id: { type: GraphQLInt }
          },
          resolve: (source, {id}) => {
            console.log('RUN A!');

            return {

            };
          }
        },
        posts: {
          type: new GraphQLList(this.type),
          resolve: () => {
            console.log('RUN B!');
            return new Promise((resolve, reject) => {
              this.db.all(`SELECT * FROM posts;`, function(err, result) {
                if (err) {
                  reject(null);
                }

                console.log(result);

                resolve(result);
              });
            })
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

module.exports = new PostObject();
