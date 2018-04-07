const fxy = require('fxy')
const { makeExecutableSchema, attachDirectiveResolvers } = require('graphql-tools')
const dictionary = require('./dictionary')

//exports
module.exports = get_schema

//shared actions
async function get_schema(structure,options){
	const types = options.types
	let schema =  types.schema
	if(fxy.is.empty(schema.schemaDirectives)) delete schema.schemaDirectives
	if(!options.no_scalars) schema = dictionary.scalars.combine(schema)
	structure.set('types', types)
	schema = makeExecutableSchema(schema)
	if('directives' in options){
		const directive_resolvers = await options.directives(structure, {types, schema, options})
		attachDirectiveResolvers(schema, directive_resolvers)
	}

	return schema
	//console.log('extend' in options,schema)

	//console.dir(schema,{colors:true})
	//return makeExecutableSchema(schema)
	
}