const sqlite3 = require('sqlite3').verbose();
const PostContentObject = require('../objects/PostContentObject');
const PostObject = require('../objects/postObject');

class Database
{
  constructor()
  {
    // Create database
    this.instance = new sqlite3.Database("../feedbird.db");
    this.resolvers = null;

    // Initialize database tables
    this.initTables();
    this.initSchemas();
  }

  initTables()
  {
    // Set up the tables
    const tableSchemas = [`
      CREATE TABLE IF NOT EXISTS posts (
        id integer PRIMARY KEY,
        uid text,
        title text,
        description text,
        date text,
        provider integer
      );
    `,`
      CREATE TABLE IF NOT EXISTS sources (
        id integer PRIMARY KEY,
        uid text,
        provider_uid text,
        name text,
        category_suggested text,
        date text
      );
    `,`
      CREATE TABLE IF NOT EXISTS users (
        id integer PRIMARY KEY,
        uid text,
        firstname text,
        lastname text,
        email text,
        password text,
        date text
      );
    `,`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id integer PRIMARY KEY,
        uid text,
        user_uid text,
        source_uid text
      );
    `];

    tableSchemas.forEach(schema => {
      this.instance.exec(schema);
    });

    return;
  }

  initSchemas()
  {
    PostObject.bindDatabase(this.instance);
    PostContentObject.bindDatabase(this.instance);

    this.schemas = {
      post: PostObject.schema,
      postContent: PostContentObject.schema
    };
  }
}

module.exports = Database;
