const fxy = require('fxy')
const express = require('express')

//const library = require('./library')
const index_options = Symbol('options')
const IndexItem = require('./Item')
const IndexModule = require('./Module')
const types = IndexModule.types

class Index{
	constructor(options,structs){
		this[index_options] = options
		this.domain = options.url.replace(options.path,'')
		this.items = get_items(this,structs)
		this.modules = get_modules(this,options.routers)
		this.url = options.url
	}
}

//exports
module.exports = get_router

//shared actions
function get_struct(index,options){
	let endpoint = fxy.join(options.routers.path,'/graph')
	let ui = fxy.join(options.routers.path,'/ui')
	index.structure = new IndexItem({
		ui:fxy.source.url(index.domain,ui),
		name:'structure',
		endpoint:fxy.source.url(index.domain,endpoint)
	})
	return require('./struct')(index)
}

function get_items(index,structs){
	let ui = index[index_options].ui
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
		data.ui =  fxy.source.url(index.domain,item.pathname,ui)
		return new IndexItem(data)
	}
}

function get_modules(index,routers){
	
	let path = routers.path
	let modules = {}
	for(let name in routers){
		if(name in types) modules[name] = get_module(name, routers[name])
	}
	return modules
	//shared actions
	function get_module(name,item){
		let type = types[name]
		let data = fxy.as.merge({name},type)
		data.url = fxy.source.url(index.domain, path, data.file || item)
		return new IndexModule(data)
	}
}

function get_router(options,structs){
	let routers = options.routers || {}
	let path = options.routers.index || '/index'
	let index = new Index(options,structs)
	options[Symbol.for('struct index')] = index
	let router = express.Router()
	let file = !path.includes('json') ? `${path}.json`:path
	router.use(file,(request,response)=>response.json(index))
	
	if('structure' in routers){
		let struct = get_struct(index,options)
		router.use(struct)
	}

	return router
}


