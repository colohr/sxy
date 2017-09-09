const fxy = require('fxy')
const express = require('express')

const documentation = {
	folder:fxy.join(__dirname,'/documentation'),
	path:'/documentation',
	index:{
		path:fxy.join(__dirname,'index.html')
	}
}
documentation.index.template = require('wxy').template(documentation.index.path)

//exports
module.exports = get_router

//shared actions
function get_static_router(){return express.static(documentation.folder,{maxAge:'7d'})}

function get_router(options,structs){
	if(fxy.is.data(options) !== true) options = {}
	
	let router = express.Router()
	let domain = options.url.replace(options.path,'')
	let routers = options.routers || {}
	let path = routers.documentation || documentation.path
	let data = {
		url:fxy.source.url(domain,routers.path || '',path)
	}
	
	router.use(path,get_static_router())
	router.get(fxy.join(path,'index.html'),(request,response)=>response.send(documentation.index.template.get(data)))
	return router
}