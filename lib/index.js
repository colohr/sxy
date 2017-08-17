const Struct = require('./Struct')
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
module.exports.Structure = require('./Structure')
module.exports.database = require('./Structure/database')
module.exports.app = require('./App')