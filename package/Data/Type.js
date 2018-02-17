const fxy = require('fxy')
const {is,id} = fxy
const {content} = require('../Utility')
const StructStore = require('./Store')

class Type extends Map{
	static structstore(type,value){ return StructStore(type,value) }
	constructor(data,structstore){
		super()
		set_data(this,data)
		set_store(this,structstore)
	}
}

//exports
module.exports = get_type

//shared actions
function get_field(field,keep_intact){
	if(keep_intact) return field
	return field.indexOf('_') !== 0 ? id.underscore(field):field
}

function get_type(text, setting){
	const get_type = content.type(text)
	const type = get_type(Type)
	const set_setting = is.data(setting) && (setting.keep_fields_intact || setting.no_storage)
	if(set_setting) type.structure_type_setting = setting
	return type
}

function set_data(type,data){
	if(is.data(data)){
		const keep_intact = is.data(type.structure_type_setting) && type.structure_type_setting.keep_fields_intact
		for(const i in data) type.set(get_field(i,keep_intact), data[i])
	}
}

function set_store(type,structstore){
	if(structstore){
		if(type.constructor.structure_type_setting && type.constructor.structure_type_setting.no_storage) return
		StructStore(type,structstore)
	}
}

