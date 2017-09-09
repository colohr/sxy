window.fxy.exports('struct',(struct,fxy)=>{
	const structs = new WeakMap()
	structs.index = fxy.symbols.struct_index
	//exports
	struct.load = {
		get actions(){ return load_actions },
		get index(){ return get_index },
		get ['interface'](){ return load_interface },
		get type(){ return load_type },
		get ui(){ return load_ui },
		get url(){ return get_url }
	}
	
	//shared actions
	function get_index(index){
		let library = struct.library
		if(fxy.is.text(index) && index in library.index.items) return library.index.items[index]
		return fxy.is.data(index) ? index:null
	}
	function get_url(...paths){ return fxy.file.url(struct.library.url,'external',...paths) }
	
	function load_actions(item,type){
		if(fxy.is.text(item)) item = {file:item}
		if(!fxy.is.text(type)) type = 'text'
		return new Promise((success,error)=>{
			let name = struct.Actions.get_name(item.file,item.name)
			let action = struct.Actions.get(name)
			if(action) return success(action)
			return window.fetch(item.file).then(x=>x[type]()).then(content=>{
				if(fxy.is.text(content)) item.content = content
				else if(fxy.is.array(content)) item = content[0]
				else item = content
				return success(struct.Actions.get(name,item))
			}).catch(error)
		})
	}
	
	function load_interface(){
		return new Promise((success,error)=>{
			if('Interface' in struct) return success(struct.Interface)
			return fxy.port.eval(fxy.file.url(struct.library.folder,'external/Interface.es6'))
			          .then(Interface=>struct.Interface = Interface).then(success).catch(error)
		})
	}
	
	function load_type(type,index){
		
		return new Promise((success,error)=>{
			index = get_index(index)
			if(!index) return error(new Error(`The index for the Struct named:${type.constructor.name} does not exists.`))
			if(structs.has(type.constructor)) return success(structs.get(type.constructor))
			return files().then(actions=>{
				
				return struct.client({actions, client:(new struct.Interface(index.endpoint)).client})
				             .Struct({type:type.constructor.name})
				             .then(data=>success(structs.set(type.constructor,data).get(type.constructor))).catch(error)
			})
		})
		//shared actions
		function files(){
			return new Promise((success,error)=>{
				if('actions' in struct.library) return success(struct.library.actions)
				return get_interface().then(actions=>success(struct.library.actions=actions)).catch(error)
			})
			function get_interface(){ return load_interface().then(_=>load_actions(fxy.file.url(struct.library.folder,'actions/struct-index.graphql'))) }
		}
	}
	
	function load_ui(){
		return new Promise((success,error)=>{
			if('UI' in struct) return success(struct.UI)
			return fxy.port.eval(fxy.file.url(struct.library.folder,'external/UI.es6'))
			          .then(UI=>struct.UI = UI).then(success).catch(error)
		})
	}
	
})