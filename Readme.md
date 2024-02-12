To install dependencies run command: npm install
To start application run command: npm run start
Open https://localhost:4000/api/users in browser
Open https://localhost:4000/api/users/1 to get data for one specified user
Run in terminal curl -X POST -H "Content-Type: application/json" -d '{"username":"Lisichka","age":"5", "hobbies":["sit", "drink"]}' http://localhost:4000/api/users to add new user
