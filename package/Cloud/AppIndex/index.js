const fxy = require('fxy')
const index_options = Symbol('options')
const IndexItem = require('./Item')
const Preset = {
	"endpoint":"/point",
	"path":"/api",
	"index":"/index",
	"structs":"/structs",
	"views":"/views",
	"ui":"/ui"
}
class Index{
	constructor(options,structs){
		if(!('index' in options)) options.index = '/index.json'
		if(options.index.includes('.json') !== true) options.index = `${options.index}.json`
		const wwi = options.wwi
		const sxy = options.sxy || {}
		const site_path = options.path || ''
		
		this[index_options] = options
		this.app_url = options.url
		this.struct_url = fxy.source.url(this.app_url,sxy.path || Preset.path)
		this.struct_path = fxy.join(site_path,sxy.path || Preset.path)
		this.file = fxy.join(this.struct_path,options.index)
		this.url = fxy.source.url(this.app_url,this.file)
		if(fxy.is.data(wwi) && wwi.components){
			this.struct_client = fxy.source.url(this.app_url, 'components', 'struct/index.html')

		}

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


