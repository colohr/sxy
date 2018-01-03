const fxy = require('fxy')
const Library = require('./Library')

//exports
module.exports = export_library
module.exports.get = Library.get
module.exports.has = Library.has

//shared actions
function delete_value(o,name){
	delete o[name]
	return true
}

function export_library(data){
	if(fxy.is.data(data) && fxy.is.text(data.name)){
		const library = Library.item(data.name)
		return library_proxy(library.define(data))
	}
	return null
}

function get_value(o,name){
	let value = null
	if(name in o){
		value = o[name]
		if(fxy.is.function(value)) value = value.bind(o)
	}
	else if(o.has(name)) {
		value = o.get(name)
		if(value instanceof Library.Module) value = value.module()
	}
	else if(Library.folder in o){
		value = o.module()
		if(name in value) value = value[name]
	}
	return value
}

function has_value(o,name){
	if(name in o) return true
	else if(Library.folder in o){
		const value = o.module()
		if(name in value) return true
	}
	return o.has(name)
}

function library_proxy(library){
	return new Proxy(library,{
		get:get_value,
		set:set_value,
		has:has_value,
		deleteProperty:delete_value
	})
}

function set_value(o,name,value){
	o[name] = value
	return true
}

