const fxy = require('fxy')
const Schemas = require('./Schemas')
const shared = require('./shared')


//exports
module.exports = types_export

//shared actions
function assign_schema(information,schema){
	if(!fxy.is.data(schema)) schema = {}
	if(Schemas.has(information.folder)) Object.assign(Schemas.get(information.folder),schema)
	else Schemas.set(information.folder,schema)
	return Schemas.get(information.folder)
}

function assign_definitions(information,set_definitions){
	let schema = null
	if(!Schemas.has(information.folder)) schema = assign_schema(information)
	else schema = Schemas.get(information.folder)
	if(!('typeDefs' in schema)) schema.typeDefs = Schemas.types(information.folder).map(type=>type.schema)
	if(set_definitions) schema.typeDefs = set_definitions
	return schema.typeDefs
}

function assign_directives(information,set_directives){
	let schema = null
	if(!Schemas.has(information.folder)) schema = assign_schema(information)
	else schema = Schemas.get(information.folder)
	if(!('schemaDirectives' in schema)) schema.schemaDirectives = Schemas.directives( Schemas.types(information.folder), information.folder )
	if(set_directives) schema.schemaDirectives = set_directives
	return schema.schemaDirectives
}

function assign_resolvers(information,set_resolvers){
	let schema = null
	if(!Schemas.has(information.folder)) schema = assign_schema(information)
	else schema = Schemas.get(information.folder)
	if(!('resolvers' in schema)) schema.resolvers = Schemas.resolvers( Schemas.types(information.folder), information.folder )
	if(set_resolvers) schema.resolvers = set_resolvers
	return schema.resolvers
}

function types_export(information,structure_options){
	//const folder = information.folder
	//const types = get_types(folder)
	const options = get_options(information,structure_options)
	const schema = {
		get typeDefs(){ return assign_definitions(information) },
		set typeDefs(definitions){ return assign_definitions(information,definitions) },
		get resolvers(){ return assign_resolvers(information) },
		set resolvers(resolvers){ return assign_resolvers(information,resolvers) }
	}
	Object.defineProperty(information,'schema', {
		get(){
			const directives = assign_directives(information,Schemas.directives( Schemas.types(information.folder), information.folder ))
			return assign(shared(information, schema),options,{schemaDirectives:directives})
			//get typeDefs(){ return types.map(type=>type.schema) },
			//get resolvers(){ return get_resolvers( types, folder ) }
			//set_options()
			//return set_shared(this,)
		}
	})
	return information
	//shared actions
	
	
}
//Object.assign(data,options)

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
			requireResolversForNonScalar:false
		},
		//allowResolversNotInSchema turns off the functionality which throws errors when resolvers are found which are not present in the schema. Defaults to false, to help catch common errors.
		allowResolversNotInSchema: setting.passive === true
	},setting.resolver_options || {})
}

//if(information.logger === false) return null
//return information.logger