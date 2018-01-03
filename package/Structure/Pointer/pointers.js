const fxy = require('fxy')
const Utility = require('../../Utility')
const Interface = require('./Interface')
const Data = require('./Data')


//exports
module.exports = Interface.pointer
module.exports.get = get_pointer
module.exports.has = has_pointer
module.exports.ready = ready_pointer
module.exports.set = set_pointer

//shared actions
function get_pointer(folder){
	folder = Utility.folder.clean(folder)
	return Data.has(folder) ? Data.get(folder):null
}

function has_pointer(folder){
	folder = Utility.folder.clean(folder)
	return Data.has(folder)
}

function set_pointer(folder,structure){
	const pointer = Interface.pointer(folder)
	return Data.save(pointer,structure)
}

function ready_pointer(options){
	if(fxy.is.data(options) && 'shared' in options){
		const shared = fxy.is.text(options.shared) ? [options.shared]:options.shared
		if(fxy.is.array(shared)) {
			return shared.filter(folder=>!has_pointer(folder)).length === 0
		}
	}
	return true
}

