const fxy = require('fxy')

require('../Module').library({name:'sxy',folder:__dirname})

module.exports = new Proxy(fxy.tree(__dirname).items,{
	get(o,name){
		let value = get_dictionary(o,name)
		if(value === null && name in o) {
			let value = o[name]
			if(fxy.is.map(value)) return require(value.get('path'))
			return value
		}
		return value
	}
})

//shared actions

function get_dictionary(items,name){
	
	for(let item of items){
		if(item.get('type').directory){
			
			if(item.name === name) return require(item.get('path'))
		}
	}
	return null
}