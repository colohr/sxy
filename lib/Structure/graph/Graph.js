const express = require('express')
const body_parser = require('body-parser')
const { graphqlExpress, graphiqlExpress } = require('graphql-server-express')
const { makeExecutableSchema } = require('graphql-tools')
const fxy = require('fxy')
const graph = require('./index')

const source = function(graph) {
	return {
		get api() { return require('../api') },
		get firebase(){ return require('firebase-admin') },
		get database() {
			if(graph.has('firebase')) return require('../database')(graph.get('firebase'))
			return require('../database')
		},
		get mongo() { return require('../mongo') },
		get sql() { return require('../sql')(graph) },
		
	}
}

class Graph extends Map{
	static basename(graph){ return graph.get(Symbol.for('Graph basename')) }
	static folder(graph){ return graph.get(Symbol.for('Graph folder')) }
	static name(graph){ return fxy.id._( this.basename(graph) ) }
	static source(graph){ return source(graph) }
	static url(graph){ return graph.get(Symbol.for('Graph url')) }
	constructor(url, types, io, firebase_name){
		let graphs = [
			[Symbol.for('Graph basename'), fxy.basename(types.folder)],
			[Symbol.for('Graph folder'), types.folder],
			[Symbol.for('Graph url'), url]
		]
		graphs.push([ 'types', types ])
		graphs.push([ 'schema', makeExecutableSchema( graph.scalars.combine(types.schema) ) ])
		if(io) graphs.push(['io',io])
		if(firebase_name) graphs.push('firebase',firebase_name)
		super(graphs)
	}
	app(graph_struct){
		
		const graph_path = graph_struct.path || '/graph'
		const ui_path = graph_struct.ui || '/ui'
		const app = express()
		const routes = {}
		routes[graph_path] = {
			schema: this.get('schema')
		}
		routes[ui_path] = {
			endpointURL: this.url
		}
		app.use(graph_path, body_parser.json(), graphqlExpress(routes[graph_path]))
		app.use(ui_path, graphiqlExpress(routes[ui_path]))
		this.delete('schema')
		this.delete('types')
		return app
	}
	get folder(){ return Graph.folder(this) }
	get name(){ return Graph.name(this) }
	get paths(){ return this.url.split('/') }
	get path(){ return `/${this.paths[this.paths.length-2] || this.paths[0]}` }
	get source(){ return Graph.source(this) }
	get url(){ return Graph.url(this) }
}




module.exports = Graph
