
const { makeExecutableSchema } = require('graphql-tools')

const fxy = require('fxy')
const graph = require('./index')
const source = require('./source')


const basename = Symbol.for('Graph basename')
const folder = Symbol.for('Graph folder')
const endpoint_url = Symbol.for('Graph endpoint url')


class GraphMap extends Map{
	static basename(graph){ return graph.get(basename) }
	static folder(graph){ return graph.get(folder) }
	static name(graph){ return fxy.id._(this.basename(graph)) }
	static source(graph){ return source(graph) }
	static url(graph){ return graph.get(endpoint_url) }
	constructor({url, types, io, firebase_name, no_scalars, dictionaries}){
		//let graphs = [
		//	[basename, fxy.basename(types.folder)],
		//	[endpoint_url, url],
		//	[folder, types.folder],
		//	graph_schema(types,no_scalars),
		//	['types',types]
		//]
		//graphs.push(['types',types])
		//graphs.push(graph_schema(types,no_scalars))
		//if(io) graphs.push(['io',io])
		//if(firebase_name) graphs.push('firebase',firebase_name)
		
		super(graph_map(firebase_name,io,no_scalars,types,url,dictionaries))
		this.path = `/${this.paths[this.paths.length-2] || this.paths[0]}`
		
	}
	app(options){ return get_graph_app(this,options) }
	get folder(){ return this.get(folder) }
	get name(){ return GraphMap.name(this) }
	get paths(){ return this.url.split('/') }
	get url(){ return this.get(endpoint_url) }
}

class Graph extends GraphMap{
	get source(){ return Graph.source(this) }
	get types(){ return get_graph_types(this) }
}


module.exports = Graph

//shared actions
function graph_map(firebase,io,no_scalars,types,url,dictionaries){
	if(!fxy.is.array(dictionaries)) dictionaries = []
	let map = [
		[basename, fxy.basename(types.folder)],
		[endpoint_url, url],
		[folder, types.folder],
		['schema',  get_executable_schema(types,no_scalars,...dictionaries)],
		['types',types]
	]
	if(io) map.push(['io',io])
	if(firebase) map.push('firebase',firebase)
	return map
}

function get_executable_schema(types,no_scalars,...dictionaries){

	let schema = types.schema
	if(!no_scalars) schema = graph.scalars.combine(schema)

	if(dictionaries.length){
		schema = set_dictionaries(schema,...dictionaries)
	}

	return makeExecutableSchema(schema)
	//return makeExecutableSchema( no_scalars ? types.schema : graph.scalars.combine(types.schema) )
}

function set_dictionaries(schema,...names){
	let Dictionary = require('../../Dictionary')
	let dictionaries = names.map(name=>Dictionary[name]).filter(dictionary=>dictionary!==null)
	for(let dictionary of dictionaries) schema = dictionary.combine(schema)
	return schema
}

function get_graph_app(struct,options){
	if(!fxy.is.data(options)) options = {}
	//const graph_path = options.path || '/graph'
	//const ui_path = options.ui || '/ui'
	const app = express()
	
	app.use(
		options.path || '/graph',
		body_parser.json(),
		graphqlExpress({
			schema: struct.get('schema')
		})
	)
	
	app.use(
		options.ui || '/ui',
		graphiqlExpress({
			endpointURL: struct.url
		})
	)
	
	//this.delete('schema')
	struct.delete('types')
	
	return app
}


function get_graph_types(graph){
	const instruct = require('../instruct')
	const folder = graph.folder
	return new Proxy({folder},{
		get(o,name){
			if(fxy.is.text(name)) return instruct.type.class(o.folder,name)
			return null
		}
	})
}





//const source = function(graph) {
//	return {
//		get api() { return require('../api') },
//		get firebase(){ return require('firebase-admin') },
//		get database() {
//			if(graph.has('firebase')) return require('../database')(graph.get('firebase'))
//			return require('../database')
//		},
//		get mongo() { return require('../mongo') },
//		get sql() { return require('../sql')(graph) },
//
//	}
//}




//app(graph_struct){
//
//	if(!graph_struct) graph_struct = {}
//	const graph_path = graph_struct.path || '/graph'
//	const ui_path = graph_struct.ui || '/ui'
//	const app = express()
//	const routes = {}
//	routes[graph_path] = {
//		schema: this.get('schema')
//	}
//	routes[ui_path] = {
//		endpointURL: this.url
//	}
//	app.use(graph_path, body_parser.json(), graphqlExpress(routes[graph_path]))
//	app.use(ui_path, graphiqlExpress(routes[ui_path]))
//	this.delete('schema')
//	this.delete('types')
//
//	return app
//}

//get folder(){ return Graph.folder(this) }
//get name(){ return Graph.name(this) }
//get path(){ return `/${this.paths[this.paths.length-2] || this.paths[0]}` }
//get paths(){ return this.url.split('/') }
