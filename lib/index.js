const Struct = require('./Struct')
const App = require('./App')

//exports
module.exports = new Proxy(require('./Module'),{
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

module.exports.App = App
module.exports.app = App.get

module.exports.Structure = require('./Structure')
module.exports.api = require('./Structure/api')
module.exports.database = require('./Structure/database')

