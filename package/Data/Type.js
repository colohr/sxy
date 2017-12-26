const fxy = require('fxy')

class Type extends Map{
	constructor(data){
		super()
		set_data(this,data)
	}
}

//exports
module.exports = get_type

//shared actions
function set_data(type,data){
	if(fxy.is.data(data)){
		let is_underscored = type.constructor.is_underscored
		for(let i in data){
			let name = is_underscored ? fxy.id._(i):i
			type.set(name,data[i])
		}
	}
}

function get_type(map,underscored=true){
	let lines = get_lines(map)
	let prototype = []
	for(let item of lines){
		let name = get_name(item)
		prototype.push(`
			get ${name}(){ return this.get('${name}') }
			set ${name}(value){ return this.set('${name}',value) }
		`)
	}
	return eval(`((Type,underscored)=>{
		return class extends Type{
			static get is_underscored(){ return underscored }
			${prototype.join('')}
		}
	})`)(Type,underscored)
}

function get_lines(map){
	return map.split('\n')
	          .map(line=>line.trim())
	          .filter(line=>!(line.indexOf('#') === 0))
	          .filter(line=>line.length)
}

function get_name(item){
	return item.split(':')[0].trim()
}