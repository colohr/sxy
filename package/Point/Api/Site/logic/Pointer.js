window.fxy.exports('Points',Points=>{
	class Pointer{
		constructor(endpoint,signals,get_headers,socket){
			this.endpoint = endpoint
			if(signals) this.signals = new Points.Signal(signals,endpoint)
			if(get_headers) this.get_headers = get_headers
			if(socket) {
				this.socket = socket
				this.push = get_push(this)
			}
		}
		get api(){ return get_api(this) }
		get headers(){ return 'get_headers' in this ? this.get_headers():null }
		get list(){
			const list = {}
			if('signals' in this){
				list.fragments = Array.from(this.signals.data.fragments.keys()).sort()
				list.snippets = Array.from(this.signals.data.keys()).filter(name=>list.fragments.includes(name)===false).sort()
				
			}
			return list
		}
	}
	
	//exports
	Points.Pointer = Pointer
	
	//shared actions
	function get_api(pointer){
		return new Proxy(pointer,{
			get(o,name){
				if(o.signals){
					if(name in o.signals.data){
						const query = o.signals.data[name]
						return get_point(o,query)
					}
				}
				return null
			}
		})
	}
	
	function get_push(pointer){
		const socket = pointer.socket
		return new Proxy(pointer,{ get(o,name){ return (o.signals && name in o.signals.data) ? get_signal(name):null } })
		//shared actions
		function get_signal(name){
			return data=>{
				return new Promise(success=>{
					const input = {name,data}
					return socket.emit('point',input,result=>success(result))
				})
			}
		}
	}
	
	function get_point(pointer,query){
		const sender = point(pointer.endpoint,pointer.headers)
		return (variables,bugs)=>sender(query,variables,bugs)
	}
	
	function point(endpoint,headers){
		return (query,variables,bugs)=>{
			const input = {query}
			if(variables) input.variables = variables
			return http.data(endpoint,input,headers).then(on_result)
			//shared actions
			function on_result(result){
				let data = result.data
				let errors = null
				if('data' in data) data = data.data
				if('errors' in data) errors = data.errors
				if(errors) on_bugs(errors,bugs,!data)
				if(data) return data
				throw new Error(`Invalid GraphQL response for endpoint: "${endpoint}"`)
			}
			function on_bugs(errors,bugs,throws=false){ return on_point_bugs(endpoint,input,errors,bugs,throws) }
		}
	}
	
	function on_point_bugs(endpoint,input,errors,bugs,throws=false){
		console.group(`%cError: ${endpoint}`,'color:red')
		console.group(`%cSignal -> \n\t${query}`,'color:darkorange')
		if(input.variables) console.group(`%cInput -> \n\t${JSON.stringify(input.variables,null,2)}`,'color:seagreen')
		const error = new Error(`GraphQL Error in endpoint: "${endpoint}". ${errors[0].message}`)
		if(console.table) {
			for(let item of errors){
				if('locations' in item){
					const count = item.locations.length
					for(let i=0;i<count;i++){
						const location = item.locations[i]
						item[`location ${i+1}`] = `line: ${location.line}, column: ${location.column}`
					}
					delete item.locations
				}
			}
			console.table(errors)
		}
		else console.error(errors)
		if(bugs) errors.forEach((error)=>bugs(error,{endpoint,input}))
		console.groupEnd()
		if(throws === true) throw error
	}
	
})