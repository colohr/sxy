window.wwi.exports('type',(type,fxy)=>{

	const data_navigator = Symbol('Data Navigator')
	const data_navigator_id = Symbol('Data Navigator Id')
	
	class Load{
		constructor(api){
			this.api = api
		}
		get element(){ return this.api.element }
		set(name,data){
			let result = this.api.control.result(name,data)
			if(result instanceof Promise) return result.then(result_data=>result_data)
			return result
		}
	}
	
	class Navigator extends Map{
		constructor(){ super() }
		get back(){
			let index = this.selected_index
			let new_index = 0
			if(index > 0) new_index = index - 1
			else new_index = this.count - 1
			return this.list[new_index]
		}
		get count(){ return this.size }
		get first(){ return this.list[0] }
		get id(){ return data_navigator_id }
		index(item){ return this.list.indexOf(item) }
		get last(){ return this.list[this.count-1] }
		get list(){ return Array.from(this.values()) }
		get next(){
			let index = this.selected_index
			let new_index = 0
			if(index < this.count) new_index = index + 1
			return this.list[new_index]
		}
		get selected_index(){
			let selected = this.selected
			if(selected) return this.index(selected)
			return -1
		}
		select(id){
			if(this.has(id)) this.selected = this.get(id)
			return this.get(id)
		}
	}
	
	//exports
	type.data = get_data
	type.navigator = get_data_navigator
	
	//shared actions
	function get_data(api){ return new Load(api) }

	function get_data_navigator(data){
		if(data_navigator in data) return data[data_navigator]
		return data[data_navigator] = new Navigator()
	}

})


