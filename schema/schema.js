// what properties each obj has, and how each obj is related to each other

// import graphQL
const graphql = require('graphql');
const axios = require('axios');

// destructuring madness:
const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLInt,
	GraphQLList,
	// takes in a RootQuery and returns a GraphQLSchema instance
	GraphQLSchema,
	GraphQLNonNull
} = graphql;

const CompanyType = new GraphQLObjectType({
	name: 'Company',
	// to fix circular reference with a CLOSURE: gets defined but doesn't get executed until entire file has been executed; wrapping fields object in an arrow function
	fields: () => ({
		id: { type: GraphQLString },
		name: { type: GraphQLString },
		description: { type: GraphQLString },
		// company TO a list of users (all users that belong to that company)
		users: {
			// because it's an ARRAY (list in other langs) of users, mult users for one company
			type: new GraphQLList(UserType),
			//NOTE: parentValue is the CURRENT company we are working with
			resolve(parentValue, args) {
				return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)
					.then(res => res.data);
			}
		}
	})
});

// GraphQLObjectType is used to tell GraphQL about the 'idea of a User'
const UserType = new GraphQLObjectType({
	name: 'User',
	// most important property
	fields: () => ({
		id: { type: GraphQLString },
		firstName: { type: GraphQLString },
		age: { type: GraphQLInt },
		company: {
			type: CompanyType,
			// resolve funcs take us from one node on the graph to another node (Root Query to User) for example
			resolve(parentValue, args) {
				return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
					.then(res => res.data)
			}
		}
	})
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
		},
		// code below will allow us to query companies directly:
		company: {
			type: CompanyType,
			// args let us ask for a company by a particular id
			args: { id: {
				type: GraphQLString
			}},
			resolve(parentValue, args) {
				return axios.get(`http://localhost:3000/companies/${args.id}`)
					.then(resp => resp.data);
			}
		}
	},
});

// change data in some fashion ie POST PATCH DELETE
const mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields: {
		addUser: {
			// type of data that is RETURNED
			type: UserType,
			// the data passed in: name age co id
			args: {
				// GraphQLNonNull just a helper that means you must provide a value
				firstName: { type: new GraphQLNonNull(GraphQLString) },
				age: { type: new GraphQLNonNull(GraphQLInt) },
				companyId: { type: GraphQLString },
			},
			// just destructuring args here, no big whoop
			resolve(parentValue, { firstName, age }) {
				return axios.post('http://localhost:3000/users', { firstName, age })
					.then(res => res.data);
			}
		},
		deleteUser: {
			type: UserType,
			args: { id: { type: new GraphQLNonNull(GraphQLString)} },
			resolve(parentValue, { id }) {
				return axios.delete(`http://localhost:3000/users/${id}`)
					.then(res => res.data)
			}
		},
		editUser: {
			type: UserType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLString) },
				firstName: { type: GraphQLString },
				age: { type: GraphQLInt },
				companyId: { type: GraphQLString },
			},
			resolve(parentValue, args) {
				return axios.patch(`http://localhost:3000/users/${args.id}`, args)
					.then(res => res.data);
			}
		}
	}
})

module.exports = new GraphQLSchema({
	query: RootQuery,
	// NOTE: same as mutation: mutation
	mutation
})