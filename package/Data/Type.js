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
		const is_underscored = type.constructor.is_underscored
		for(const i in data){
			const name = i.indexOf('_') !== 0 && is_underscored ? fxy.id._(i):i
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
	try{
		return eval(`((Type,underscored)=>{
			return class extends Type{
				static get is_underscored(){ return underscored }
				${prototype.join('')}
			}
		})`)(Type,underscored)
	}catch(e){
		console.error(`Point.Type.get_type`)
		console.error(e)
	}
	
}

function get_lines(map){
	return map.split('\n')
	          .map(line=>line.trim())
	          .filter(filter_comments)
	          .filter(line=>line.length)
	
}
function filter_comments(line){
	return line.indexOf('#') !== 0 && line.indexOf(`"""`) !== 0
}

function get_name(item){
	return item.split(':')[0].trim()
}