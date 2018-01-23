const Print = require('../Print')
const fxy = require('fxy')
const extender = require('./extender')
const StructureBase = require('./Base')

class StructureLoader extends StructureBase{
	constructor(options){
		super(options.types.folder,options.url)
		if(options.library) register_library(this,options.library)
		this.loaded = load_structure(this,options)
	}
	get link(){ return get_link(this) }
	get point(){ return get_point(this) }
	get print(){ return get_printer(this) }
	get types(){ return get_types(this) }
	get Types(){ return this.get('schema').getTypeMap() }
	get web_component(){ return this.get('types').web_component }
}

//exports
module.exports = StructureLoader

//shared actions
function get_link(struct,...x){ return require('./Link').get(struct,...x) }

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
	const instruct = require('./instruct')(structure.info)
	const folder = structure.folder
	return new Proxy({folder},{
		get(o,name){
			if(fxy.is.text(name)) return instruct.type.class(o.folder,name)
			return null
		}
	})
}

function load_structure(structure,options){
	try{ structure.set('schema', extender(structure,options)) }
	catch(e){
		const log = require('better-console')
		log.error(`Struct: "${structure.name}"`)
		log.error(e)
	}
	return set_structure(structure,options)
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
			case 'link':
				get_link(structure,value)
				break
			case 'point':
				get_point(structure,value)
				break
		}
	}
	return true
}