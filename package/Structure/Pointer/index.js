const fxy = require('fxy')
const Structure = require('../')

const Pointer = {
	get folder(){ return require('./folder') },
	get Interface(){ return require('./Interface') },
	get pointers(){ return require('./pointers') },
	get struct(){ return get_struct }
}

//exports
module.exports = Pointer

//shared actions
function get_struct(folder,struct_options){
	return new Proxy(exporter(folder,struct_options),{
		deleteProperty(o,name){ return Pointer.folder(folder,name,Symbol.for('remove')) },
		get(o,name){
			if(name === 'loaded') return Pointer.pointers.has(folder)
			else if(name === 'ready') return Pointer.pointers.ready(struct_options)
			return Pointer.folder(folder,name)
		},
		has(o,name){ return Pointer.pointers.has(folder) && Pointer.pointers.get(folder).has(name) },
		set(o,name,value){ return Pointer.folder(folder,name,value) }
	})
}

function exporter(folder,struct_options){
	return function struct_exporter(url,options){
		if(fxy.is.data(struct_options) !== true) struct_options = {}
		if(fxy.is.data(options)) struct_options = Object.assign(struct_options,options)
		if(!('folder' in struct_options)) struct_options.folder = folder
		struct_options.url = url
		const structure = Structure(struct_options)
		Pointer.pointers.set(folder,structure)
		return structure
	}
}

