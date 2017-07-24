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

//module.exports.Server = require('./Server')
//module.exports.Structs =  require('./Structs')
module.exports.Structure = require('./Structure')
module.exports.database = require('./Structure/database')
//console.log('app')
module.exports.app = require('./App')
//module.exports.app_example = require('./app.example.json')
//module.exports.get_structs = require('./structs')
