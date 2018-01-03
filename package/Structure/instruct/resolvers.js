const fxy = require('fxy')
const Info = require('./info')
const values = ['query','mutation','subscription']
const is = require('./is')

//exports
module.exports = resolvers_export

//shared actions
function get_instruct(folder){
	//return value
	const values =  paths().map(typepath=>queries(typepath))
	return {
		get is(){ return values.map(item=>item.is) },
		get queries(){ return values.map(item=>item.out) }
	}
	
	//shared actions
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
		return get_instruct_file(query_file)
	}
}

function get_queries(folder){
	//return value
	return paths().map(typepath=>queries(typepath))
	
	//shared actions
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
		return get_instruct_file(query_file)
	}
}


function get_instruct_file(file){
	let out = {}
	let is_types = {}
	if (fxy.exists(file)) {
		let query = require(`${file}`)
		if (fxy.is.function(query)) query = query(fxy)
		if (fxy.is.array(query)) query = fxy.as.one(...query)
		if (fxy.is.data(query)) {
			is_types = is.type(query)
			out = set_query_output(out,query)
		}
	}
	return { out, is:is_types }
}

function has_multiple_values(query,info){
	return values.filter(value=>info[value] in query).length > 0
}

function resolvers_export( resolvers, folder){
	
	let info = Info.schema
	let instruct = get_instruct(folder)
	let queries = instruct.queries
	let query = get_resolver('query')
	let mutation = get_resolver('mutation')
	let subscription = get_resolver('subscription')
	let data = {query,mutation,subscription}
	
	//return value
	return set_resolvers(data)
	
	//shared actions
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
		return is.combine(resolvers,...instruct.is)
	}
}

function set_query_output(out,query){
	let info = Info.schema
	if(has_multiple_values(query,info)){
		for(let i of values){
			let name = info[i]
			if(name in query) out[name] = query[name]
		}
	}
	else out[info.query] = query
	return out
}

