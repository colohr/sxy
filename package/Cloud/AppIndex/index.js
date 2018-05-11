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
}

//exports
module.exports = Index

//shared actions
function get_items(index,structs){
	const options = index[index_options].sxy
	const signals = {
		get shared(){ return 'files' in this ? this.files : this.files = fxy.tree(this.folder, 'actions.graphql', 'signals.graphql').items.only.filter(filter_private_signal).filter(filter_remove_signal) },
		folder: options.structs,
		item(item){ return fxy.tree(fxy.join(this.folder, item.path), 'actions.graphql', 'signals.graphql').items.only.filter(filter_remove_signal) }
	}

	const ui = options.ui
	const items = {}
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
		else if(options.actions === true) data.actions = { file:`${name}.actions.graphql`, name, content:signals.item(item).map(signal_item).join(' ') }
		return new IndexItem(data)
	}
}


function filter_private_signal(item){ return item.name !== 'private.signals.graphql'  }
function filter_remove_signal(item){ return item.get('path').includes('/remove/') !== true }

function signal_item(item){ return item.content.replace(/\n/g, ' ').replace(/\t/g, ' ').replace(/         /g, ' ').replace(/        /g, ' ').replace(/       /g, ' ').replace(/      /g, ' ').replace(/     /g, ' ').replace(/    /g, ' ').replace(/   /g, ' ').replace(/  /g, ' ') }
