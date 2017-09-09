window.fxy.exports('struct',(struct)=>{
	//exports
	struct.client = get_client
	//shared actions
	function get_client(struct){
		return new Proxy({
			actions:struct.actions,
			client:struct.client
		},{
			get(o,name){
				if(o.actions && name in o.actions) {
					let action = o.actions[name]
					return (input)=>o.client.request(action,input).then(response=>{
						if(name in response) return response[name]
						let first = Object.keys(response)[0]
						return response[first]
					})
				}
				else if(name in o.client) return o.client[name]
				return null
			}
		})
	}
})