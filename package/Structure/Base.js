const fxy = require('fxy')
const basename = Symbol.for('Graph basename')
const folder = Symbol.for('Graph folder')
const endpoint_url = Symbol.for('Graph endpoint url')

class StructureBase extends Map{
	static basename(graph){ return graph.get(basename) }
	static folder(graph){ return graph.get(folder) }
	static identity(graph){ return this.basename(graph).trim() }
	static url(graph){ return graph.get(endpoint_url) }
	constructor(...x){
		super([
			[basename, fxy.basename(x[0])],
			[endpoint_url, x[1]],
			[folder, x[0]]
		])
		this.path = `/${this.name}`
	}
	get folder(){ return this.get(folder) }
	get name(){ return this.constructor.identity(this) }
	get url(){ return this.get(endpoint_url) }
}

//exports
module.exports = StructureBase