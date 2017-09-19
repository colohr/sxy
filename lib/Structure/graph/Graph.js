const { makeExecutableSchema } = require('graphql-tools')
const fxy = require('fxy')
const graph = require('./index')
const source = require('./source')
const basename = Symbol.for('Graph basename')
const folder = Symbol.for('Graph folder')
const endpoint_url = Symbol.for('Graph endpoint url')
//
//class Graph extends Map{
//	static basename(graph){ return graph.get(basename) }
//	static folder(graph){ return graph.get(folder) }
//	static name(graph){ return this.basename(graph).trim() }
//	static source(graph){ return source(graph) }
//	static url(graph){ return graph.get(endpoint_url) }
//	constructor({url, types, io, firebase_name, no_scalars, dictionaries}){
//		super(graph_map(firebase_name,io,no_scalars,types,url,dictionaries))
//		this.path = `/${this.name}`
//	}
//	get folder(){ return this.get(folder) }
//	get name(){ return Graph.name(this) }
//	get source(){ return Graph.source(this) }
//	get url(){ return this.get(endpoint_url) }
//}


class Graph extends Map{
	static basename(graph){ return graph.get(basename) }
	static folder(graph){ return graph.get(folder) }
	static name(graph){ return this.basename(graph).trim() }
	static source(graph){ return source(graph) }
	static url(graph){ return graph.get(endpoint_url) }
	constructor(...x){
		super([
			[basename, fxy.basename(x[0])],
			[endpoint_url, x[1]],
			[folder, x[0]]
		])
		this.path = `/${this.name}`
	}
	get folder(){ return this.get(folder) }
	get name(){ return Graph.name(this) }
	get source(){ return Graph.source(this) }
	get url(){ return this.get(endpoint_url) }
}

class GraphStructure extends Graph{
	constructor(options){
		super(options.types.folder,options.url)
		if(options.library) register_graph_library(this,options.library)
		set_graph_sources(this,options)
		set_graph_types(this,options)
	}
	get types(){ return get_graph_types(this) }
}

//exports
module.exports = GraphStructure

//shared actions
function register_graph_library(graph,name){
	let library_name = typeof name === 'string' ? name:graph.name
	return require('../../Module').library({name:library_name}).graph_struct(graph)
}

function set_graph_sources(graph,{firebase,io}){
	if(io) graph.set('io',io)
	if(firebase) graph.set('firebase',firebase)
	return graph
}

function set_graph_types(graph,{types,no_scalars,dictionaries}){
	if(!fxy.is.array(dictionaries)) dictionaries = []
	graph.set('schema', get_executable_schema(types,no_scalars,...dictionaries))
	graph.set('types',types)
	return graph
}

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
	if(dictionaries.length) schema = set_dictionaries(schema,...dictionaries)
	return makeExecutableSchema(schema)
}

function set_dictionaries(schema,...names){
	return schema
	let Dictionary = require('../../Dictionary')
	let dictionaries = names.map(name=>Dictionary[name]).filter(dictionary=>dictionary!==null)
	for(let dictionary of dictionaries) schema = dictionary.combine(schema)
	return schema
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
