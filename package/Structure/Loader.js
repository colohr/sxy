const { makeExecutableSchema } = require('graphql-tools')
const Print = require('../Print')
const fxy = require('fxy')
const dictionary = require('./dictionary')

const StructureBase = require('./Base')

class StructureLoader extends StructureBase{
	constructor(options){
		super(options.types.folder,options.url)
		if(options.library) register_library(this,options.library)
		this.loaded = load_structure(this,options)
	}
	get Types(){ return this.get('schema').getTypeMap() }
	get print(){ return get_printer(this) }
	get types(){ return get_types(this) }
	get web_component(){ return this.get('types').web_component }
}

//exports
module.exports = StructureLoader

//shared actions
function get_printer(structure){
	return new Proxy((value)=>{return Print(value || structure.get('schema'))},{
		get(o,name){
			let types = structure.Types
			if(name in types) return o(types[name])
			return null
		}
	})
}

function get_schema(types,no_scalars){
	let schema = types.schema
	if(!no_scalars) schema = dictionary.scalars.combine(schema)
	return makeExecutableSchema(schema)
}

function get_types(structure){
	const instruct = require('./instruct')(structure.info)
	const folder = structure.folder
	return new Proxy({folder},{
		get(o,name){
			if(fxy.is.text(name)) return instruct.type.class(o.folder,name)
			return null
		}
	})
}

function load_structure(structure,options){
	const {types,no_scalars} = options
	structure.set('schema', get_schema(types,no_scalars))
	structure.set('types',types)
	
	for(let name in options){
		if(!(name in structure))  {
			let value = options[name]
			if(typeof value === 'function') structure[name] = value.bind(structure)
			else structure[name] = value
		}
	}
	
	return true
}

function register_library(structure,name){
	name = fxy.is.text(name) ? name:structure.name
	return require('../Module').library({name}).graph_struct(structure)
}


//
//class Graph extends Map{
//	static basename(graph){ return graph.get(basename) }
//	static folder(graph){ return graph.get(folder) }
//	static name(graph){ return this.basename(graph).trim() }
//	static source(graph){ return source(graph) }
//	static url(graph){ return graph.get(endpoint_url) }
//	constructor(...x){
//		super([
//			[basename, fxy.basename(x[0])],
//			[endpoint_url, x[1]],
//			[folder, x[0]]
//		])
//		this.path = `/${this.name}`
//	}
//	get folder(){ return this.get(folder) }
//	get name(){ return Graph.name(this) }
//	get source(){ return Graph.source(this) }
//	get url(){ return this.get(endpoint_url) }
//}


//
//function set_dictionaries(schema,...names){
//	return schema
//	let Dictionary = require('../../Dictionary')
//	let dictionaries = names.map(name=>Dictionary[name]).filter(dictionary=>dictionary!==null)
//	for(let dictionary of dictionaries) schema = dictionary.combine(schema)
//	return schema
//}
//
//function graph_map(firebase,io,no_scalars,types,url,dictionaries){
//	if(!fxy.is.array(dictionaries)) dictionaries = []
//	let map = [
//		[basename, fxy.basename(types.folder)],
//		[endpoint_url, url],
//		[folder, types.folder],
//		['schema',  get_executable_schema(types,no_scalars,...dictionaries)],
//		['types',types]
//	]
//	if(io) map.push(['io',io])
//	if(firebase) map.push('firebase',firebase)
//	return map
//}
