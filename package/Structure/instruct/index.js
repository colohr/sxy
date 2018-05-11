const Instruct = {
	get info(){ return require('./info') },
	get information(){ return require('./information') },
	get directives(){ return require('./directives') },
	get models(){ return require('./models') },
	get scalars(){ return require('./scalars') },
	get setting(){ return require('./setting') },
	template(){ return require('./information.json') },
	get resolvers(){ return require('./resolvers') }
}

const instruct = new Proxy(get_instruct,{
	get:(o,name)=>name in Instruct ? Instruct[name]:null
})

//exports
module.exports = instruct

//shared actions
function get_instruct(custom_info){
	Instruct.info(custom_info)
	return instruct
}