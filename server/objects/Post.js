const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt, GraphQLNonNull } = require('graphql');
const { GraphQLDateTime } = require('graphql-iso-date');
const nanoid = require('nanoid');
const SourceProviderObject = require('./SourceProvider');
const SourceObject = require('./Source');
// const categoryType = require('./Category').type;
const postContentType = require('./PostContent').type;

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
        guid: {
          type: GraphQLString
        },
        source: {
          type: SourceObject.type,
          resolve: SourceObject.resolvers.getSource
        },
        source_provider: {
          type: SourceProviderObject.type,
          resolve: SourceProviderObject.resolvers.getSourceProvider
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
          type: GraphQLDateTime
        }
      }
    });

    this.resolvers = {
      getPost: (parent, args, context, info) => {
        return new Promise((resolve, reject) => {
          this.db.all(`SELECT * FROM posts WHERE uid = (?) LIMIT 1;`, function(err, result) {
            if (err) {
              reject(null);
            }

            resolve(result);
          });
        });
      },
      getPosts: (parent, args, context, info) => {
        return new Promise((resolve, reject) => {
          this.db.all(`SELECT * FROM posts ORDER BY date DESC;`, function(err, result) {
            if (err) {
              reject(null);
            }

            resolve(result);
          });
        });
      },
      createPost: (parent, args, context, info) => {
        return new Promise((resolve, reject) => {
          const uid = nanoid(8);

          this.db.all(`INSERT OR IGNORE INTO posts (uid, guid, title, description, date, source_provider_uid, source_uid) VALUES (?, ?, ?, ?, ?, ?, ?);`, [ uid, args.guid, args.title, args.description, args.date, args.source_provider_uid, args.source_uid ], (err, result) => {
            if (err) {
              reject(null);
            }

            console.log(args);

            this.db.get(`SELECT last_insert_rowid() as id`, (err, row) => {
              console.log(row);
              resolve({
                uid: uid,
                guid: args.guid,
                title: args.title,
                description: args.description,
                date: args.date,
                source_provider_uid: args.source_provider_uid,
                source_uid: args.source_uid
              });
            });
          });
        });
      },
    };

    this.query = new GraphQLObjectType({
      name: 'PostQuery',
      fields: {
        post: {
          type: this.type,
          args: {
            id: { type: GraphQLInt }
          },
          resolve: this.resolvers.getPost
        },
        posts: {
          type: new GraphQLList(this.type),
          resolve: this.resolvers.getPosts
        }
      }
    });

    this.mutations = new GraphQLObjectType({
      name: 'PostMutation',
      fields: {
        createPost: {
          type: this.type,
          args: {
            guid: {
              type: GraphQLNonNull(GraphQLString)
            },
            title: {
              type: GraphQLNonNull(GraphQLString)
            },
            description: {
              type: GraphQLNonNull(GraphQLString)
            },
            date: {
              type: GraphQLNonNull(GraphQLString)
            },
            url: {
              type: GraphQLNonNull(GraphQLString)
            },
            source_provider_uid: {
              type: GraphQLNonNull(GraphQLString)
            },
            source_uid: {
              type: GraphQLNonNull(GraphQLString)
            }
          },
          resolve: this.resolvers.createPost
        }
      }
    });

    this.schema = new GraphQLSchema({
      query: this.query,
      mutation: this.mutations
    });
  }

  bindDatabase(db)
  {
    this.db = db;
  }
}

module.exports = new PostObject();
