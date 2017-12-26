const Instruct = {
	get info(){ return require('./info') },
	get models(){ return require('./models') },
	template(){ return require('./information.json') },
	get type(){ return require('./type') },
	get types(){ return require('./types') }
}

const instruct = new Proxy(get_instruct,{
	get:(o,name)=>name in Instruct ? Instruct[name]:null
})

//exports
module.exports = get_instruct

//shared actions
function get_instruct(custom_info){
	instruct.info(custom_info)
	return instruct
}