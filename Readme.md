To install dependencies run command: npm install

To start application run command: 
npm run start:dev - to run application in DEVELOPMENT mode
or 
npm run start:prod - to run application in PRODUCTION mode


Open https://localhost:4000/api/users in browser

Open https://localhost:4000/api/users/1 to get data for one specified user (define correct id of user that you want to get)

Run in terminal curl -X POST -H "Content-Type: application/json" -d '{"username":"Lisichka","age":"5", "hobbies":["sit", "drink"]}' http://localhost:4000/api/users to add new user

To delete item: 
Run in terminal: curl -X "DELETE" 'http://localhost:4000/api/users/dcf5f1db-e8c3-4199-9343-130df61a9c96' - define correct id of user that you want to delete

To edit item: 
Run in terminal: curl -X PUT -H "Content-Type: application/json" -d '{"username": "lisa", "age":"16", "hobbies":["sit", "drink"]}' http://localhost:4000/api/users/dac56084-24e7-4f68-bf35-a3b422606d25 - define correct id of user that you want to delete and fields that you want to edit


To check error handling you can: comment code in server.ts file inside createServer function inside try block and uncomment throw new Error(); line. It will emulate internal server error

Run: npm run test to test api