const fxy = require('fxy')
const information = {
	file:{
		get data(){ return fxy.json.read_sync(this.location()) },
		location(folder){ return fxy.is.nothing(folder) ? fxy.join(__dirname,this.name):fxy.join(folder,this.name)  },
		join(data){ return fxy.as.one(this.data,data) },
		name:'information.json'
	},
	load:load_information,
	name:Symbol('info name'),
	register:register_information
}

const Information = new Proxy(get_information,{
	get(get,name){
		const o = get()
		if(name in o) return get_info_value(name,o[name])
		return null
	}
})

class Info{
	constructor(name,data){
		if(typeof data === 'object' && data !== null) Object.assign(this,data)
		this[information.name] = name
	}
}

//exports
module.exports = Information

//shared actions
function get_info_value(...x){
	return new Proxy(new Info(...x),{
		get:(o,name)=>name in o ? o[name]:null,
		has:(o,name)=>name in o
	})
}

function get_information(custom_info){
	if(fxy.is.text(custom_info)) return register_information(read_information(custom_info))
	else if(fxy.is.data(custom_info)) return register_information(custom_info)
	return load_information()
}

function load_information(){ return 'value' in information ? information.value:information.file.data }

function read_information(file){
	if(fxy.exists(file)){
		try{ return fxy.json.read_sync(file) }
		catch(e){ console.error(e) }
	}
	return null
}

function register_information(information_data){
	if(fxy.is.data(information_data)) information.value = information.file.join(information_data)
	return load_information()
}
