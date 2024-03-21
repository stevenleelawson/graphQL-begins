// what properties each obj has, and how each obj is related to each other

// import graphQL
const graphql = require('graphql');
const axios = require('axios');

// destructuring madness:
const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLInt,
	// takes in a RootQuery and returns a GraphQLSchema instance
	GraphQLSchema
} = graphql;

// GraphQLObjectType is used to tell GraphQL about the 'idea of a User'
const UserType = new GraphQLObjectType({
	name: 'User',
	// most important property
	fields: {
		id: { type: GraphQLString },
		firstName: { type: GraphQLString },
		age: { type: GraphQLInt }
	}
});

const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
		user: {
			type: UserType,
			// if you give me the id of the User you are looking for, will get it for ya || id gets passed in in args obj
			args: { id: { type: GraphQLString } },
			// most important propery:
			// also: parentValue is notorious for NEVER BEING USED, EVER
			resolve(parentValue, args) {
				return axios.get(`http://localhost:3000/users/${args.id}`)
				// pairing down response obj to make axios work nicely
					.then(resp => resp.data)
			}
		}
	}
});

module.exports = new GraphQLSchema({
	query: RootQuery
})