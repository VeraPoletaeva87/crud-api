import * as http from 'http';
import { parse } from 'url';

let database: any[] = [
  {
      id: "1",
      username: "Kot Kotovich",
      age: 10,
      hobbies: ["eat", "sleep"]
  },
  {
      id: "2",
      username: "Pes Psovich",
      age: 5,
      hobbies: ["walk", "chew your shoes"]
  }
  ];
// const dir = dirname(fileURLToPath(import.meta.url));
// const fileName = join(dir, 'data.json');
// const text = await readFile(fileName, 'utf8');
// database = JSON.parse(text);

function generateId(): string {
  return Math.floor(Math.random() * 1000).toString();
}

// POST requests 
function handlePostRequest(req: http.IncomingMessage, res: http.ServerResponse) {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk.toString();
  });
  req.on('end', () => {
    const newItem = JSON.parse(body);
    newItem.id = generateId();
    database.push(newItem);
    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(newItem));
  });
}

// GET-all requests 
function handleGetAllRequest(res: http.ServerResponse) {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(database));
}

// GET requests 
function handleGetOneRequest(req: http.IncomingMessage, res: http.ServerResponse) {
  const { pathname } = parse(req.url || '', true);
  const id = (pathname || '').split('/')[3];
  const item = database.find((item) => item.id === id);
  console.log(item, '-', id, '-', pathname);
  if (item) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(item));
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Item not found' }));
  }
}

// // Function to handle PUT requests
// function handlePutRequest(req: http.IncomingMessage, res: http.ServerResponse) {
//   const { pathname } = parse(req.url || '', true);
//   const id = parseInt((pathname || '').split('/')[2]);
//   let body = '';
//   req.on('data', (chunk) => {
//     body += chunk.toString();
//   });
//   req.on('end', () => {
//     const updatedItem = JSON.parse(body);
//     const index = database.findIndex((item) => item.id === id);
//     if (index !== -1) {
//       database[index] = { ...database[index], ...updatedItem };
//       res.writeHead(200, { 'Content-Type': 'application/json' });
//       res.end(JSON.stringify(database[index]));
//     } else {
//       res.writeHead(404, { 'Content-Type': 'application/json' });
//       res.end(JSON.stringify({ message: 'Item not found' }));
//     }
//   });
// }

// // Function to handle DELETE requests 
// function handleDeleteRequest(req: http.IncomingMessage, res: http.ServerResponse) {
//   const { pathname } = parse(req.url || '', true);
//   const id = parseInt((pathname || '').split('/')[2]);
//   const index = database.findIndex((item) => item.id === id);
//   if (index !== -1) {
//     database.splice(index, 1);
//     res.writeHead(204);
//     res.end();
//   } else {
//     res.writeHead(404, { 'Content-Type': 'application/json' });
//     res.end(JSON.stringify({ message: 'Item not found' }));
//   }
// }

const server = http.createServer((req, res) => {
  const { pathname } = parse(req.url || '', true);
  if (req.method === 'GET' && pathname === '/api/users') {
    handleGetAllRequest(res); 
  } else if (req.method === 'GET' && pathname && pathname.startsWith('/api/users/')) {
    handleGetOneRequest(req, res);
  } else if (req.method === 'POST' && pathname === '/api/users') {
    handlePostRequest(req, res);
  }
  // else if (req.method === 'PUT' && pathname && pathname.startsWith('/api/users/')) {
  //   handlePutRequest(req, res);
  // } else if (req.method === 'DELETE' && pathname && pathname.startsWith('/api/users/')) {
  //   handleDeleteRequest(req, res);
  // } 
  else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Not Found' }));
  }
});

const port = process.env.DEV_PORT || 3000;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});