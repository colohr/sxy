const fetch = require('node-fetch')
const {get} = require('lodash')
const get_url = require('./url')

class Api{
	constructor(api){
		Object.assign(this,api)
		this.urls = get_url(api)
	}
	get url(){
		return new Proxy(this.urls,{
			get(o,name){
				if(name in o) return o[name]
				return
			}
		})
	}
	get(url){
		let result_selector = this.result_selector || null
		let x = [url]
		if( 'headers' in this ) x.push({headers:this.headers})
		return fetch(...x).then(res=>res.json()).then(result=>get_result_data(result,result_selector))
	}
}

module.exports = (api)=>{ return new Api(api) }

function get_result_data(result,result_selector){
	if(typeof result === 'object' && result !== null){
		if(typeof result_selector === 'string') return get(result,result_selector)
	}
	return result
}


