const fxy = require('fxy')
const Info = require('./info')
const values = ['query','mutation','subscription']

//exports
module.exports = function resolvers_export( resolvers, folder){
	
	let info = Info.schema
	let queries = get_queries(folder)
	let query = get_resolver('query')
	let mutation = get_resolver('mutation')
	let subscription = get_resolver('subscription')
	let data = {query,mutation,subscription}
	
	return set_resolvers(data)
	
	function get_resolver(id){
		if(!(id in info)) return []
		let name = info[id]
		return queries.map(query=>query[name]).filter(value=>fxy.is.nothing(value) === false)
	}
	
	function set_resolvers(data){
		for(let id in data){
			let name = info[id]
			let value = data[id]
			if(value.length > 0){
				let combo = [resolvers[name]].concat(value)
				resolvers[name] =  fxy.as.one(...combo)
			}
		}
		return resolvers
	}
	
}

//shared actions
function get_queries(folder){
	
	return paths().map(typepath=>queries(typepath))
	
	function paths(){
		let info = Info.schema
		return fxy.list(folder).folders
		          .filter(name=>name !== '.DS_Store')
		          .filter(name=>name !== info.folder)
		          .map(name=>fxy.join(folder,name))
	}
	
	function queries(typepath) {
		let info = Info.type
		let query_file = fxy.join(typepath, info.query_file)
		let out = {}
		if (fxy.exists(query_file)) {
			let query = require(`${query_file}`)
			if (typeof query === 'function') query = query(fxy)
			if (Array.isArray(query)) query = fxy.as.one(...query)
			if (fxy.is.data(query)) out = set_query_output(out,query)
		}
		return out
	}
}

function has_mutliple_values(query,info){ return values.filter(value=>info[value] in query).length > 0 }

function set_query_output(out,query){
	let info = Info.schema
	if(has_mutliple_values(query,info)){
		for(let i of values){
			let name = info[i]
			if(name in query) out[name] = query[name]
		}
	}
	else out[info.query] = query
	return out
}

