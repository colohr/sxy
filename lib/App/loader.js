const fxy = require('fxy')
const console = require('better-console')
const EventEmitter = require('events')

class GraphLoader extends EventEmitter{
	constructor(options){
		super()
		this.options = options
		this.path =  options.path || '/'
		this.structs = require('./structs')(options.structs)
		this.graphs = new Map()
		this.current = 0
	}
	add(graph){
		let struct = {}
		let pathname = fxy.join(this.path,graph.path)
		struct.path = graph.path
		struct.pathname = pathname
		struct.url = graph.url
		struct.graph = graph
		this.graphs.set(graph.name,struct)
		this.current = 0
		return this.next()
	}
	done(){
		if(this.finished) return true
		const app = require('express')()
		const router = require('./router')
		let logs = []
		for(let struct of this.graphs.values()){
			let graph = struct.graph
			delete struct.graph
			app.use( struct.pathname, router(graph,this.options) )
			logs.push(struct)
		}
		console.table(logs)
		app.structs_index = this.graphs
		this.emit('done',app)
		return this.finished = true
	}
	load(){ return this.next() }
	next(){
		if(this.graphs.size === this.structs.length) return this.done()
		let items = this.waiting
		let index = this.current >= items.length ? this.current=0:this.current
		//console.log({next:index})
		this.current++
		return items[index].graph(this.options,this)
	}
	get waiting(){ return this.structs.filter(item=>!this.graphs.has(fxy.basename(item.name).trim())) }
}

//exports
module.exports = options=>new GraphLoader(options)

module.exports.old = function(graph_struct){
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
}