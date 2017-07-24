
const information = require('./information.json')

const info_name = Symbol('Info name')

class Info{
	constructor(name,data){
		if(typeof data === 'object' && data !== null) Object.assign(this,data)
		this[info_name] = name
	}
}

module.exports = new Proxy(information,{
	get(o,name){
		if(name in o) return get_info(name,o[name])
		return null
	}
})


function get_info(...x){
	return new Proxy(new Info(...x),{
		get(o,name){
			if(name in o) return o[name]
			return null
		},
		has(o,name){
			return name in o
		}
	})
}

