const fxy = require('fxy')
const dictionary = require('./dictionary')
const Structure = require('./index')
const Pointer = Structure.Pointer
const tools = require('graphql-tools')
const { makeExecutableSchema, attachDirectiveResolvers } = require('graphql-tools')

//exports
module.exports = get_schema

//shared actions
async function get_on(structure,options){
	let on = 'on' in options ? options.on:{}
	if(fxy.is.text(on) && fxy.exists(on)) on = require(on)
	if(fxy.is.async(on) || fxy.is.action(on)) on = await on(structure,options)
	return fxy.is.data(on) ? on:{}
}

async function get_schema(structure,options){
	const on = await get_on(structure,options)
	const schema_definition = Structure.schema(structure)
	if(!options.no_scalars) dictionary.scalars.combine(schema_definition)

	if(on.definitions){
		schema_definition.typeDefs = fxy.as.one(schema_definition.typeDefs, await on.definitions(schema_definition, get_tools(), structure))
	}

	if(on.directives){
		schema_definition.schemaDirectives = fxy.as.one( schema_definition.schemaDirectives, await on.directives(schema_definition, get_tools(), structure) )
	}

	if(on.resolvers){
		schema_definition.resolvers = fxy.as.one(schema_definition.resolvers, await on.resolvers(schema_definition, get_tools(), structure))
	}

	if(fxy.is.empty(schema_definition.schemaDirectives)) delete schema_definition.schemaDirectives

	if(Pointer.Api){
		schema_definition.typeDefs.push(await Pointer.Api.definitions)
		fxy.as.one(schema_definition.resolvers, Pointer.Api.resolvers)
	}

	if(on.define) await on.define( schema_definition, get_tools(), structure )

	const schema = on.build ? await on.build(schema_definition, get_tools(), structure):(on.schema ? await on.schema(makeExecutableSchema(schema_definition), get_tools(), structure):makeExecutableSchema(schema_definition))

	if('directives' in options){
		const directive_resolvers = await options.directives(structure, {schema, options})
		attachDirectiveResolvers(schema, directive_resolvers)
	}

	if(on.done) await on.done(schema, get_tools(), structure)

	return structure.set('schema', schema)
}

function get_tools(){
	return new Proxy(tools,{
		get:get_value,
		has(o,field){ return field in o || has(o,field) },
		ownKeys(o){ return get_fields(o) }
	})
	//shared actions
	function get_field(o,field){
		if(fxy.is.text(field) === false) return null
		field = fxy.id.medial(field)
		const fields = get_fields(o)
		for(const i of fields){
			if(i === field) return i
		}
		for(const i of fields){
			if(i.replace('Schemas', '').replace('Schema', '') === field) {
				return i
			}
		}
		return null
	}

	function get_fields(o){ return Object.keys(o) }
	function get_value(o,field){
		if(field === 'fields') return get_fields(o)
		if(field in o){
			if(fxy.is.action(o[field])) return (...x)=>o[field](...x)
			return o[field]
		}
		field = get_field(o,field)
		if(field){
			if(fxy.is.action(o[field])) return (...x)=>o[field](...x)
			return o[field]
		}
		return null
	}
	function has(o,field){ return fxy.is.nothing(get_field(o,field)) === false }
}