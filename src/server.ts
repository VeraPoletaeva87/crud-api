import * as http from 'http';
import dotenv from 'dotenv';
import { parse } from 'url';
import { v4 as uuid } from 'uuid';
import { User } from './types';


let database: User[] = [];

function isUUID( uuid: string ) {
  let s = uuid;
  if (s.match('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$') === null) {
    return false;
  }
  return true;
}

// POST requests 
export function handlePostRequest(req: http.IncomingMessage, res: http.ServerResponse) {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk.toString();
  });
  req.on('end', () => {
    const newItem = JSON.parse(body);
    if (newItem?.username && newItem?.age && newItem?.hobbies) {
      newItem.id = uuid();
      database.push(newItem);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(newItem));
    } else {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Input item does not contain required fields' }));
    }
  });
}

// GET-all requests 
export function handleGetAllRequest(res: http.ServerResponse) {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(database));
}

// GET requests 
export function handleGetOneRequest(req: http.IncomingMessage, res: http.ServerResponse) {
  const { pathname } = parse(req.url || '', true);
  const id = (pathname || '').split('/')[3];
  const item = database.find((item) => item.id === id);
  if (item) {
    if (isUUID(item.id)) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(item));
    } else {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'User Id is invalid (not uuid)' }));
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'User does not exist' }));
  }
}

// PUT requests
export function handlePutRequest(req: http.IncomingMessage, res: http.ServerResponse) {
  const { pathname } = parse(req.url || '', true);
  const id = (pathname || '').split('/')[3];
  let body = '';
  req.on('data', (chunk) => {
    body += chunk.toString();
  });
  req.on('end', () => {
    const updatedItem = JSON.parse(body);
    const index = database.findIndex((item) => item.id === id);
    if (index !== -1) {
      if (isUUID(id)) {
        database[index] = { ...database[index], ...updatedItem };
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(database[index]));
      } else {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'User Id is invalid (not uuid)' }));
      }
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'User with provided id does not exist' }));
    }
  });
}

// DELETE requests 
export function handleDeleteRequest(req: http.IncomingMessage, res: http.ServerResponse) {
  const { pathname } = parse(req.url || '', true);
  const id = (pathname || '').split('/')[3];
  const index = database.findIndex((item) => item.id === id);
  if (index !== -1) {
    if (isUUID(id)) {
      database.splice(index, 1);
    res.writeHead(204);
    res.end();
    } else {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'User Id is invalid (not uuid)' }));
    }
    
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'User with provided id does not exist' }));
  }
}
dotenv.config();

const server = http.createServer((req, res) => {
  try {
    const { pathname } = parse(req.url || '', true);
    if (req.method === 'GET' && pathname === '/api/users') {
      handleGetAllRequest(res); 
    } else if (req.method === 'GET' && pathname && pathname.startsWith('/api/users/')) {
      handleGetOneRequest(req, res);
    } else if (req.method === 'POST' && pathname === '/api/users') {
      handlePostRequest(req, res);
    }
    else if (req.method === 'PUT' && pathname && pathname.startsWith('/api/users/')) {
      handlePutRequest(req, res); }
    else if (req.method === 'DELETE' && pathname && pathname.startsWith('/api/users/')) {
      handleDeleteRequest(req, res);
    } 
    else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Not Found' }));
    }
   //throw new Error();
  } catch (err) {
    console.error('Error occurred:', err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Internal Server Error' }));
  }
});

const port = process.env.DEV_PORT || 3000;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});