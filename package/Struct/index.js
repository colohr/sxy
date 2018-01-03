const Struct = {
	get enum(){ return require('./enum') },
	get scalar(){ return require('./scalar') },
	get shared(){ return require('../Utility').folder.shared },
	get struct(){ return require('../Structure').Pointer.struct },
	get utility(){ return require('../Utility') }
}

//exports
module.exports = Struct



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






