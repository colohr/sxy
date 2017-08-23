
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
		super(graph_map(firebase_name,io,no_scalars,types,url,dictionaries))
		this.path = `/${this.name}`
	}
	get folder(){ return this.get(folder) }
	get name(){ return GraphMap.name(this) }
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
