const fxy = require('fxy')
const wxy = require("wxy")
const express = require('express')
const client = {
	folder:fxy.join(__dirname,'client'),
	path:'/struct/client',
	index:{
		path:fxy.join(__dirname,'index.html')
	}
}
client.index.template = wxy.template(client.index.path)

//exports
module.exports = get_router

//shared actions
function get_client_router(){
	return express.static(client.folder,{maxAge:'7d'})
}

function get_router(options,structs){
	if(fxy.is.data(options) !== true) options = {}
	let router = express.Router()
	let path = options.client || client.path
	let data = {
		url:fxy.join(structs.url,options.path || "struct",path)
	}

	router.use(path,get_client_router())
	router.get(fxy.join(path,'index.html'),(request,response)=>{
		console.log(client.index.template.get(data))
		response.send(client.index.template.get(data))
	})
	return router
}