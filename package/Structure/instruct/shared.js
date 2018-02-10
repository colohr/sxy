const Schemas = require('./Schemas')
const fxy = require('fxy')
const {is} = fxy
const combine = (...x)=>fxy.as.one(...x)

//exports
module.exports = set_shared

//shared actions
function filter_definition(definition){
	definition = definition.replace(/ /g,'').replace(/\r/g,'').replace(/\n/g,'')
	return definition.includes('schema{') === false
}

function get_definitions(definitions,shared_schema){
	return shared_schema.typeDefs
	                    .filter(definition=>!definitions.includes(definition))
	                    .filter(filter_definition)
}

function set_resolvers(resolvers,shared_schema){
	const shared = shared_schema.resolvers
	for(const name in shared){
		if(['Out','In','Push'].includes(name) === false){
			if(name in resolvers) resolvers[name] = combine(shared[name], resolvers[name])
			else resolvers[name] = shared[name]
		}
	}
	return resolvers
}

function set_shared(information,types){
	if(is.nothing(information.shared)) return types
	if(is.text(information.shared)) information.shared = [information.shared]
	if(is.object(information.shared)){
		const shared = is.array(information.shared) ? information.shared:[information.shared]
		const shared_schemas = Schemas.shared(...shared)
		//console.log(shared_schemas)
		for(const shared_schema of shared_schemas){
			types.resolvers = set_resolvers(types.resolvers, shared_schema)
			types.typeDefs = types.typeDefs.concat(get_definitions(types.typeDefs,shared_schema))
		}
	}
	return types
}

