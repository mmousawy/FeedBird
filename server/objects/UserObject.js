const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt } = require('graphql');
const { GraphQLDate } = require('graphql-iso-date');
const crypto = require('crypto');

class UserObject {
  constructor()
  {
    this.type = new GraphQLObjectType({
      name: 'UserType',
      fields: {
        id: {
          type: GraphQLInt
        },
        uid: {
          type: GraphQLString
        },
        firstname: {
          type: GraphQLString
        },
        lastname: {
          type: GraphQLString
        },
        email: {
          type: GraphQLString
        },
        password: {
          type: GraphQLString
        },
        date: {
          type: GraphQLDate
        },
        token: {
          type: GraphQLString
        }
      }
    });

    this.query = new GraphQLObjectType({
      name: 'UserQuery',
      fields: {
        auth: {
          type: this.type,
          args: {
            uid: { type: GraphQLInt },
            email: { type: GraphQLString },
            password: { type: GraphQLString }
          },
          resolve: (args) => {
            return new Promise((resolve, reject) => {
              this.db.all(`SELECT uid, firstname, lastname, email FROM users WHERE email = (?) LIMIT 1;`, [ args.email ], function(err, result) {
                if (err) {
                  reject(null);
                }

                if (!result) {
                  resolve();
                }

                const currentDate = (new Date()).getTime();
                const expireDate = new Date(currentDate + this.jwtLifespan * 60000);

                const jwt = {
                  header: {
                    alg: 'HS256',
                    typ: 'JWT'
                  },
                  payload: {
                    iat: currentDate,
                    eat: (expireDate).getTime(),
                    uid: result.uid,
                    email: result.email
                  },
                  secret: 'tomato'
                };

                // Create base64 encoded JWT parts
                jwt.headerBase64 = Buffer.from(JSON.stringify(jwt.header)).toString('base64');
                jwt.payloadBase64 = Buffer.from(JSON.stringify(jwt.payload)).toString('base64');

                // Create signature based on header and payload
                jwt.signature = crypto.createHmac('sha256', jwt.secret);
                jwt.signature.update(`${jwt.headerBase64}.${jwt.payloadBase64}`);

                // Create JWT string in the format of header.payload.signature
                const jwtString = `${jwt.headerBase64}.${jwt.signature.digest('base64')}.${jwt.payloadBase64}`;

                resolve({
                  ...result[0],
                  token: jwtString
                });
              });
            });
          }
        },
        user: {
          type: this.type,
          args: {
            uid: { type: GraphQLInt },
            email: { type: GraphQLString },
            password: { type: GraphQLString }
          },
          resolve: (args) => {
            return new Promise((resolve, reject) => {
              this.db.all(`SELECT * FROM users WHERE uid = (?) OR email = (?);`, [ args.uid, args.email ], function(err, result) {
                if (err) {
                  reject(null);
                }

                resolve(result[0]);
              });
            });
          }
        },
        users: {
          type: new GraphQLList(this.type),
          resolve: () => {
            return new Promise((resolve, reject) => {
              this.db.all(`SELECT * FROM users;`, function(err, result) {
                if (err) {
                  reject(null);
                }

                console.log(result);

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

module.exports = new UserObject();
