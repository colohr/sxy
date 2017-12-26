const fxy = require('fxy')
const io = require('./io')
const Structure = require('../Structure')

//exports
module.exports = {
	enum:require('./enum'),
	io:get_structure_io,
	scalar:require('./scalar'),
	shared:get_shared_folders,
	shared_io:get_shared_io,
	struct:get_structure
}
module.exports.struct.io = get_structure_io

//shared actions
function folder_data(folder,name,value){
	let data = io.get(folder)
	if(data) {
		if(fxy.is.text(name)){
			let x = null
			if(fxy.is.nothing(value)) x = data.has(name) ? data.get(name):null
			else{
				if(value === Symbol.for('remove')) data.delete(name)
				else data.set(name,value)
				x = true
			}
			return x
		}
	}
	return data
}

function get_shared_folders(folder){
	let structure_folder = get_structure_folder(folder)
	//console.log({structure_folder})
	return (...names)=>names.map(name=>fxy.join(structure_folder,name))
}
function get_shared_io(folder,target){
	let get_shared = get_shared_folders(folder)
	target = target.split('/')
	target[0] = get_shared(target[0])[0]
	let file = fxy.join(...target)
	if(!fxy.exists(file)){
		if(file.includes('.js')) return null
		file = file+'.js'
		if(fxy.exists(file)) return require(file)
		return null
	}
	return require(file)
}

function get_structure(folder,struct_options){
	return new Proxy(function struct_export(url,options){
		if(fxy.is.data(struct_options) !== true) struct_options = {}
		if(fxy.is.data(options)) struct_options = Object.assign(struct_options,options)
		if(!('folder' in struct_options)) struct_options.folder = folder
		struct_options.url = url
		const structure = Structure(struct_options)
		//console.log(folder)
		io.set(folder,structure)
		return structure
	},{
		deleteProperty(o,name){ return folder_data(folder,name,Symbol.for('remove')) },
		get(o,name){
			if(name === 'loaded') return io.has(folder)
			else if(name === 'ready') return is_ready(struct_options)
			return folder_data(folder,name)
		},
		has(o,name){ return io.has(folder) && io.get(folder).has(name) },
		set(o,name,value){ return folder_data(folder,name,value) }
	})
}

function get_structure_folder(folder,count){
	if(!fxy.is.number(count)) count = 0
	if(count >= 20) return null
	let path = fxy.join(folder,'../')
	return is_root_folder(folder) ? path:get_structure_folder(path,count++)
}

function get_structure_io(folder){
	let structure_folder = get_structure_folder(folder)
	if(!structure_folder) return null
	return io(structure_folder)
}

function is_ready(options){
	if(fxy.is.data(options) && 'shared' in options){
		let shared = fxy.is.text(options.shared) ? [options.shared]:options.shared
		if(fxy.is.array(shared)) return shared.filter(shared_folder=>io.has(shared_folder) === false).length === 0
	}
	return true
}

function is_root_folder(folder){
	let paths = fxy.join(folder,'../').split('/').filter(part=>part.length > 0)
	return paths[paths.length - 1] === 'structs'
}