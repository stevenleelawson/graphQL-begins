// ALL THE LOGIC RELATED TO THE EXPRESS APP

// pull in express and graphql:
const express = require('express');
const expressGraphQL = require('express-graphql').graphqlHTTP

// bring in schema file
const schema = require('./schema/schema');

// create a new express app:
const app = express();

// if any request comes in with /graphql, we want the graphql lib to handle it
app.use('/graphql', expressGraphQL({
	// NOTE: ES6 saame as schema: schema since key and val are same
	schema,
	graphiql: true
}));

// tell it to listen to port 4000
app.listen(4000, () => {
	console.log('listenin')
});
