const fxy = require('fxy')
const { merge } = require('lodash')
const language = require('./graph/language')
const Graph = require('./graph/Graph')
//const Model  = require('./sql/model')

//{output:'Output',input:'Input',push:'Push'}
//const root_names = {output:'Output',input:'Input',push:'Push'}

const info = require('./information.json')

module.exports = Structure
module.exports.Graph = Graph
//module.exports.Model = Model


class LanguageStructureGraph extends Graph{
	get language(){ return language(this, get_models_structs(this)) }
}

function Structure({ url, folder, io, data_types}){
	const information = {
		folder,
		data_types,
	}
	return new LanguageStructureGraph(url, get_types(information) , io)
}

Structure.IO = function graph_input_output(service){
	return {
		service
	}
}


function get_models_structs(graph){
	return fxy.tree(graph.folder,'js')
	          .items.only;
	         // .map(file=>{
			//	let value = require(`${file.get('path')}`)
			//	let model = fxy.is.nothing(value) ? null:(fxy.is.function(value.model) ? value.model:null)
			//	if(model) file.models = model(Model,graph)
			//	else return null
			//	return file
			//}).filter(file=>file !== null)
}


function get_types(information){
	const folder = information.folder
	const names = fxy.ls(folder).dirs.filter(dir=>dir !== '.DS_Store')
	const types = names.map(name => get_type(name, fxy.join(folder, name)))
	Object.defineProperty(information,'schema', {
		get(){
			const type_resolvers = types.map(type=>type.resolvers)
			const resolvers = get_query_resolvers( merge(...type_resolvers), folder )
			const typeDefs = types.map(type=>type.schema)
			return { typeDefs, resolvers }
		}
	})
	return information
}

function get_type( name, directory ){
	return {
		get resolvers(){
			let resolvers = [{}]
			let type = this.type
			if(info.resolver in type) resolvers.push( type.resolver )
			resolvers = set_scalars(resolvers)
			return merge(...resolvers)
		},
		get schema(){
			let schemas = [ fxy.readFileSync( fxy.join(directory,`${name}.graphql`), 'utf8' ) ]
			let scalars = fxy.join( directory, info.type.scalars.folder, info.type.scalars.file )
			if(fxy.exists(scalars)) schemas.push( fxy.readFileSync( scalars, 'utf8') )
			return schemas.join('\n')
		},
		get type(){
			return require(fxy.join(directory,`/${info.type.file}`))
		}
	}
	
	function set_scalars(resolvers){
		let scalar_path = fxy.join(directory,info.type.scalars)
		if(fxy.exists(scalar_path)) {
			let scalars = new Set( fxy.ls( scalar_path ).files('js').filter( name => !(info.type.scalars.index_file.includes(name))) )
			let output = {}
			for(let name of scalars) output[ name.replace('.js','') ] = require( fxy.join(scalar_path, name) )
			resolvers.push( output )
		}
		return resolvers
	}
}

function get_query_resolvers( resolvers, folder){
	
	const dirpaths = fxy.ls(folder).dirs.filter(name=>name!==info.schema.folder).map(name=>fxy.join(folder,name))
	const queries = dirpaths.map(typepath=>get_queries(typepath))
	
	//const outs = queries.map(query=>{ return query.Out }).filter(out=>{ return typeof out === 'object' })
	//const ins = queries.map(query=>{ return query.In }).filter(input=>{ return typeof input === 'object' })
	//const pushes = queries.map(query=>{ return query.Push }).filter(push=>{ return typeof push === 'object' })
	//
	const query = get_resolver('query',queries)
	const mutation = get_resolver('input',queries)
	const subscription = get_resolver('push',queries)
	
	return set_resolvers(resolvers,{query,mutation,subscription})
	
	
	
	//return resolvers
	
	function get_queries(typepath) {
		let main_query_path = fxy.join(typepath, 'query.js')
		if (fxy.exists(main_query_path)) {
			let main_query = require(`${main_query_path}`)
			let res = {}
			if (typeof main_query === 'function') res = main_query(merge, fxy)
			else res = main_query
			if (typeof res === 'object' && res !== null) {
				let out = {}
				if (Array.isArray(res)) res = merge(...res)
				if(info.query in res) out[info.query] = res[info.query]
				if(info.mutation in res) out[info.mutation] = res[info.mutation]
				if(info.subscription in res) out[info.subscription] = res[info.subscription]
				//if ('In' in res || 'Out' in res || 'Push' in res) {
				//	if ('In' in res) out.In = res.In
				//	if ('Out' in res) out.Out = res.Out
				//	if ('Push' in res) out.Push = res.Push
				//}
				if (info.mutation in out || info.query in out || info.subscription in out) return out
				out[info.query] = res
				return out
			}
		}
		return {}
	}
	
	function get_resolver(name,queries){
		if(!(name in info)) return []
		return queries.map(query=>{ return query[info[name]] }).filter(out=>typeof out === 'object')
	}
	function set_resolvers(resolvers,data){
		for(let key in data){
			if(key in info && !is_empty(data[key])){
				resolvers[info[key]] =  merge(...[resolvers[info[key]]].concat(data[info[key]]))
			}
		}
		return resolvers
		//resolvers[output] = merge(...[resolvers[output]].concat(outs))
		//resolvers[input] = merge(...[resolvers[input]].concat(ins))
		//resolvers[push] = merge(...[resolvers[push]].concat(pushes))
	}
	
}

function is_empty(array){
	if(Array.isArray(array) && array.length > 0) return false
	return true
}