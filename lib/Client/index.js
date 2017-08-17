const fxy = require('fxy')
const express = require('express')
const folders = {
	struct_client:fxy.join(__dirname,'client'),
	struct_documents:fxy.join(__dirname,'documents')
}
const paths = {
	struct_client:'/struct/client',
	struct_documents:'/struct/documents'
}
//exports
module.exports = {
	client:get_client_router,
	documents:get_documents_router,
	use:use_router
}

//shared actions
function get_client_router(){
	return express.static(folders.struct_client,{maxAge:'7d'})
}

function get_documents_router(){
	return express.static(folders.struct_documents,{maxAge:'7d'})
}

function use_router(app,options){
	console.log({options})
	if(fxy.is.data(options) !== true) options = {}
	let router = express.Router()
	
	router.get('/struct',(req,res)=>{
		res.send('HELLO')
	})
	app.use(router)
	
	if(add_client()) app.use(fxy.is.text(options.struct_client) || paths.struct_client,get_client_router())
	if(add_documents()) app.use(fxy.is.text(options.struct_documents) || paths.struct_documents,get_documents_router())
	return app
	function add_documents(){
		return 'struct_documents' in options && !options.struct_documents === false
	}
	function add_client(){
		return 'struct_client' in options && !options.struct_client === false
	}
}