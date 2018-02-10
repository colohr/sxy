const Struct = {
	get enum(){ return require('./enum') },
	get scalar(){ return require('./scalar') },
	get shared(){ return require('../Utility').folder.shared },
	get struct(){ return require('../Structure').Pointer.struct },
	get utility(){ return require('../Utility') },
	get Dictionary(){ return require('../Structure/dictionary').scalars }
}

//exports
module.exports = Struct