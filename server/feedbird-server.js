const WebSocket = require('ws');
const { graphql } = require('graphql');
const Database = require('./modules/Database');
// const Users = require('./services/UsersService');
// const Posts = require('./services/PostsService');

const database = new Database();

graphql(database.schemas['post'], `{
  posts {
    title
  }
}`).then(result => {
  console.log(result);
});

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    const parsedMessage = JSON.parse(message);

    const schema = parsedMessage['schema'];
    const query = parsedMessage['query'];
    const id = parsedMessage['id'];

    // Get data through GraphQL API
    graphql(database.schemas[schema], query).then(result => {
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
