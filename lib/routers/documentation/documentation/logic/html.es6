window.fxy.exports('struct',(struct,fxy)=>{
	//exports
	struct.documentation.html = {
		list:get_list
	}
	
	//shared actions
	function get_item(name,value){
		let item = document.createElement('li')
		item.setAttribute('item-value','')
		let html = get_item_html(value)
		item.innerHTML = `<div>${name}</div>${html}`
		return item
	}
	function get_item_html(value){
		let item = document.createElement('div')
		if(fxy.is.object(value)){
			let list = get_list(get_item_data(value))
			list.setAttribute('item-list','')
			item.appendChild(list)
		}
		else if(fxy.is.function(value)) item.innerHTML = `<code>${value.toString()}</code>`
		else item.innerHTML = value
		return item.outerHTML
	}
	function get_item_data(value){
		let data = {}
		if(fxy.is.array(value) || fxy.is.set(value)){
			let array = fxy.is.array(value) ? value:Array.from(value)
			for(let i=0;i<array.length;i++) data[i] = array[i]
		}
		else if(fxy.is.map(value)){
			let names = value.keys()
			for(let name of names){
				data[name] = value.get(name)
			}
		}
		else if(fxy.is.data(value)) return value
		return data
		
	}
	function get_list(data){
		let list = document.createElement('ol')
		list.setAttribute('value-list','')
		for(let name in data){
			list.appendChild(get_item(name,data[name]))
		}
		return list.outerHTML
	}
	
})