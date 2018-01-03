const fxy = require('fxy')
const link = Symbol('StructLink')
const StructLinker = require('./Linker')
class StructLink{
	static get get(){ return get_link }
	constructor(struct,linker){
		this.options = require('./options')(struct,linker)
		this.service = get_service(this,struct,linker)
	}
	get endpoint(){ return this.options.endpoint }
	get name(){ return this.options.name }
	get port(){ return this.options.port }
	set port(value){ return this.options.port = value }
}

//exports
module.exports = StructLink

//shared actions
function get_link(struct,linker){
	if(struct.has(link)) return struct.get(link)
	if(fxy.is.nothing(linker)) return null
	return set_link(struct,linker)
}

function set_link(struct,linker){
	return struct.set(link,new StructLink(struct,linker)).get(link)
}

function get_service(link,struct,linker){
	const Linker = StructLinker(linker)
	Linker.prototype.start = function start_service(){ return this.transport.start(link.options) }
	return new Linker(link,struct)
}