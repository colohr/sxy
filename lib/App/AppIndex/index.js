const fxy = require('fxy')
const index_options = Symbol('options')
const IndexItem = require('./Item')

class Index{
	constructor(options,structs){
		if(!('index' in options)) options.index = '/index.json'
		if(options.index.includes('.json') !== true) options.index = `${options.index}.json`
		this[index_options] = options
		this.app_url = options.url
		this.struct_client = 'wwi' in options && options.wwi.components ? fxy.source.url(this.app_url,'components','struct/index.html'):null
		this.struct_url = fxy.source.url(this.app_url,options.sxy.path)
		this.struct_path = fxy.join(options.path,options.sxy.path)
		this.file = fxy.join(this.struct_path,options.index)
		this.url = fxy.source.url(this.app_url,this.file)
		this.items = get_items(this,structs)
	}
	router(){ return get_router(this) }
}

//exports
module.exports = Index

//shared actions
function get_items(index,structs){
	let ui = index[index_options].sxy.ui
	let items = {}
	for(let i of structs){
		let name = i[0]
		let item = i[1]
		items[name] = get_item(name,item,index)
	}
	return items
	//shared actions
	function get_item(name,item){
		let data = {}
		data.endpoint = item.url
		data.name = name
		data.ui =  fxy.source.url(index.app_url,item.pathname,ui)
		if(item.actions) data.actions = item.actions
		return new IndexItem(data)
	}
}


