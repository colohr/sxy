const Struct = require('./Struct')
const App = require('./App')

const app = new Proxy(App.start,{
	get(o,name){
		if(name in App) return App[name]
		if(name in o) return o[name]
		return null
	},
	has(o,name){ return name in App || name in o }
})

const sxy = new Proxy(require('./Module'),{
	get(o,name){
		if(name in o) return o[name]
		else if(name in Struct) return Struct[name]
		return null
	},
	has(o,name){
		if(name in o) return true
		else if(name in Struct) return true
		return false
	}
})

//exports
module.exports = sxy
module.exports.App = App
module.exports.app = app

module.exports.Structure = require('./Structure')
module.exports.api = require('./Structure/api')
module.exports.database = require('./Structure/database')