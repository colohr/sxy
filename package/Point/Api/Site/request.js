window.fxy.exports('Points',Points=>{
	
	const Request = {
		actions:new Map(),
		header(endpoint,content_type,request_headers){
			let headers = this.headers(endpoint,content_type)
			return Object.assign(headers,request_headers || {})
		},
		headers(endpoint,content_type){
			let type = content_type === 'json' ? content_type:endpoint.split('.')[1]
			let value = null
			switch(type){
				case 'js':
				case 'es6':
					value = `application/javascript`
					break
				case 'json':
					value = `application/json`
					break
				default:
					value = `text/${type}`
					break
			}
			return {
				'Content-Type':value,
				'Accept':value
			}
		},
		names:{get:'GET',post:'POST'}
		
	}
	
	//exports
	Points.request = request_proxy()
	Points.get = request_get()
	Points.post = request_post()
	
	//shared actions
	function get_json(data){
		if(typeof data !== 'object' || data === null) return data
		try{ return JSON.stringify(data) }
		catch(e){ return e }
	}
	
	function get_request(endpoint,name='GET',content_type='text'){
		let request = new XMLHttpRequest()
		request.responseType = content_type
		request.open(name, endpoint)
		return request
	}
	
	function http_request(endpoint,name,content_type){
		const sender = {
			request:get_request(endpoint,name,content_type),
			send(data,headers){ return send(data,headers,this.request) }
		}
		return (data,request_headers)=>{
			let headers = Request.header(endpoint,content_type,request_headers)
			return sender.send(data,headers)
			             .then(result=>{
			             	console.log({result})
				             return result
			             })
			             .then(result=>result.response)
		}
	}
	
	function request_get(){ return { data(endpoint){ return Points.request.get(endpoint,'json') } } }
	
	function request_headers(request,headers){
		for(let name in headers) {
			let value = headers[name]
			if(value === null || typeof value === 'undefined') request.setRequestHeader(name,value)
		}
		return request
	}
	
	function request_post(){ return { data(endpoint){ return Points.request.post(endpoint,'json') } } }
	
	function request_proxy(){
		return new Proxy(Request,{
			get(o,name){
				let request_name = name in o.names ? o.names[name]:name
				return (endpoint,content_type)=>http_request(endpoint,request_name,content_type)
			},
			has(o,name){ return name in o || name in o.names }
		})
	}
	
	function send(data,...x){
		return new Promise((success,error)=>{
			const request = request_headers(x[1],x[0])
			request.onload = on_load
			request.onerror = on_error
			request.send(get_json(data))
			
			//shared actions
			function on_load(){ return success(request) }
			function on_error(event){
				console.error(event)
				return error(event)
			}
		})
	}
	
})