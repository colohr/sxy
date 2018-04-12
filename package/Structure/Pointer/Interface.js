const fxy = require('fxy')
const {Data, Structures} = require('../').Pointer
const Utility = require('../../Utility')
const pointer_folder = Symbol('pointer folder')
class PointerInterface{
	static get get(){ return get_interface }
	static get pointer(){ return get_pointer }
	constructor(folder){ this[pointer_folder] = folder }
	get structure(){ return Structures.get(this) }
}

//exports
module.exports = PointerInterface

//shared actions
function get_interface(folder){
	return new Proxy(get_pointer(folder),{ get:get_value })
}

function get_pointer(folder){
	folder = Utility.folder.clean(folder)
	if(Data.has(folder)) return Data.get(folder)
	return Data.set(folder,new PointerInterface(folder)).get(folder)
}

function get_value(o,name){
	if(name in o) return o[name]
	if(fxy.is.text(name)){
		const structure = o.structure
		if(structure){
			const source = structure.source
			if(name in source) return source[name]
			else if(name in structure) return structure[name]
		}
	}
	return null
}