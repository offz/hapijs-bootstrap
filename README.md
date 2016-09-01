# Hapi boilerplate for REST APIs
This project serves as a _personal_ REST API boilerplate for future projects with [Hapi](http://hapijs.com/). 

__It is my playground for best practices and new approaches.__ 

## Technology
- [Hapi](http://hapijs.com/)
- MongoDB with Mongoose
- [Swagger](http://swagger.io/) for generating the documentation
- Tests and coverage via Istanbul, Mocha and Chai

## Approaches
- Session authentication via own custom plugin
- Very basic approaches to user management (registration, login, password resetting)

## Start
Run `mongod` and `npm start` to start the server locally. You can use a `env` file to set the `PORT` and a `MONGOLAB_URI` for your database. 

Check the current module versions beforehand and use [nvm](https://github.com/creationix/nvm) if necessary.

## Tests
All tests are written in ES6 syntax. Source maps are accurate so far. 

Use `npm run coverage` to get a report via [Istanbul's CLI nyc](https://github.com/istanbuljs/nyc).

## Documentation
I use [hapi-swagger](https://github.com/glennjones/hapi-swagger) to generate a documentation. If the server is running, you can reach it via `/doc`.



