const fxy = require('fxy')
//exports
module.exports = types_export

//shared actions
function types_export(information,structure_options){
	const folder = information.folder
	const types = get_types(folder)
	Object.defineProperty(information,'schema', {
		get(){
			return set_shared(this,set_options({
				typeDefs:types.map(type=>type.schema),
				resolvers:get_resolvers( types, folder )
			}))
		}
	})
	return information
	//shared actions
	
	function set_options(data){
		
		const options = get_rules()
		const logger = get_logger()
		if(logger) options.logger = logger
		
		return Object.assign(data,options)
		//shared actions
		function get_logger(){
			//logger is an optional argument, which can be used to print errors to the server console that are usually swallowed by GraphQL. The logger argument should be an object with a log function, eg. const logger = { log: (e) => console.log(e) }
			if('logger' in information){
				if(information.logger === false) return null
				return information.logger
			}
			return { log: (e) => console.log(e) }
		}
		function get_rules(){
			const setting = fxy.is.data(structure_options) ? structure_options:{}
			return Object.assign({
				//allowUndefinedInResolve is an optional argument, which is true by default. When set to false, causes your resolve functions to throw errors if they return undefined, which can help make debugging easier.
				allowUndefinedInResolve:true,
				//resolverValidationOptions is an optional argument which accepts an object of the following shape: { requireResolversForArgs, requireResolversForNonScalar }.
				resolverValidationOptions:{
					//requireResolversForArgs will cause makeExecutableSchema to throw an error if no resolve function is defined for a field that has arguments.
					requireResolversForArgs: setting.passive ? false:true,
					//requireResolversForNonScalar will cause makeExecutableSchema to throw an error if a non-scalar field has no resolver defined. By default, both of these are true, which can help catch errors faster. To get the normal behavior of GraphQL, set both of them to false.
					requireResolversForNonScalar:false
				},
				//allowResolversNotInSchema turns off the functionality which throws errors when resolvers are found which are not present in the schema. Defaults to false, to help catch common errors.
				allowResolversNotInSchema: setting.passive ? true:false
			},setting.resolver_options || {})
		}
	}
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

