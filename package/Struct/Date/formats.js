const fxy = require('fxy')
const Formats = get_map()
module.exports = Formats
module.exports.formats = get_formats()
module.exports.action = get_formats

//shared actions
function get_format(o,name){
	let value = null
	if(is_format(name)) return name
	switch(name){
		case 'ordinal':
			let ordinal = Array.from(o.values()).filter(item=>item.ordinal)
			if(ordinal.length) value = ordinal[0].name
			break
		default:
			let number = fxy.as.number(name)
			if(fxy.is.number(number)){
				let count = Array.from(o.values()).filter(item=>item.count===number)
				if(count.length) value = count[0].name
			}
		
	}
	return value !== null ? value:Array.from(o.keys())[0].name
}

function get_formats(moment){
	const o = Formats
	return new Proxy((...formats)=>set_formats(moment,...formats),{
		get(_,name){
			switch(name){
				case 'types': return Array.from(o.keys())
				case 'values': return get_values(o)
				default:
					if(o.has(name)) return get_value(o.get(name))
					if(name in o) return o[name]
				
			}
			return null
		}
	})
}

function get_map(){
	const map = new Map(require('./moment-formats.json'))
	for(let [name,value] of map){
		map.set(name,new Map(value))
	}
	return map
	
}

function get_value(type){
	return new Proxy(type,{
		get(o,name){
			if(name in o) return o[name]
			return get_format(o,name)
		}
	})
}

function get_values(o){
	let values = []
	for(let formats of o.values()){
		values = values.concat(Array.from(formats.keys()))
	}
	return values
}

function is_format(name){
	return get_values(Formats).includes(name)
}

function set_formats(moment,...formats){
	return moment.format(formats.join(' '))
}