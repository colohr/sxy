const Data = require('../Data')
const fxy = require('fxy')
const Type = require('./Type')
const Item = (file,...x)=>{
	let name = x.filter(i=>fxy.is.text(i))
	let mixins = x.filter(i=>fxy.is.function(i))
	const Type = get_type(file,...name)
	let ItemType = Data.Type(get_map(Type.Map))
	for(let mix of mixins) ItemType = mix(ItemType)
	return class extends ItemType{
		static get Type(){ return Type }
	}
}

//exports
module.exports = Item

//shared actions
function get_map(map){
	let list = []
	if(map) list.push(map)
	return list.join('\n')
}

function get_type(x,name,library){
	name = fxy.is.text(name) ? name:Type.typename(x)
	if(!library) library = get_type_library(x)
	let type = {name}
	type.Map = Type(type,library)
	return type
}

function get_type_library(filename){
	let extension = fxy.extname(filename)
	let value = null
	if(extension.length) value = filename.replace(fxy.basename(filename),'')
	else value = filename
	return fxy.basename(fxy.dirname(value))
}