const sxy = require('sxy')
const fxy = require('fxy')
const {printType} = require('graphql')

//exports
module.exports = get_input

//shared actions
function get_input({api,type,types}){
	let value = get_types(api,types || type)
	return {
		api,
		text(joiner){ return get_types_text(this.value,joiner) },
		value
	}
}

function get_inputs(value){
	let array = []
	if(fxy.is.text(value)){
		value = value.replace(/ /g,',').replace(/\+/g,',').replace(/\&/g,',').replace(/\|/g,',')
		array = value.split(',').map(item=>item.trim()).filter(item=>item.length>0)
	}
	else if(fxy.is.array(value)) array = value
	return array
}

function get_types_text(types,joiner='\n\n'){ return types.map(type=>type.text).join(joiner) }

function get_types(api,types){
	types = get_inputs(types)
	return types.map(name=>{
		return {
			api,
			name,
			get text(){
				if(!this.value) return `#${this.api} -> ${this.name} not found`
				return printType(this.value)
			},
			value:get_type_value(api,name)
		}
	})
}

function get_type_value(name,type){
	let struct = sxy(`${name}/get`)
	let value = null
	if(struct){
		let structure = struct('struct')
		if(structure){
			let schema = structure.item.value
			let types = schema.getTypeMap()
			if(type && type in types) value = types[type]
		}
	}
	return value
}

