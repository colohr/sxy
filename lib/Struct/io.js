const fxy = require('fxy')
const struct_folder = Symbol('struct folder')
const Structures = new WeakMap()
const Data = new Map()

class StructureInputOutput{
	constructor(folder){
		this[struct_folder] = folder
	}
	get structure(){ return Structures.get(this) }
}

module.exports = get_io

module.exports.set = function set_io(folder,structure){
	let io = get_set_io(folder)
	Structures.set(io,structure)
	return io
}

module.exports.Structures = Structures


function get_io(folder){
	return new Proxy(get_set_io(folder),{
		get(o,name){
			if(name in o) return o[name]
			if(fxy.is.text(name)){
				let s = o.structure
				if(s){
					let source = s.source
					if(name in source) return source[name]
					else if(name in s) return s[name]
				}
			}
			return null
		}
	})
}
function get_set_io(folder){
	folder = folder.split('/').filter(part=>part.length>0).join('/')
	if(!Data.has(folder)) Data.set(folder,new StructureInputOutput(folder))
	return Data.get(folder)
}