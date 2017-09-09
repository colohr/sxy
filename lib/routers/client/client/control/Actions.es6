window.fxy.exports('struct',(struct,fxy)=>{
	
	class Actions{
		
		static get get(){ return get_action }
		static get get_name(){ return get_actions_name }
		static get set(){ return get_action }
		
		constructor({content,file,name,io}){
			if(!fxy.is.text(content)) throw new Error('Actions content value must be a text value.')
			
			this.data = {}
			this.file = file
			this.io = io || 'query'
			this.name = get_actions_name(this.file,name)
			let queries = content.split(this.io).map(item=>item.trim())
			
			for(let item of queries){
				let name = null
				if(item.includes('(')) name = get_function_name(item)
				else name = get_name(item)
				if(name) this.data[name] = `${this.io} ${item}`
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
	
	//exports
	struct.Actions = Actions
	struct.action = get_action
	
	//shared actions
	function get_action(name,action){
		if(action) action = set_action(action)
		else if(has_action(name)) action = Actions.data.get(name)
		if(!action) return null
		return new Proxy(action,{
			get(o,name){
				let value = null
				if(name in o) value = o[name]
				else if(o.has(name)) value = o.get(name)
				if(typeof value === 'function') value = value.bind(o)
				return value
			},
			has(o,name){
				return name in o.data
			}
		})
	}
	
	function get_actions_name(file,name){ return name || fxy.file.file(file).replace('.graphql','') }
	
	function get_function_name(value){
		let items = value.split('(')
		return items[0].trim()
	}
	
	function get_name(value){
		let items = value.split('{')
		return fxy.id._(items[0].trim())
	}
	
	function set_action(action){
		if(!(action instanceof Actions)) action = new Actions(action)
		if(action instanceof Actions){
			if(!('data' in Actions)) Actions.data = new Map()
			return Actions.data.set(action.name,action).get(action.name)
		}
		return null
	}
	
	function has_action(name){ return 'data' in Actions && Actions.data.has(name) }

})