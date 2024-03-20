// what properties each obj has, and how each obj is related to each other

// import graphQL
const graphql = require('graphql');

// goddamn lodash
const _ = require('lodash');

// destructuring madness:
const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLInt,
	// takes in a RootQuery and returns a GraphQLSchema instance
	GraphQLSchema
} = graphql;

// hardcoded data:
const users = [
	{ id: '23', firstName: 'Bill', age: 20 },
	{ id: '47', firstName: 'Arya', age: 3 },
]
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

			// stupid lodash
			// resolve(parentValue, args) {
			// 	return _.find(users, { id: args.id })
			// }
			
			// no lodash beeeyatch!!!!!!!!
			resolve(parentValue, args) {
				return users.find(user => user.id === args.id)
			}
		}
	}
});

module.exports = new GraphQLSchema({
	query: RootQuery
})