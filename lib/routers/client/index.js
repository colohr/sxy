const fxy = require('fxy')
const wxy = require("wxy")
const express = require('express')
const client = {
	folder:fxy.join(__dirname,'client'),
	path:'/client',
	index:{
		path:fxy.join(__dirname,'index.html')
	}
}
client.index.template = wxy.template(client.index.path)

//exports
module.exports = get_router

//shared actions
function get_client_router(){ return express.static(client.folder,{maxAge:'7d'}) }

function get_router(options){
	let url = options.url.replace(options.path,'')
	if(fxy.is.data(options) !== true) options = {}
	let router = express.Router()
	let routers = options.routers || {}
	let path = routers.client || client.path
	let data = {
		url:fxy.source.url(url,routers.path || "struct",path),
		get index(){ return JSON.stringify(options[Symbol.for('struct index')]) }
	}
	router.use(path,get_client_router())
	router.get(fxy.join(path,'index.html'),(request,response)=>{
		
		response.send(client.index.template.get(data))
	})
	return router
}