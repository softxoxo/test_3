2 Task

1. git clone -b task_2 https://github.com/softxoxo/test_3.git
2. cd test_3/
3. npm i
4. update the ormconfig.js with your db
5. npm run start

To create a db tables copy tables.sql and paste into pgAdmin
To create a list of users run command "npx typeorm-ts-node-esm migration:run -d ./ormconfig.js"
