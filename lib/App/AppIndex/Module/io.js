const Module = require('./')
module.exports = {
	module(_,{name}){
		return Module.modules.filter(item=>item.name===name)[0]
	},
	modules(){
		return Module.modules
	}
}