const fxy = require('fxy')
const { makeExecutableSchema, attachDirectiveResolvers } = require('graphql-tools')
const dictionary = require('./dictionary')
const Structure = require('./index')
const Pointer = Structure.Pointer

//exports
module.exports = get_schema

//shared actions
async function get_schema(structure,options){
	const schema_definition = Structure.schema(structure)
	//console.dir(schema_definition)
	if(fxy.is.empty(schema_definition.schemaDirectives)) delete schema_definition.schemaDirectives

	if(!options.no_scalars) dictionary.scalars.combine(schema_definition)
	if(Pointer.Api) {
		schema_definition.typeDefs.push(await Pointer.Api.definitions)
		fxy.as.one(schema_definition.resolvers, Pointer.Api.resolvers)
	}


	const schema = makeExecutableSchema(schema_definition)
	if('directives' in options){
		const directive_resolvers = await options.directives(structure, {schema, options})
		attachDirectiveResolvers(schema, directive_resolvers)
	}

	return structure.set('schema', schema)
}