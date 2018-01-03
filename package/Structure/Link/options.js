const fxy = require('fxy')
const Url = require('url')

//exports
module.exports = get_options

//shared actions
function get_options(struct,linker){
	const name = linker.name || 'link'
	return {
		get endpoint(){ return this.value = Url.format(this.url) },
		name,
		get path(){ return this.url.path },
		get port(){ return this.url.port },
		set port(x){ return set_port(this,x) },
		get schema(){ return struct.get('schema') },
		get url(){ return Url.parse(this.value) },
		value:get_value(struct,name)
	}
}

function set_port(options,x){
	const endpoint = options.endpoint
	const port = options.url.port
	return 	options.value = endpoint.replace(port,x)
}

function get_value(struct,name){
	let url = Url.parse(struct.url)
	url.protocol = 'ws'
	return Url.format(url).replace(fxy.basename(struct.url),name)
}
