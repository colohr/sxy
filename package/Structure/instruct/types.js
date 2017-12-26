const fxy = require('fxy')

//exports
module.exports = types_export

//shared actions
function types_export(information){
	const folder = information.folder
	const types = get_types(folder)
	Object.defineProperty(information,'schema', {
		get(){
			return set_shared(this,{
				typeDefs:types.map(type=>type.schema),
				resolvers:get_resolvers( types, folder )
			})
		}
	})
	return information
}

function set_shared(information,types){
	if(fxy.is.nothing(information.shared)) return types
	if(fxy.is.text(information.shared)) information.shared = [information.shared]
	if(fxy.is.object(information.shared)){
		//console.log({shared:information.shared})
		let shared = fxy.is.array(information.shared) ? information.shared:[information.shared]
		let shared_schemas = get_shared(...shared)
		for(let shared_schema of shared_schemas){
			let shared_resolvers = shared_schema.resolvers
			for(let resolver in shared_resolvers){
				if(['Out','In','Push'].includes(resolver) === false){
					if(resolver in types.resolvers){
						types.resolvers[resolver] = fxy.as.one(shared_resolvers[resolver],types.resolvers[resolver])
					}else{
						types.resolvers[resolver] = shared_resolvers[resolver]
					}
				}
			}
			let shared_type_defs = shared_schema.typeDefs.filter(typeDef=>types.typeDefs.includes(typeDef) === false)
			shared_type_defs = shared_type_defs.filter(filter_schema_typedef)
			types.typeDefs = types.typeDefs.concat(shared_type_defs)
		}
	}
	return types
}

function filter_schema_typedef(typeDef){
	typeDef = typeDef.replace(/ /g,'').replace(/\r/g,'').replace(/\n/g,'')
	return typeDef.includes('schema{') === false
}

function get_shared(...shared){
	return shared.map(share=>{
		if(!fxy.is.data(share)){
			if(fxy.is.text(share)) share = {folder:share}
			else return null
		}
		let shared_type = types_export(share)
		return shared_type.schema
	}).filter(schema=>schema !== null)
}

function get_folders(folder){ return fxy.list(folder).folders.filter(name=>name !== '.DS_Store') }

function get_resolvers(types,folder){
	let resolvers = require('./resolvers')
	return resolvers( fxy.as.one(...(types.map(type=>type.resolvers))), folder )
}

function get_types(folder){
	let type = require('./type')
	return get_folders(folder).map(name => type(name, fxy.join(folder, name)))
}

