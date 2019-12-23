const { graphql, buildSchema } = require('graphql');
const crypto = require('crypto');

class Posts
{
  constructor(db)
  {
    this.db = db;
  }

  // Multiple posts
  getPosts(args)
  {
    return new Promise((resolve, reject) => {
      this.db.all(`SELECT * FROM posts;`, function(err, result) {
        if (err) {
          reject(null);
        }

        resolve(result);
      });
    });
  }
}

module.exports = Posts;
