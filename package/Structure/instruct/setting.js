const fxy = require('fxy')
const {is} = fxy

//exports
module.exports = get_setting

//shared actions
function get_setting(information, structure_options){
	const options = get_rules(structure_options)
	const logger = get_logger()
	if(logger) options.logger = logger
	return options

	//shared actions
	function get_logger(){
		//logger is an optional argument, which can be used to print errors to the server console that are usually swallowed by GraphQL. The logger argument should be an object with a log function, eg. const logger = { log: (e) => console.log(e) }
		if('logger' in information) return information.logger === false ? null:information.logger
		return {log: (e)=>console.log(e)}
	}
}

function get_rules(structure_options){
	const setting = is.data(structure_options) ? structure_options:{}
	return Object.assign({
		//allowUndefinedInResolve is an optional argument, which is true by default. When set to false, causes your resolve functions to throw errors if they return undefined, which can help make debugging easier.
		allowUndefinedInResolve: true,
		//resolverValidationOptions is an optional argument which accepts an object of the following shape: { requireResolversForArgs, requireResolversForNonScalar }.
		resolverValidationOptions: {
			//requireResolversForArgs will cause makeExecutableSchema to throw an error if no resolve function is defined for a field that has arguments.
			requireResolversForArgs: setting.passive !== true,
			//requireResolversForNonScalar will cause makeExecutableSchema to throw an error if a non-scalar field has no resolver defined. By default, both of these are true, which can help catch errors faster. To get the normal behavior of GraphQL, set both of them to false.
			requireResolversForNonScalar: false,
			requireResolversForAllFields: false,
			requireResolversForResolveType: false,
			allowResolversNotInSchema: false
		},
		//allowResolversNotInSchema turns off the functionality which throws errors when resolvers are found which are not present in the schema. Defaults to false, to help catch common errors.
		allowResolversNotInSchema: setting.passive === true,
		inheritResolversFromInterfaces: false
	}, setting.resolver_options || {})
}