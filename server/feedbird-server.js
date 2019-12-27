const WebSocket = require('ws');
const { graphql } = require('graphql');
const Database = require('./modules/Database');
const Harvester = require('./modules/Harvester');

const database = new Database();
const harvester = new Harvester(database);

// harvester.harvest('http://feeds.feedburner.com/tweakers/mixed');

// const post = {
//   guid: 'abcdef',
//   title: 'test',
//   description: 'test description',
//   date: '2019-12-27',
//   url: 'murtada.nl',
//   source_provider_uid: 'prov-01',
//   source_uid: 'src-01'
// };

// graphql(database.schema, `
// mutation {
//   createPost(
//     guid: "${post.guid}",
//     title: "${post.title}",
//     description: "${post.description}",
//     date: "${post.date}",
//     url: "${post.url}",
//     source_provider_uid: "${post.source_provider_uid}",
//     source_uid: "${post.source_uid}"
//   ) { uid }
// }`).then(result => {
//   console.log(result);
// });

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    const parsedMessage = JSON.parse(message);

    const schema = parsedMessage['schema'];
    const query = parsedMessage['query'];
    const data = parsedMessage['data'];
    const id = parsedMessage['id'];

    if (!database.schema) {
      console.error(`Schema "${schema}" is not recognized.`);
      return;
    }

    // Get data through GraphQL API
    graphql(database.schema, query, data).then(result => {
      // Send result back to connection
      ws.send(new ApiPayload(id, result.data).pack());
    });
  });
});

class ApiPayload
{
  constructor(id = '',  data = '')
  {
    this.id = id;
    this.data = data;
  }

  pack()
  {
    return JSON.stringify({
      id: this.id,
      data: this.data
    });
  }
}
