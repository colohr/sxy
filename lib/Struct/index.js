
const fxy = require('fxy')
const io = require('./io')
const limit = 20
const Structure = require('../Structure')

module.exports = {
	Data:require('./Data'),
	enum:require('./enum'),
	io:get_structure_io,
	scalar:require('./scalar'),
	struct:get_structure,
	data(...x){ return this.Data.get(...x) }
}

module.exports.struct.io = get_structure_io


//shared actions
function get_structure(folder,struct_options){
	return function struct_export(url,options){
		if(fxy.is.data(struct_options) !== true) struct_options = {}
		if(fxy.is.data(options)) struct_options = Object.assign(struct_options,options)
		if(!('folder' in struct_options)) struct_options.folder = folder
		struct_options.url = url
		const structure = Structure(struct_options)
		io.set(folder,structure)
		return structure
	}
}


function get_structure_io(folder){
	let structure_folder = get_structure_folder(folder)
	if(!structure_folder) return null
	return io(structure_folder)
}

function get_structure_folder(folder,count){
	if(!fxy.is.number(count)) count = 0
	if(count >= limit) return null
 	let path = fxy.join(folder,'../')
	return is_root_folder(path) ? path:get_structure_folder(path,count++)
}

function is_root_folder(folder){
	let paths = fxy.join(folder,'../').split('/').filter(part=>part.length > 0)
	return paths[paths.length - 1] === 'structs'
}