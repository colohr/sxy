async function load_data(){
	const location = '${(endpoint)}'
	const request = {query: '{ Points{ Site Signals } }'}
	return await load_points()

	//shared actions
	async function load_points(){
		const http = export_http()
		const data = (await http.data(location, request)).data.data.Points
		const Points = await on_data()
		const point = Points.pointer(location, data.Signals)
		point.http = http
		return point

		//shared actions
		function on_data(){
			try{ return (eval(data.Site))(http) }
			catch(e){ throw e }
		}

		function export_http(){
			return get_http()

			//shared actions
			function get_http(){
				return new Proxy(get_source, {
					get(o, name){
						switch(name){
							case 'get':
							case 'post':
							case 'search':
							case 'put':
							case 'get':
								return get_source_method(name)
							case 'data':
								return get_source_method('post', name, {'Content-Type': 'application/json', 'Accept': 'application/json'})
						}
						return null
					}
				})

				//shared actions
				function get_source_method(method, type, preset_headers){
					method = method.toUpperCase()
					return (location, options, headers)=>{
						return get_source(location, get_method_options(options))

						//shared actions
						function get_method_options(input){
							const options = get_options({method, headers: {}})
							if(type === 'data') options.body = input
							else if(typeof input === 'object') Object.assign(options, input)
							if(preset_headers) options.headers = Object.assign(options.headers, preset_headers)
							if(headers) options.headers = Object.assign(options.headers, headers)
							return options
						}
					}
				}
			}

			function get_options(options){ return typeof options !== 'object' && options !== null ? {}:options }

			function get_source(location, options){
				options = get_options(options)
				const {body, headers, method} = options
				return new Promise((success, error)=>{
					const locator = new XMLHttpRequest()
					locator.responseType = 'text'
					locator.open(method || 'GET', location)
					if(headers) for(let name in headers) locator.setRequestHeader(name, headers[name])
					locator.onload = on_load
					locator.onerror = on_error
					//return value
					locator.send(get_body())

					//shared actions
					function get_body(){
						if(typeof body === 'object' && body !== null){
							try{ return JSON.stringify(body) }
							catch(e){ console.error(e) }
						}
						return undefined
					}

					function on_error(e){ return error(e) }

					function on_load(){
						return success({
							get locator(){ return locator },
							get data(){ return get_json() },
							eval: ()=>Promise.resolve(get_module()),
							json: ()=>Promise.resolve(get_json()),
							get module(){ return get_module() },
							get response(){ return this.locator.response },
							text: ()=>Promise.resolve(locator.response)
						})

						//shared actions
						function get_json(){
							try{ return JSON.parse(locator.response) }
							catch(e){ console.error(e) }
							return null
						}

						function get_module(){ return eval(locator.response) }
					}
				})
			}
		}
	}
}