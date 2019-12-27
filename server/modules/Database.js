const sqlite3 = require('sqlite3').verbose();
const { mergeSchemas } = require('graphql-tools');
const requiredObjects = [
  '../objects/Post',
  '../objects/PostContent',
  '../objects/User',
  '../objects/SourceProvider',
  '../objects/Source'
];

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
      CREATE TABLE IF NOT EXISTS "posts" (
        "id" integer,
        "uid" text,
        "guid" text,
        "title" text,
        "description" text,
        "date" text,
        "source_provider_uid" text,
        "source_uid" text,
        PRIMARY KEY("id"),
        UNIQUE("guid","title","date")
      )
    `,`
      CREATE TABLE IF NOT EXISTS "source_providers" (
        "id" integer,
        "uid" text,
        "name" text,
        "date" text,
        PRIMARY KEY("id")
      )
    `,`
      CREATE TABLE IF NOT EXISTS "sources" (
        "id" integer,
        "uid" text,
        "source_provider_uid" text,
        "name" text,
        "url" text,
        "category_suggested" text,
        "date" text,
        PRIMARY KEY("id")
      )
    `,`
      CREATE TABLE IF NOT EXISTS "subscriptions" (
        "id" integer PRIMARY KEY,
        "uid" text,
        "user_uid" text,
        "source_uid" text
      )
    `,`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" integer PRIMARY KEY,
        "uid" text,
        "firstname" text,
        "lastname" text,
        "email" text,
        "password" text,
        "date" text
      )
    `];

    tableSchemas.forEach(schema => {
      this.instance.exec(schema);
    });

    return;
  }

  initSchemas()
  {
    const schemas = [];

    requiredObjects.forEach(objectUrl => {
      const object = require(objectUrl);

      object.bindDatabase(this.instance);

      schemas.push(object.schema);
    })

    this.schema = mergeSchemas({
      schemas
    });
  }
}

module.exports = Database;
