# Linus Server

This is the server used for the Linus application.

[Link](https://github.com/thinkful-ei-jaguar/TaylorP-FirstCapstone) to Linus Application GitHub

## API Endpoints

+ `/recipes` accepts GET requests along with parameters of keyword & filter, where keyword looks in the recipe name, and filter looks for the spirit category. Both need to be strings.
+ `/cabinet/:id` accepts GET and POST requests, with `:id` referring to the user_id. GET requests return all the spirits that the user has saved, and the POST request is used to add a spirit to the users collection.
+ `/favorites` accepts POST and DELETE requests. This posts and deletes new favorites, the user_id is sent via the body of the request.
+ `/favorites/:id` accepts GET requests, where `:id` is the user_id. This is used to get all the favorites of that particular user.

## Scripts

+ Start the application `npm start`

+ Start nodemon for the application `npm run dev`

+ Run the tests `npm test`

+ Migrate the Tables into database ` npm run migrate ` or ` npm run migrate:test `

+ Seed Tables with data after migration `npm run seed`

## Deployment

This Server is deployed with Heroku at `https://blooming-reef-26525.herokuapp.com`.