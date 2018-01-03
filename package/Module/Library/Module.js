const fxy = require('fxy')

class LibraryModule{
	constructor(item,is_graph_structure = false){
		this.item = item
		this.is_structure = is_graph_structure
	}
	module(){
		if(this.is_structure === true) return get_library_struct(this.item.value)
		else if(this.is_structure === 'item') return this.item
		else if(this.is_structure === 'value') return this.item.value
		return require(this.item.get('path'))
	}
}

//exports
module.exports = LibraryModule

//shared actions
function get_library_struct(value){
	//return value
	return new Proxy(value,{ get:get_type, has:has_type })
	//shared actions
	function get_type(o,name){ return has_type(o,name) ? get_type_controller(o._typeMap[name]):null }
	function has_type(o,name){ return name in o._typeMap }
	function get_type_controller(type){
		const type_name = type.constructor.name.replace('GraphQL','')
		const type_value = get_value(type)
		//return value
		return new Proxy(function get_type_value_action(){ return type_value }, {
			get(_,name){
				let o = {type,value:type_value}
				if(name in o.value) return o.value[name]
				else if(name in o.type) return o.type[name]
				if(typeof name === 'string'){
					let rectangular_name = get_rectangular_name(name)
					if(rectangular_name in o.type) return o.type[rectangular_name]
				}
				if(name in o) return o[name]
				return null
			},
			has:has_value
		})
		//shared actions
		function get_rectangular_name(name){ return `_${fxy.id.medial(name)}` }
		function get_value(o){
			let value = {}
			switch(type_name){
				case 'EnumType':
					let list = false
					for(let item of o._values) {
						value[item.name] = item.value
						if(item.name === item.value) list=true
					}
					if(list) return Object.keys(value).map(name=>value[name])
					break
				case 'ObjectType':
				case 'InputObjectType':
					for(let name in o._fields) {
						let field = o._fields[name]
						value[name] = get_type_controller(field.type)
					}
					break
				case 'List':
				case 'Boolean':
				case 'Float':
				case 'ID':
				case 'InterfaceType':
				case 'NonNull':
				case 'Int':
				case 'ScalarType':
				case 'Schema':
				case 'String':
				case 'UnionType':
					value = o
					break
			}
			return value
		}
		function has_value(_,name){
			let o = {type,value:type_value}
			if(name in o || name in o.value || name in o.type) return true
			else if(typeof name === 'string' && (get_rectangular_name(name) in o.type)) return true
			return false
		}
	}
}