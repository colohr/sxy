const fxy = require('fxy')

const Urls = {
	id:fxy.tag.closure`${'url'}/${'path'}/${'id'}`
}

module.exports = (api)=>{
	let urls = {}
	if('host' in api && 'endpoints' in api){
		let url = api.host
		let endpoints = api.endpoints
		for(let path in endpoints){
			let endpoint = endpoints[path]
			if(endpoint === true) urls[path] = ()=>{ return `${url}/${path}` }
			else  if(endpoint in Urls){
				urls[path] = (x)=>{
					let o = typeof x === 'object' ? x:{}
					if(typeof x !== 'object') o[endpoint] = x
					o.url = url
					o.path = path
					return Urls[endpoint](o)
				}
			}
		}
	}
	return urls
}

