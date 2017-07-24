window.fxy.exports('type', (type, fxy) => {
	
	const api_control = Symbol('api control')
	const api_data = Symbol('api data')
	const api_graph = Symbol.for('api graph')
	const api_library = Symbol.for('api library')
	
	class ApiControl{
		constructor(api,control){
			this.api = api
			if(fxy.is.data(control)){
				if('container' in control && fxy.is.element(control.container)) this.container = control.container
				this.queries = 'queries' in control && fxy.is.data(control.queries) ? control.queries:{}
				this.results = 'results' in control && fxy.is.data(control.results) ? control.results:{}
				
			}
		}
		navigator(data){ return type.navigator(data) }
		result(name,data){
			if(name in data) data = data[name]
			if(name in this.results) data = this.results[name](data,this)
			return data
		}
	}
	
	class ApiLibrary {
		static get(name){
			if(this.has(name)) return this.items[name]
			return {}
		}
		static has(name){
			if(fxy.is.text(name) !== true) return false
			return name in this.items
		}
		static get index(){ return type.index }
		static get items(){
			let index = this.index
			if(fxy.is.data(index) && 'items' in index && fxy.is.data(index.items)) return index.items
			return {}
		}
		static get names(){ return Object.keys(this.items) }
		constructor(element) {
			if(fxy.is.element(element)) this.element = element
			this.name = 'element' in this ? get_api_name(element):element
			if(!this.name) throw new Error(`Invalid name for type.Api mixin ${this.constructor.names}`)
		}
		get control(){ return this[api_control] }
		set control(value){ return this[api_control] = new ApiControl(this,value) }
		get data(){ return get_api_data(this) }
		get graph(){ return get_api_graph(this) }
		get paths(){ return [this.type.host,this.type.port].concat(this.type.paths) }
		get type(){ return this.constructor.get(this.name) }
	}

	
	//exports
	type.Api = Base => class extends Base{
		get api() { return get_api_library(this) }
		get data(){ return this.api.data }
		get graph(){ return this.api.graph }
	}
	
	//shared actions
	function get_api_data(element){
		if(api_data in element) return element[api_data]
		return element[api_data] = type.data(element)
	}
	
	function get_api_library(element){
		if(api_library in element) return element[api_library]
		return element[api_library] = new ApiLibrary(element)
	}
	
	function get_api_graph(api){
		if(api_graph in api) return api[api_graph]
		let webpaths = [api.type.host,api.type.port].concat(api.type.paths).filter(path=>path)
		return api[api_graph] = fxy.require('graph/api')(...webpaths)
	}
	
	function get_api_name(element){
		let name = element.hasAttribute('name') ? element.getAttribute('name'):null
		if(name && ApiLibrary.has(name)) return name
		name = element.hasAttribute('id') ? element.getAttribute('id'):null
		if(name && ApiLibrary.has(name)) return name
		name = element.hasAttribute('type-name') ? element.getAttribute('type-name'):null
		if(name && ApiLibrary.has(name)) return name
		return null
	}
	
	
	
	
	

})
