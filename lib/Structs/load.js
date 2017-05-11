const fxy = require('fxy')
const express = require('express')


module.exports = function(graph_struct){
	let main_path = graph_struct.main || '/'
	const structs = require('./structs')(graph_struct.structs)
	const app = express()
	for(let i=0;i<structs.length;i++) {
		let item = structs[i]
		let graph =	item.graph(main_path,graph_struct.path)
		let pathname = fxy.join(graph_struct.main,graph.path)
		app.use( pathname, graph.app(graph_struct) )
	}
	return app
}