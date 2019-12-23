const { graphql, buildSchema } = require('graphql');
const crypto = require('crypto');

class Users
{
  constructor(db)
  {
    this.db = db;
    this.jwtLifespan = 3; // In minutes

    // this.schema = buildSchema(`
    //   type Query {
    //     user(uid: String!): User
    //     users(): [User]
    //   },
    //   type User {
    //     id: Int
    //     uid: String
    //     firstname: String
    //     lastname: String
    //     email: String
    //     date: String
    //   },
    //   type Mutation {
    //     updateUser(uid: String!, firstname: String!): User
    //   }
    // `);
  }

  authUser(args)
  {
    return new Promise((resolve, reject) => {
      this.db.each(`SELECT * FROM users WHERE email = (?) AND password = (?);`, [ args.email, args.password ], function(err, result) {
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

        console.log(jwtString);

        resolve({ token: jwtString });
      });
    });
  }

  // Single user
  getUser(args)
  {
    return new Promise((resolve, reject) => {
      this.db.each(`SELECT * FROM users WHERE uid = (?);`, [ args.uid ], function(err, rows) {
        if (err) {
          reject(null);
        }

        resolve(rows[0]);
      });
    });
  }

  // Multiple users
  getUsers(args)
  {
    return new Promise((resolve, reject) => {
      this.db.each(`SELECT * FROM users;`, [ args.uid ], function(err, rows) {
        if (err) {
          reject(null);
        }

        resolve(rows[0]);
      });
    });
  }
}

module.exports = Users;
