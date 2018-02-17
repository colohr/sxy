const fxy = require('fxy')
const {is} = fxy
const Schema = require('./Schema')
const Names = (...x)=>x.filter(i=>is.text(i))
const Mixins = (...x)=>x.filter(i=>is.function(i))

//exports
module.exports = get_type
module.exports.data = get_item_data
module.exports.item = get_item
module.exports.mixins = Mixins
module.exports.names = Names
module.exports.value = get_type_value

//shared actions
function get_item(type_location, type_name, library_name){
	const type = get_item_data(type_location,type_name,library_name)
	type.Map = get_type(type,type.library)
	return type
}

function get_item_data(type_location, type_name, library_name){
	return {
		name:get_type_name(type_location, type_name),
		library:get_library_name(type_location, library_name),
		toString(){ return [this.Map || ''].join('\n') }
	}
	//shared actions
	function get_library_name(){
		return is.text(library_name) ? library_name:from_location()
		//shared actions
		function from_location(){
			let value = null
			if(!fxy.extname(type_location).length) value = type_location
			else value = type_location.replace(fxy.basename(type_location),'')
			return fxy.basename(fxy.dirname(value))
		}
	}
	function get_type_name(){ return is.text(type_name) ? type_name:Schema.typename(type_location) }
}

function get_type(Type,folder){
	let typename = Type.typename || Type.name
	let type = get_type_value(typename,folder)
	return Schema.typetext(type)
}

function get_type_value(typename,folder){
	try{ return Schema(folder)[typename] }
	catch(e){ console.error(e) }
	return null
}
