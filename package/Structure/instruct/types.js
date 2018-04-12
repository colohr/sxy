const fxy = require('fxy')
const {is} = fxy
const scalars = require('./scalars')
const info = require('./information').definition
const combine = (...x)=>fxy.as.one(...x)
const types = require('../Pointer').storage('definitions')
const instructions = require('../Pointer').storage('instructions')
types.resolvers = require('../Pointer').storage('resolvers')

//exports
module.exports = function(information, structure_options){
	const options = get_options(information, structure_options)
	let definitions = [].concat(types.get(information.folder))

	if(is.array(information.shared)){
		const shared = information.shared
		definitions = definitions.concat(shared.map(folder=>types.get(folder)).reduce((list,folder)=>list.concat(folder),[]))
	}

	const schema = { typeDefs: Array.from(new Set(definitions)) }
	if(!information.shared){
		const value = require('./resolvers')(get_resolvers(information.folder), information.folder)
		types.resolvers.set(information.folder, value)
		schema.resolvers = get_resolver_value(information)
	}

	Object.defineProperty(information, 'schema', {
		get(){
			if(information.shared){ schema.resolvers = get_resolver_value(information) }
			schema.typeDefs = schema.typeDefs.concat(instructions.get(information.folder))
			return assign(schema, options)
		}
	})

	return information
}

//module.exports.read_definitions = (structs_folder)=>{
//	const items = fxy.list(structs_folder).folders
//	for(const struct of items){
//		const location = fxy.join(structs_folder,struct)
//		get_struct_definitions(location)
//	}
//	return items.paths
//}


function get_resolvers(folder){
	let file = fxy.join(folder, `${info.resolver_file}`)
	let resolver = {}
	if(fxy.exists(file)) resolver = require(file)
	let resolvers = [resolver].concat(scalars.resolvers(folder))
	return fxy.as.one(...resolvers)
}


function get_resolver_value(information){
	const value = require('./resolvers')(get_resolvers(information.folder), information.folder)
	types.resolvers.set(information.folder, value)
	const base = fxy.as.one(types.resolvers.get(information.folder),{})
	const shared = information.shared ? information.shared.map(item=>types.resolvers.get(item)):null
	if(shared) return set_resolvers(base,fxy.as.one(...shared))
	return base
}

function set_resolvers(resolvers, shared){
	for(const name in shared){
		if(['Out', 'In', 'Push'].includes(name) === false){
			if(name in resolvers) resolvers[name] = combine(shared[name], resolvers[name])
			else resolvers[name] = shared[name]
		}
	}
	return resolvers
}

function get_struct_definitions(folder){
	const names = fxy.list(folder).folders
	const list = new Set()
	for(const name of names){
		const location = fxy.join(folder, name)
		const items = get_folder_definitions(name, location, folder)
		for(const item of items) list.add(item)
	}
	return types.set(folder, Array.from(list)).get(folder)
}

function get_folder_definitions(name, folder, x){
	let files = fxy.list(folder).files(info.file)
	if(!files[0]) files = fxy.list(folder).files(`${name}.graphql`)

	const items = []
	items.push(scalars.schema(folder))

	const filename = files[0]
	if(!filename) return items
	const file = fxy.join(folder, filename)
	if(file){
		const content = fxy.read_file_sync(file, 'utf8')
		if(name === 'Instruct') instructions.set(x, [content])
		else items.push(content)
	}
	items.name = name
	return items
}


function assign(...x){ return Object.assign(...x) }

function get_options(information, structure_options){
	const options = get_rules(structure_options)
	const logger = get_logger()
	if(logger) options.logger = logger
	return options
	//shared actions
	function get_logger(){
		//logger is an optional argument, which can be used to print errors to the server console that are usually swallowed by GraphQL. The logger argument should be an object with a log function, eg. const logger = { log: (e) => console.log(e) }
		if('logger' in information) return information.logger === false ? null:information.logger
		return { log: (e) => console.log(e) }
	}
}

function get_rules(structure_options){
	const setting = fxy.is.data(structure_options) ? structure_options:{}
	return Object.assign({
		//allowUndefinedInResolve is an optional argument, which is true by default. When set to false, causes your resolve functions to throw errors if they return undefined, which can help make debugging easier.
		allowUndefinedInResolve:true,
		//resolverValidationOptions is an optional argument which accepts an object of the following shape: { requireResolversForArgs, requireResolversForNonScalar }.
		resolverValidationOptions:{
			//requireResolversForArgs will cause makeExecutableSchema to throw an error if no resolve function is defined for a field that has arguments.
			requireResolversForArgs: setting.passive !== true,
			//requireResolversForNonScalar will cause makeExecutableSchema to throw an error if a non-scalar field has no resolver defined. By default, both of these are true, which can help catch errors faster. To get the normal behavior of GraphQL, set both of them to false.
			requireResolversForNonScalar:false,
			requireResolversForAllFields:false,
			requireResolversForResolveType:false,
			allowResolversNotInSchema:false
		},
		//allowResolversNotInSchema turns off the functionality which throws errors when resolvers are found which are not present in the schema. Defaults to false, to help catch common errors.
		allowResolversNotInSchema: setting.passive === true,
		inheritResolversFromInterfaces:false
	},setting.resolver_options || {})
}

//if(information.logger === false) return null
//return information.logger