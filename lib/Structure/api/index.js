const fetch = require('node-fetch')
const fxy = require('fxy')
const get_url = require('./url')
const query = require('qs')

class Api{
	constructor(api){
		Object.assign(this,api)
		this.urls = get_url(api)
	}
	get(name,options){
		options = this.get_options(options)
		let fetches = [this.get_url(name,options)]
		if(options.headers) fetches.push(options.headers)
		return fetch(...fetches).then(res=>res[options.type]()).then(result=>get_result_data(result,options.selector)).catch(console.error)
	}
	get_options(options){
		if(!fxy.is.data(options)) options = {}
		let {queries,selector,type} = options
		if(!fxy.is.text(selector) && this.result_selector) options.selector=this.result_selector
		if(queries || this.body) options.queries = this.queries(fxy.is.data(queries) ? queries:{})
		if(this.headers) options.headers = this.headers
		if(!fxy.is.text(type)) options.type = 'json'
		return options
	}
	get_url(name,options){
		options = fxy.is.data(options) ? options:this.get_options(options)
		let url = name
		if(name.includes(this.url) !== true) url = this.urls[name](options.input)
		if(options.queries) url = `${url}?${options.queries}`
		return url
	}
	queries(input){ return query.stringify( Object.assign(input || {},this.body) ) }
}

//exports
module.exports = api=>new Api(api)

//shared actions
function get_result_data(result,selector){
	if(fxy.is.object(result) && fxy.is.text(selector)) {
		return fxy.dot.get(result,selector)
	}
	return result
}


