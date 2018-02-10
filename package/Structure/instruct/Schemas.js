const fxy = require('fxy')
const get_type = (...x)=>require('./type')(...x)
const schemas_data = Symbol('schemas data')
const Schemas = {
	get data(){
		if(schemas_data in this) return this[schemas_data]
		return this[schemas_data] = new Map()
	},
	get folder(){ return get_folders },
	get(name){ return this.data.has(name) ? this.data.get(name):null },
	has(name){ return this.data.has(name) },
	get resolvers(){ return get_resolvers },
	set(name,schema){
		this.data.set(name,schema)
		return this
	},
	get shared(){ return get_shared },
	get types(){ return get_types }
}

//exports
module.exports = Schemas


//shared actions
function get_export(share){
	if(fxy.is.text(share)) share = {folder:share}
	if(!fxy.is.data(share)) return null
	if(Schemas.has(share.folder)) {
		//console.log('Getting from Shemas Data')
		return Schemas.get(share.folder)
	}
	let shared_type = require('./types')(share)
	return shared_type.schema
}

function get_folders(folder){ return fxy.list(folder).folders.filter(name=>name !== '.DS_Store') }

function get_resolvers(types,folder){
	const resolvers = fxy.as.one(...(types.map(type=>type.resolvers)))
	return require('./resolvers')(resolvers, folder)
}

function get_shared(...shared){ return shared.map(get_export).filter(schema=>schema !== null) }

function get_types(folder){
	const folders = get_folders(folder)
	return folders.map(name=>get_type(name, fxy.join(folder, name)))
}



