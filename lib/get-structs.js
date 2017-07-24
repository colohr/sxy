const fxy = require('fxy')
class Struct extends Map{
	constructor(struct){
		super()
		this.name = struct.get('type').name
		this.path = struct.get('path')
	}
	get graphs(){
		if(!this.has('graphs')){
			let graphs = fxy.tree(this.path,'.graphql').items.only
			this.set('graphs',graphs)
		}
		return this.get('graphs')
	}
	
	get scripts(){
		if(!this.has('scripts')){
			let scripts = fxy.tree(this.path,'.js').items.only
			this.set('scripts',scripts)
		}
		return this.get('scripts')
	}
	get values(){
		let content = {}
		let graphs = this.graphs
		for(let graph of graphs){
			let path = graph.get('path')
			let paths = path.split('/')
			let name = paths[paths.length-1]
			content[name] = [`#------------------------\n#${name}`,graph.content].join('')
		}
		return content
	}
	get value(){
		let values = this.values
		return Object.keys(values).map(key=>values[key]).join('')
	}
}

module.exports = get_structs

function get_structs(directory){
	const data = new Map()
	const structs = require('./App').structs(directory)
	for(let item of structs){
		let struct = new Struct(item)
		data.set(struct.name, struct)
	}
	return data
}