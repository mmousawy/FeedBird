const sqlite3 = require('sqlite3').verbose();
const { graphql } = require('graphql');
const Parser = require('rss-parser');
const parser = new Parser();

class Harvester
{
  constructor(database)
  {
    this.database = database;
    this.cache = [];

    this.update();
  }

  update()
  {
    graphql(this.database.schemas.source_provider, `
    {
      sourceProviders {
        uid,
        name,
        sources {
          uid,
          name,
          url
        }
      }
    }`).then(result => {
      console.log(result);

      this.cache = result.data;
    });
  }

  async harvest(url = null)
  {
    if (!url) {
      return;
    }

    const feed = await parser.parseURL(url);

    feed.items.forEach(item => {
    });
  }
}

module.exports = Harvester;
