const Linker = Base => class extends Base{
	get transport(){ return require('./Transport')(this) }
}

//exports
module.exports = Linker