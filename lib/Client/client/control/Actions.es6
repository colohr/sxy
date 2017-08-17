window.fxy.exports('struct',(struct,fxy)=>{
	class Actions{
		constructor(content,type="query"){
			if(!fxy.is.text(content)) throw new Error('Actions content value must be a text value.')
			let queries = content.split(type).map(item=>item.trim())
			this.data = {}
			for(let item of queries){
				let name = null
				if(item.includes('(')) name = get_function_name(item)
				else name = get_name(item)
				if(name) this.data[name] = `${type} ${item}`
			}
		}
		get(name){ return this.has(name) ? this.data[name]:null }
		has(name){ return name in this.data }
		set(name,value){
			if(fxy.is.text(name) && fxy.is.text(value) && name.length && value.length){
				this.data[name] = value
			}
			return this
		}
	}
	
	struct.Actions = Actions
	struct.actions = load_actions
	
	//shared actions
	function get_function_name(value){
		let items = value.split('(')
		return fxy.id._(items[0].trim())
	}
	function get_name(value){
		let items = value.split('{')
		return fxy.id._(items[0].trim())
	}
	
	function load_actions(actions_graphql_file){
		return window.fetch(actions_graphql_file)
		             .then(x=>x.text()).then(set_actions)
		//shared actions
		function set_actions(content){
			return  new Proxy(new Actions(content),{
				get(o,name){
					let value = null
					if(name in o) value = o[name]
					else if(o.has(name)) value = o.get(name)
					if(typeof value === 'function') value = value.bind(o)
					return value
				}
			})
		}
	}

})