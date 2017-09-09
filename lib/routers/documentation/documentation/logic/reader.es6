window.fxy.exports('struct',(struct)=>{

	//exports
	struct.documentation.reader = {
		read:read,
		type:get_type,
		copy:get_copy
	}
	
	//shared actions
	function get_copy(data){ return JSON.parse(JSON.stringify(data)) }
	
	function get_description(prototype,name){
		let descriptor = Object.getOwnPropertyDescriptor(prototype,name)
		let description = {name,property:{},value:''}
		for(let i in descriptor){
			switch(i){
				case 'get':
				case 'set':
				case 'value':
					let value = descriptor[i]
					let text = ''
					if(typeof value === 'function') text = value.toLocaleString()
					else if(!fxy.is.nothing(value)) text = `${value}`
					if(text) description.value += `${text}\n`
					break
				default:
					description.property[i] = descriptor[i]
					break
				
			}
		}
		return description
	}
	
	function get_type(value){
		let text = ''
		if(typeof value === 'function'){
			text = value.toLocaleString()
			if(is_class()) return 'class'
			if(is_mixin()) return 'mixin'
			return 'function'
		}
		else if(fxy.is.nothing(value)) return 'nothing'
		else if(typeof value === 'object'){
			if(fxy.is.array(value)) return 'array'
			else if(fxy.is.map(value)) return 'map'
			else if(fxy.is.set(value)) return 'set'
			else if(fxy.is.element(value)) return 'element'
			else if(fxy.is.error(value)) return 'error'
			else if(fxy.is.data(value)) return 'data'
 		}
		return typeof value
		//shared actions
		function is_class(){
			return text.trim().indexOf('class') === 0
		}
		function is_mixin(){
			if(value.length === 1){
				if(text.includes('class extends')) return true
			}
			return false
		}
	}
	
	function read(value){
		let type = get_type(value)
		let data = {
			type,
			value:{}
		}
		switch(type){
			case 'mixin':
				data.value = read_mixin(value)
				break
			case 'class':
			case 'function':
				data.value = value.toLocaleString()
				break
			case 'set':
			case 'map':
			case 'data':
			case 'array':
				data.value = JSON.stringify(value)
				break
			default:
				data.value = value
				break
		}
		return data
	}
	
	function read_mixin(mixin){
		let sample = mixin(Object)
		let prototype = sample.prototype
		let names = Object.getOwnPropertyNames(sample.prototype).filter(name=>name!=="constructor")
		let value = {}
		for(let name of names){
			value[name] = get_description(prototype,name).value
		}
		return value
	}
	
	
	
})