const Print = require('../Print')
const fxy = require('fxy')
const extender = require('./extender')
const StructureBase = require('./Base')
const clear_items = Symbol('clear items context value')
class StructureLoader extends StructureBase{
	constructor(options,preload=true){
		super(options.types.folder,options.url)
		if(options.library) register_library(this,options.library)
		if(preload === true) this.loaded = load_structure(this,options)
	}
	get field(){
		return {
			get add(){ return add_clear_item_to_context },
			get notation(){ return get_field_notation },
			get data(){ return clear_fields_from_result_data }
		}
	}
	get point(){ return get_point(this) }
	get print(){ return get_printer(this) }
	get types(){ return get_types(this) }
	get Types(){ return this.get('schema').getTypeMap() }
}

//exports
module.exports = StructureLoader
module.exports.build = async function build_structure(options){
	const structure = new StructureLoader(options,false)
	structure.loaded = await load_structure(structure, options)
	return structure
}

//shared actions
function add_clear_item_to_context(context,info){
	const notation = get_field_notation(info.path)
	if(!(clear_items in context)) context[clear_items] = new Set()
	return (context[clear_items].add(notation),null)
}

function clear_fields_from_result_data(result,{context}){
	if(fxy.is.object(context) && clear_items in context && fxy.is.object(result.data)){
		for(const notation of context[clear_items]) fxy.dot.delete(result.data,notation)
	}
	return result
}

function get_field_notation(item, notation = []){
	if(fxy.is.data(item)){
		if(item.key) notation.unshift(item.key)
		if(fxy.is.data(item.prev)) return get_field_notation(item.prev, notation)
	}
	return notation.join('.')
}

function get_point(struct,...x){ return require('./Point').get(struct,...x) }

function get_printer(structure){
	return new Proxy((value)=>{return Print(value || structure.get('schema'))},{
		get(o,name){
			let types = structure.Types
			if(name in types) return o(types[name])
			return null
		}
	})
}

function get_types(structure){
	const folder = structure.folder
	return new Proxy({folder},{
		get(o,name){
			const instruct = require('./instruct')(structure.info)
			if(fxy.is.text(name)) return instruct.type.class(o.folder,name)
			return null
		}
	})
}

async function load_structure(structure,options){
	try{ return set_structure(await extender(structure, options), options) }
	catch(e){
		console.error(`Struct: "${structure.name}"`)
		console.error(e)
		return false
	}
}

function register_library(structure,name){
	name = fxy.is.text(name) ? name:structure.name
	return require('../Module').library({name}).graph_struct(structure)
}

function set_structure(structure,options){
	for(let name in options){
		let value = options[name]
		if(!(name in structure))  {
			if(fxy.is.function(value)) structure[name] = value.bind(structure)
			else structure[name] = value
		}
		else switch(name){
			case 'point':
				get_point(structure,value)
				break
		}
	}
	return true
}
