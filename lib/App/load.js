const fxy = require('fxy')
const express = require('express')
const router = require('./router')
const console = require('better-console')


module.exports = function(graph_struct){
	let main_path = graph_struct.path || '/'
	const structs = require('./structs')(graph_struct.structs)
	const app = express()
	let logs = []
	let index_list = new Map()
	for(let i=0;i<structs.length;i++) {
		let item = structs[i]
		let graph =	item.graph(graph_struct)
		let pathname = fxy.join(main_path,graph.path)
		let struct = {}
		struct.path = graph.path
		struct.pathname = pathname
		struct.url = graph.url
		console.log(struct)
		index_list.set(item.name,struct)
		app.use( pathname, router(graph,graph_struct) )
		logs.push(struct)
	}
	console.table(logs)
	app.structs_index = index_list
	return app
	return set_graph_index(app,graph_struct,index_list)
}


//shared actions
function set_graph_index(app,data,structs){
	const Site = require('../routers').index
	const site =  Site(data,structs)
	console.log({site})
	app.use(site.path,site.router)
	return app
}