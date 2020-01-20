const sqlite3 = require('sqlite3').verbose();
const puppeteer = require('puppeteer');
const { graphql } = require('graphql');
const unfluff = require('unfluff');
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
    async function asyncForEach(array, callback) {
      for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
      }
    }

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
    }`).then(async result => {
      this.cache = result.data.sourceProviders;
      const browser = await puppeteer.launch();
      let posts = [];

      await asyncForEach(this.cache, async provider => {
        await asyncForEach(provider.sources, async source => {
          const results = await this.harvest(source.url, provider, source);

          posts = posts.concat(results);
        });
      });

      console.log('Start extraction');

      const arrayCopy = posts.slice(0);

      console.log(posts);

      await this.extract(arrayCopy, browser);
    });
  }

  async harvest(url = null, provider, source)
  {
    if (!url) {
      return;
    }

    // const posts = [];

    const feed = await parser.parseURL(url);

    const posts = feed.items.filter(post => {
      if (!post.isoDate) {
        return false;
      }

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

      return true;
    });

    return posts;
  }

  async extract(posts, browser)
  {
    const post = posts[0];

    console.log('Attempting extraction of URL:', post.link);
    // Get the RSS post article content
    const page = await browser.newPage();

    // Do not download images
    await page.setRequestInterception(true);

    page.on('request', request => {
      if (request.resourceType() === 'image')
        request.abort();
      else
        request.continue();
    });

    let navigationError = false;

    // Attempt to go to article page
    await page.goto(post.link).catch(err => navigationError);

    if (navigationError) {
      return;
    }

    // Check if page contains the article, or if there is a cookie wall
    let titleContent = await page.$eval('h1', el => el.textContent).catch(() => '');

    // Page H1 tag does not contain article title, assume there is a cookie wall
    if (titleContent.indexOf(post.title) === -1) {
      // Click every button on the page and wait for next page
      console.log('Click button');

      await page.waitForSelector('button').catch(err => navigationError = true);
      await page.click('button').catch(err => navigationError = true);
      await page.waitForNavigation({ waitUntil: 'domcontentloaded' }).catch(err => navigationError = true);

      if (navigationError) {
        await page.close();
        posts.shift();
        this.extract(posts, browser);

        return;
      }
    }

    // Check again if page contains the article, or if there is a cookie wall
    titleContent = await page.$eval('h1', el => el.textContent).catch(() => '');

    // Can't find article page, do nothing
    if (titleContent.indexOf(post.title) === -1) {
      console.log('Cannot find page!');

      await page.close();
      posts.shift();
      this.extract(posts, browser);

      return;
    }

    console.log('Found page!');

    // We've arrived at the article page
    // Extract the article content
    const article = unfluff(await page.content());

    // TODO: Fix unfluff not correctly extracting article content

    // Insert article content in database
    if (article.text.length > 0) {
      console.log(article);

      graphql(this.database.schema, `
      mutation {
        updatePost(
          url: "${post.link}",
          text: """${article.text}"""
        ) {
          uid
        }
      }`);
    }

    await page.close();
    posts.shift();

    if (posts.length > 0) {
      this.extract(posts, browser);
    } else {
      await browser.close();
    }
  }
}

module.exports = Harvester;
