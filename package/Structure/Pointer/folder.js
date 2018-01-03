const fxy = require('fxy')
const pointers = require('./pointers')
const remove = Symbol.for('remove')
//exports
module.exports = get

//shared actions
function get(folder,name,value){
	let pointer = pointers.get(folder)
	if(pointer && fxy.is.text(name)) return get_data(pointer,name,value)
	return pointer
}

function get_data(pointer,name,value){
	let data = null
	if(fxy.is.map(pointer)){
		if(fxy.is.nothing(value) && pointer.has(name)) data = pointer.get(name)
		else if(value === remove) data = remove_pointer(pointer,name)
		else set_pointer(pointer,name,value)
	}
	return data
}

function set_pointer(pointer,name,value){
	pointer.set(name,value)
	return true
}
function remove_pointer(pointer,name){
	pointer.delete(name)
	return true
}