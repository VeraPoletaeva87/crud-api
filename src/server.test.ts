import * as http from 'http';
import { Server } from 'http';
import { handleGetAllRequest, handlePostRequest, handleGetOneRequest, handlePutRequest, handleDeleteRequest } from './server';

let server: Server;

beforeEach(() => {
  server = http.createServer((req, res) => {
    const { pathname } = new URL(req.url || '', 'http://localhost');
    if (req.method === 'GET' && pathname === '/api/users') {
      handleGetAllRequest(res);
    } else if (req.method === 'POST' && pathname === '/api/users') {
      handlePostRequest(req, res);
    } else if (req.method === 'GET' && pathname.startsWith('/api/users/')) {
      handleGetOneRequest(req, res);
    } else if (req.method === 'PUT' && pathname.startsWith('/api/users/')) {
      handlePutRequest(req, res);
    } else if (req.method === 'DELETE' && pathname.startsWith('/api/users/')) {
      handleDeleteRequest(req, res);
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Not Found' }));
    }
  });
  server.listen();
});

afterEach(() => {
  server.close();
});

describe('API Tests', () => {
  test('returns empty array', async () => {
    const { port } = server.address() as { address: string, port: number };
    const response = await fetch(`http://localhost:${port}/api/users`);
    const data = await response.json();
    expect(data).toEqual([]);
  });

  test('a response containing newly created record is expected', async () => {
    const { port } = server.address() as { address: string, port: number };
    const user = { username: 'Wolf', age: 20, hobbies: ['eating rabbits', 'howling'] };
    const response = await fetch(`http://localhost:${port}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
    const data = await response.json();
    expect(data).toMatchObject(user);
  });

  test('Get user by id', async () => {
    const { port } = server.address() as { address: string, port: number };
    const user = { username: 'Wolf', age: 20, hobbies: ['eating rabbits', 'howling'] };
    let response = await fetch(`http://localhost:${port}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
    const userId = (await response.json()).id;
    response = await fetch(`http://localhost:${port}/api/users/${userId}`);
    const data = await response.json();
    expect(data).toMatchObject(user);
  });

  test('Update user', async () => {
    const { port } = server.address() as { address: string, port: number };
    const user = { username: 'Wolf', age: 20, hobbies: ['eating rabbits', 'howling'] };
    const createResponse = await fetch(`http://localhost:${port}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
    const userId = (await createResponse.json()).id;
    const newUser = { username: 'Wolf', age: 10, hobbies: ['eating rabbits', 'howling'] };
    const updateResponse = await fetch(`http://localhost:${port}/api/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    });
    const data = await updateResponse.json();
    expect(data).toMatchObject(newUser);
  });

  test('Delete user', async () => {
    const { port } = server.address() as { address: string, port: number };
    const user = { username: 'testuser', age: 30, hobbies: ['coding', 'reading'] };
    let response = await fetch(`http://localhost:${port}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
    const userId = (await response.json()).id;
    response = await fetch(`http://localhost:${port}/api/users/${userId}`, {
      method: 'DELETE'
    });
    expect(response.status).toBe(204);
  });
});

// scenario to test error messages when wrong user id is passed
describe('error messages', () => {
    test('an error should occur if no username is provided', async () => {
      const { port } = server.address() as { address: string, port: number };
      const user = { age: 20, hobbies: ['eating rabbits', 'howling'] };
      const response = await fetch(`http://localhost:${port}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });
      expect(response.status).toBe(400);
    });

    test('an error should occur if user is not exists', async () => {
        const { port } = server.address() as { address: string, port: number };
        const user = { username: 'Wolf', age: 20, hobbies: ['eating rabbits', 'howling'] };
        await fetch(`http://localhost:${port}/api/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(user)
        });
        const userId = 'not-existing-user';
        let response = await fetch(`http://localhost:${port}/api/users/${userId}`);
        expect(response.status).toBe(404);
      });

    
  test('an error should occur if delete user that does not exists', async () => {
    const { port } = server.address() as { address: string, port: number };
    const user = { username: 'testuser', age: 30, hobbies: ['coding', 'reading'] };
    await fetch(`http://localhost:${port}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
    const userId = 'not-existing-user';
    const response = await fetch(`http://localhost:${port}/api/users/${userId}`, {
      method: 'DELETE'
    });
    expect(response.status).toBe(404);
  });  
  });

// scenario to test that get request returns correct number of users after adding
describe('correct number of users', () => {
    let count = 0;
    test('returns an array at the beginning', async () => {
        const { port } = server.address() as { address: string, port: number };
        const response = await fetch(`http://localhost:${port}/api/users`);
        const data = await response.json();
        count = data.length;
        expect(data).toBeTruthy();
      });
    
    test('correct length of array after adding given number of users', async () => {
        const { port } = server.address() as { address: string, port: number };
        let user = { username: 'Wolf', age: 20, hobbies: ['eating rabbits', 'howling'] };
        await fetch(`http://localhost:${port}/api/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(user)
        });
        user = { username: 'Fox', age: 50, hobbies: ['eating mice', 'sleeping'] };
        await fetch(`http://localhost:${port}/api/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });
        user = { username: 'Cat', age: 50, hobbies: ['meowing', 'scratching'] };
        await fetch(`http://localhost:${port}/api/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });
        const response = await fetch(`http://localhost:${port}/api/users`);
        const data = await response.json();
        expect(data.length).toEqual(count + 3);  
    });
  });  