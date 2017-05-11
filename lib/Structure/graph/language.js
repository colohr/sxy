const fxy = require('fxy')
const graph = require('./index')
const ql = require('./symbols')
const skip_all_instances_of = [
	graph.GraphQLInputObjectType
]

const DataTypes = require('../sql/types')

class LanguageField{ constructor(name){ this.name = name } }

class LanguageType{
	constructor(data){
		if(fxy.is.data(data)) Object.assign(this,data)
	}
	get id(){ return fxy.is.text(this.structure) ? this.structure.toLowerCase():null }
	get graph(){ return this.kind || graph.kind(this) }
}

class LanguageTypes extends Map{
	constructor(x,data_types){
		let add = get_language_types( x in ql.languages ? ql.languages[x].language_types : [] )
		super(add)
		if(fxy.is.data(data_types)){
			for(let name in data_types){
				if(!this.has(name)) this.set(name,data_types[name])
			}
		}
	}
}

class Language extends Map{
	constructor( language , graph ){
		let info = ql.languages[language]
		let schema = graph.get('schema')
		
		super([
			[ ql.language, language ],
			[ ql.name, graph.name ],
			[ ql.types, new LanguageTypes(language, graph.get('types').data_types) ]
		])
		
		this.info = info
		this.set(ql.structs, get_structs(info, graph))
		let types = this.types
		for(let name in this.structs){
			let struct = this.structs[name]
			let model = { name }
			for(let field of struct.fields){
				if(this.has_many(field)) field.has_many = true
				if(field.has_many){
					if(!model.has_many) model.has_many = []
					model.has_many.push({as:field.name,name:field.value.name})
				}
				//data will be used to set sql databases so it will incude the correct value type
				if(types.has(field.value.name)){
					if(!('data' in model)) model.data = {}
					//the data is required to be in the valid format for Sequalize. meaning { type:'SQLITE TYPE' }
					let data_type = types.get(field.value.name)
					if('structure' in data_type){
						model.data[field.name] = {}
						model.data[field.name].type = data_type.structure
					}
				}
			}
			struct.model = model
		}
	}
	get structs(){ return this.get(ql.structs) }
	get types(){ return this.get(ql.types) }
	has_many(field){ return get_has_many(field,this.info) }
}

module.exports = function(...x){
	return function(action){
		let language = new Language('graphql', x[0])
		let sql = x[0].source.sql
		let structs = language.structs
		for(let name in structs){
			let struct = structs[name]
			if('model' in struct && 'data' in struct.model) sql.define(name, struct.model.data)
			//console.log(name) - console.log(struct)
		}
		sql.set_models(structs)
		action(language,...x)
		return x[0]
	}
}


function get_fields( fields, type_keys){
	let names = Object.keys(fields)
	return new Set(names.map(name=>{
		let value = fields[name]
		let	key
		let field = new LanguageField(name)
		for(let type_key of type_keys){
			if(fxy.dot.has(value, type_key)){
				key = type_key
				value = fxy.dot.get(value, type_key)
				field[fxy.id._(key)] = value.constructor.name
			}
		}
		field.value = value
		return field
	}))
}

function get_has_many(field,{type}){
	if(!type.has_many) return false
	return type.has_many.includes(field.of_type) || type.has_many.includes(field.type)
}

function get_language_types(additions){
	if(additions) additions.map(data=>new LanguageType(data))
	return DataTypes.map( structure => {
		return [ structure, new LanguageType({ structure }) ]
	}).concat(additions || [])
}

function get_structs(info, graph){
	let schema = graph.get('schema')
	let types_map = fxy.dot.get(schema,`${info.types}`)
	let graph_types = graph.get('types')
	let names = Object.keys(types_map).filter(name=>(!(name.includes('__')) && !(name.includes('_'))))
	let types = {}
	for(let name of names){
		let type = types_map[name]
		if(is_valid_struct(graph_types,name,type)){
			//console.log(name,type)
			let type_fields = fxy.dot.get(type,`${info.type.fields}`)
			if(type_fields){
				let fields = get_fields(type_fields, info.type.keys, info)
				types[name] = { name, fields }
			}
		}
	}
	return types
}

function is_valid_struct({root_names,data_types},name,type){
	if(data_types && name in data_types && data_types[name].skip) return false
	else if( Object.keys(root_names).filter(root_name=>root_names[root_name]===name).length > 0 ) return false
	else if(skip_all_instances_of.filter(skips=>type instanceof skips).length > 0) return false
	return true
}
