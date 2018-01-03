const fxy = require('fxy')
const struct_item = Symbol('Library Struct')
const Module = require('./Module')

const modules = {
	structure:struct=>new Module(struct,'item'),
	schema:struct=>new Module({get value(){return struct.get('schema')}},'value'),
	print:struct=>new Module({get value(){return struct.print}},'value'),
	struct:struct=>new Module({get value(){return struct.get('schema')}},true)
}

const Struct = Base => class extends Base{
	graph_struct(struct){ return set_struct(this,struct) }
}

//exports
module.exports = Struct

//shared actions
function set_items(library,struct){
	const items = fxy.tree(struct.folder).items
	for(let item of items) library.set(item.name,new Module(item))
	return set_modules(library,struct)
}

function set_modules(library,struct){
	for(let name in modules) library.set(name,modules[name](struct))
	return library
}

function set_struct(library,struct){
	if(struct_item in this) return library[struct_item]
	if(fxy.is.nothing(struct)) return null
	return set_items(library,struct)
}