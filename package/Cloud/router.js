const fxy = require('fxy')
const express = require('express')
const body_parser = require('body-parser')
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express')

//exports
module.exports = get_router

//shared actions
function get_router(struct,options){
	const data = get_data(struct,options)
	const router = express.Router()
	const graph = get_graph(struct,data,options)
	router.use(data.endpoint.path, body_parser.json(), graph)
	router.use(data.ui.path, graphiqlExpress(data.ui.options))
	return router
}

function get_data(struct,options){
	const data = {
		endpoint: {path: '/graph'},
		ui: {
			options: {
				endpointURL: struct.url,
				get passHeader(){ return require('../Module')('developer/header') }
			},
			path: '/ui'
		}
	}
	
	if(options){
		if(options.endpoint) data.endpoint.path = options.endpoint
		if(options.ui) data.ui.path = options.ui
	}
	return data
}

function get_graph(struct){
	const graph = { schema:struct.get('schema') }
	return graphqlExpress(function graph_request(...x){
		if('context' in struct) graph.context = struct.context(...x)
		if('root' in struct) graph.rootValue = struct.root(...x)
		if('directives' in struct || 'extensions' in struct || 'response' in struct) graph.formatResponse = get_graph_formatter(struct)
		if('fields' in struct) graph.fieldResolver = struct.fields
		return graph
	})
}

function get_graph_formatter(struct){
	return async function format_response(result,...x){
		if('response' in struct) result = await struct.response(result, ...x)
		if('extensions' in struct){
			const extensions = fxy.as.one(result.extensions,await struct.extensions(result.extensions || {}, result, ...x))
			if(!fxy.is.empty(extensions)) result.extensions = extensions
		}
		return struct.field.data(result,...x)
	}
}

function get_ui_options(){
	const optionals = {
		query: String, // optional query to pre-populate the GraphiQL UI with
		operationName: String, // optional operationName to pre-populate the GraphiQL UI with
		variables: Object, // optional variables to pre-populate the GraphiQL UI with
		result: Object, // optional result to pre-populate the GraphiQL UI with
		passHeader: String, // a string that will be added to the outgoing request header object (e.g "'Authorization': 'Bearer lorem ipsum'")
		editorTheme: String, // optional CodeMirror theme to be applied to the GraphiQL UI
	}
	return optionals
}

