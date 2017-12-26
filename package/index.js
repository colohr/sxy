const Cloud = require('./Cloud')
const Module = require('./Module')
const Items = [
	'Struct',
	'Point',
	'Cloud',
	'Data',
	'Print',
	'Structure'
]

const app = new Proxy(Cloud.start,{
	get(o,name){
		if(name in Cloud) return Cloud[name]
		if(name in o) return o[name]
		return null
	},
	has(o,name){ return name in Cloud || name in o }
})

const sxy = new Proxy(Module,{
	get(o,name){
		if(name in o) return o[name]
		else if(name === 'cloud') return Cloud.create
		else if(name === 'print') return require('./Print')
		else if(name === 'template') return require('./Structure').template
		else if(name === 'instruct') return require('./Structure/instruct')
		return get_value(Items,name)
	},
	has(o,name){
		if(name in o) return true
		return has_value(Items,name)
	}
})

//exports
module.exports = sxy
module.exports.app = app


//shared actions
function get_value(items,name){
	if(items.includes(name)) return require(`./${name}`)
	for(let item_name of items){
		let item = require(`./${item_name}`)
		if(name in item) return item[name]
	}
	return null
}

function has_value(items,name){
	if(items.includes(name)) return true
	for(let item_name of items){
		let item = require(`./${item_name}`)
		if(name in item) return true
	}
	return false
}


//module.exports.App = App
//module.exports.app = app
//module.exports.Data = Data
//module.exports.Structure = Structure
//module.exports.template = Structure.template

//module.exports.api = require('./Structure/api')
//module.exports.database = require('./Structure/database')

//else if(name in Struct) return Struct[name]
//else if(name in App) return App[name]
//else if(name in Data) return Data[name]

//else if(name in Struct) return true
//else if(name in App) return true
//else if(name in Data) return true