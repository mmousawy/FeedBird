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

    // this.update();
  }

  update()
  {
    graphql(this.database.schema, `
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
      this.cache = result.data.sourceProviders;

      this.cache.forEach(provider => {
        provider.sources.forEach(async source => {
          const posts = await this.harvest(source.url);

          posts.forEach(post => {
            console.log(post);

            console.log(post);

            graphql(this.database.schema, `
            mutation {
              createPost(
                guid: "${post.guid}",
                title: "${post.title}",
                description: "${post.contentSnippet}",
                date: "${post.isoDate}",
                url: "${post.link}",
                source_provider_uid: "${provider.uid}",
                source_uid: "${source.uid}"
              ) {
                uid
              }
            }`);
          })
        });
      })
    });
  }

  async harvest(url = null)
  {
    if (!url) {
      return;
    }

    // const posts = [];

    const feed = await parser.parseURL(url);

    // feed.items.forEach(item => {
    //   posts.push(item);
    // });

    return feed.items;
  }
}

module.exports = Harvester;
