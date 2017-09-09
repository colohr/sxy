window.fxy.exports('struct',(struct,fxy)=>{
	const struct_actions = Symbol('struct actions')
	const struct_endpoint = Symbol('struct endpoint')
	const struct_index = Symbol.for('struct index')
	const struct_interface = Symbol('struct interface')
	
	//exports
	struct.Types = {}
	struct.get = get_struct

	//shared actions
	function get_actions(element,actions){
		if(actions) element[struct_actions] = actions
		if(struct_actions in element) return element[struct_actions]
		if('actions' in struct){
			let index = get_index(element)
			if(index && struct.Actions.has(index.name)) element[struct_actions] = struct.Actions.get(index.name)
		}
		return null
	}
	
	function get_client(element){
		let interface = get_interface(element)
		if(interface) return interface.client
		return null
	}
	
	function get_endpoint(element,endpoint){
		if(endpoint) return element[struct_endpoint] = endpoint
		if(struct_index in element) return element[struct_index].endpoint
		else if(fxy.is.element(element) && element.hasAttribute('endpoint')) return element.getAttribute('endpoint')
		else if(struct_endpoint in element) return element[struct_endpoint]
		let index = get_index(element)
		if(index) return index.endpoint
		return null
	}
	
	function get_index(element,name){
		if(struct_index in element) return element[struct_index]
		if(!name) name = element.getAttribute('struct-name')
		if(!name || !(name in struct.library.index.items)) return null
		return element[struct_index] = struct.library.index.items[name]
	}
	
	function get_interface(element,endpoint){
		if(struct_interface in element) return element[struct_interface]
		endpoint = get_endpoint(element,endpoint)
		return element[struct_interface] = new struct.Interface(endpoint)
	}
	
	function get_struct(element){
		return new Proxy(element,{
			get(o,name){
				switch(name){
					case 'actions': return get_actions(o)
					case 'client': return get_client(o)
					case 'endpoint': return get_endpoint(o)
					case 'index': return get_index(o)
					case 'interface': return get_interface(o)
				}
				return null
			},
			has(o,name){
				switch(name){
					case 'actions': return get_actions(o) !== null
					case 'client': return get_client(o) !== null
					case 'endpoint': return get_endpoint(o) !== null
					case 'index': return get_index(o) !== null
					case 'interface': return get_interface(o) !== null
				}
				return false
			},
			set(o,name,value){
				switch(name){
					case 'actions':
						get_actions(o,value)
						break
					case 'endpoint':
						get_endpoint(o,value)
						break
					case 'index':
						get_index(o,value)
						break
					case 'interface':
						get_interface(o,value)
						break
				}
				return true
			}
		})
	}
	
	
})