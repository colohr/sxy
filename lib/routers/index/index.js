const fxy = require('fxy')
const express = require('express')
const library = require('./library')

class Site{
	constructor(data,structs){
		this.data = fxy.is.data(data) ? data:{}
		this.route = get_site_paths(this.data)
		this.structs = structs
		this.router = express()
	}
	get index(){ return this.route.index }
	get library(){ return this.route.library }
	get path(){ return this.route.path }
	get query(){ return this.route.query }
	get type(){ return fxy.join(this.index,'/:name') }
}

//export
module.exports = get_router

//shared actions
function get_router(options,sxy_options,struct_index){
	let struct_data = get_request(sxy_options,struct_index)
	let router = express.Router()
	router.use(options.index || '/index',(request,response)=>{
		response.json(struct_data)
	})
	router.use(options.index || '/index.json',(request,response)=>{
		response.json(struct_data)
	})
	return router
	
	//site.router.get(site.index,struct_request)
	//site.router.get(site.type,struct_request)
	//site.router.get(site.query,(req,res)=>{
	//	res.type('application/javascript')
	//	res.send(require('../Logic')('query'))
	//})
	//return site
}

function get_item_data(name,item,app_data){
	let origin = app_data.url
	let api = {}
	api.endpoint = item.url
	api.host = get_origin_host(origin)
	api.name = name
	api.path = item.path
	api.paths = get_item_paths(item.pathname,app_data.path)
	api.port = get_origin_port(origin)
	api.docs =  get_item_docs(origin,item.pathname,app_data.ui)
	return api
}

function get_item_docs(origin,path,ui){
	let paths = fxy.join(path,ui)
	return `${origin}${paths}`
}

function get_item_paths(paths,endpoint){
	let items = paths.split('/')
	items = items.concat(endpoint.split('/'))
	return items.filter(item=>item.length)
}

function get_request(app_data,structs){
	return get_structs()
	//return function struct_request(req,res){
	//	let params = req.params
	//	let name = params && params.name ? params.name:null
	//	if(!name) return res.json(get_structs())
	//	if(!structs.has(name)) return res.json({error:`Struct named "${name}" not found in index list.`})
	//	return res.json(get_struct(name))
	//}
	
	//shared actions
	function get_struct(name){
		let item = structs.get(name)
		return get_item_data(name,item,app_data)
	}
	
	function get_structs(){
		let items = {}
		for(let i of structs){
			let name = i[0]
			let item = i[1]
			items[name] = get_item_data(name,item,app_data)
		}
		let data = {}
		for(let name in app_data){
			data[name] = app_data[name]
		}
		data.items = items
		return data
	}
}

function get_origin_host(origin){
	let host = 'http://localhost'
	if(fxy.is.text(origin)){
		let hostname = fxy.hostname(origin)
		if(hostname !== null) {
			let protocol = fxy.protocol(origin)
			if(protocol !== null) host = `${protocol}//${hostname}`
			else host = hostname
			
		}
	}
	return host
}

function get_origin_port(origin){
	let port = ''
	if(fxy.is.text(origin)){
		port = fxy.port(origin)
		if(port === null) port = ''
	}
	return port
}

function get_site(data,structs){
	let site = new Site(data,structs)
	return library(get_api(site))
}

function get_site_paths(data){
	let paths = {}
	if(fxy.is.data(data) && 'site' in data && fxy.is.data(data.site)){
		paths = data.site
	}
	return Object.assign(require('./app.json'),paths)
}


