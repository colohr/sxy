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
		const logs = []
		for(let struct of this.graphs.values()){
			let graph = struct.graph
			delete struct.graph

			app.use(struct.pathname, router(graph,this.options))
			logs.push(get_loggable(struct))
		}
		console.table(logs)
		app.structs_index = this.graphs
		this.emit('done',app)

		return this.finished = require('../Structure').loaded()
	}
	load(){

		return this.next()
	}
	next(){
		if(this.graphs.size === this.structs.length) return this.done()
		let items = this.waiting
		let index = this.current >= items.length ? this.current=0:this.current
		this.current++
		return items[index].graph(this.options,this)
	}
	get waiting(){ return this.structs.filter(item=>!this.graphs.has(fxy.basename(item.name).trim())) }
}

//exports
module.exports = options=>new GraphLoader(options)

//actions
function get_actions(graph){
	let folder = graph.folder
	let file = fxy.join(folder,'Instruct/actions.graphql')
	if(fxy.exists(file)){
		return {
			name:graph.name,
			content:fxy.readFileSync(file,'utf8')
		}
	}
	return null
}



function get_loggable(item){
	let data = {}
	for(let name in item){
		const value = item[name]
		switch(name){
			case 'path':
			case 'url':
				break
			case 'graph':
			case 'actions':
				data[name] = value !== null
				break
			case 'pathname':
				data['@'] = `${value}\n${item.url}`
				break
			default:
				if(!fxy.is.function(value) || fxy.is.symbol(value)) data[name] = value
		}
	}
	return data
}