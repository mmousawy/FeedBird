const WebSocket = require('ws');
const { graphql } = require('graphql');
const Database = require('./modules/Database');
const Harvester = require('./modules/Harvester');

const database = new Database();
const harvester = new Harvester(database);

// harvester.harvest('http://feeds.feedburner.com/tweakers/mixed');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    const parsedMessage = JSON.parse(message);

    const schema = parsedMessage['schema'];
    const query = parsedMessage['query'];
    const data = parsedMessage['data'];
    const id = parsedMessage['id'];

    if (!database.schemas[schema]) {
      console.error(`Schema "${schema}" is not recognized.`);
      return;
    }

    // Get data through GraphQL API
    graphql(database.schemas[schema], query, data).then(result => {
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
