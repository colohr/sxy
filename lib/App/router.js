const express = require('express')
const body_parser = require('body-parser')
const { graphqlExpress, graphiqlExpress } = require('graphql-server-express')


module.exports = function graph_router(struct,options){
	if(!options) options = {}
	const router = express.Router()
	router.use(
		options.endpoint || '/graph',
		body_parser.json(),
		graphqlExpress({
			schema: struct.get('schema')
		}))
	
	router.use(
		options.ui || '/ui',
		graphiqlExpress({
			endpointURL: struct.url
		}))
	
	return router
}
