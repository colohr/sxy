const fxy = require('fxy')
const { makeExecutableSchema } = require('graphql-tools')
const dictionary = require('./dictionary')

//exports
module.exports = get_schema

//shared actions
function get_schema(structure,options){
	const types = options.types
	let schema =  types.schema
	if(!options.no_scalars) schema = dictionary.scalars.combine(schema)
	structure.set('types',types)
	return options.extend ? options.extend(get_schema_extender(structure,schema)):makeExecutableSchema(schema)
	
}

function get_schema_instructor(schema){
	const definitions = schema.typeDefs
	let has_ins = false
	let has_out = false
	let has_in = false
	let has_schema = false
	for(const definition of definitions){
		if(fxy.is.text(definition)){
			const value = definition.trim()
			if(value.indexOf('schema') >= 0) has_schema = true
			if(value.indexOf('type Out{') >= 0 || value.indexOf('type Out {') >= 0) has_out = true
			if(value.indexOf('type In{') >= 0 || value.indexOf('type In {') >= 0) has_in = has_ins = true
			if(value.indexOf('extend type In{') >= 0 || value.indexOf('extend type In {') >= 0) has_ins = true
		}
	}
	if(!has_out) definitions.push(`type Out{ StructOutput: ID  }`)
	if(has_ins && !has_in) definitions.push(`type Out{ StructInput: ID  }`)
	if(!has_schema) definitions.push(`schema{ query:Out ${has_ins ? 'mutation:In':''} }`)
	schema.typeDefs = definitions
	return schema
}

function get_schema_extender(structure,schema){
	return {
		build(...x){ return this.graphql.buildSchema(...x) },
		get graphql(){ return require('graphql') },
		instruct(){ return get_schema_instructor(this.schema) },
		join(...x){
			const items = get_schemas(...x)
			for(const item of items.values()){
				this.schema.resolvers = item.resolvers(this.schema.resolvers)
				this.schema.typeDefs = item.schema(this.schema.typeDefs)
			}
			return this
		},
		make(...x){ return makeExecutableSchema( ...(x.length ?  x:[this.schema]) ) },
		schema,
		get schemas(){ return get_schemas },
		structure,
		get tools(){ return require('graphql-tools') },
		get types(){ return this.structure.get('types') }
	}
	//shared actions
	function get_schemas(...structs){
		const schemas = new Map()
		for(const struct of structs){
			const items = filter_folders(fxy.tree(struct).items)
			for(const item of items){
				const item_data = schema_data(item)
				if(item_data) schemas.set(item_data.name,item_data)
			}
		}
		return schemas
		//shared actions
		function filter_folders(items){
			return items.filter(item=>item.get('type').directory)
			            .filter(item=>item.name!=='Instruct')
		}
		function filter_files(items){
			return items.filter(item=>item.get('type').file)
			            .filter(item=>item.name !== 'index.js')
		}
		function require_files(items){
			const data = {}
			for(const item of items) data[item.name.replace('.js','')] = require(item.get('path'))
			return data
		}
		function scalars_data(scalars_folder){
			const data = { scalars_folder, get resolvers(){ return require_files(filter_files(fxy.tree(scalars_folder,'js').items)) } }
			const scalars_file = fxy.join(scalars_folder,'index.graphql')
			if(fxy.exists(scalars_file)) data.item = fxy.read_item(scalars_file)
			return data
		}
		function schema_data(item){
			const file = fxy.join(item.get('path'),`${item.name}.graphql`)
			const scalars_folder = fxy.join(item.get('path'),'scalars/')
			const data = { name:item.name }
			if(fxy.exists(file)) data.item = fxy.read_item(file)
			if(fxy.exists(scalars_folder)) data.scalars = scalars_data(scalars_folder)
			if(data.item || data.scalars){
				data.resolvers = get_schema_resolvers
				data.schema = get_schema_content
				schemas.set(data.name,data)
				return data
			}
			return null
		}
		function get_schema_content(list){
			const content = []
			if(this.item) content.push(this.item.content)
			if(this.scalars && this.scalars.item) content.push(this.scalars.item.content)
			return content.concat(list)
		}
		function get_schema_resolvers(data){
			const content = this.scalars ? this.scalars.resolvers:null
			return fxy.as.one(content,data)
		}
	}
}