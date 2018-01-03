window.fxy.exports('Points',(Points,fxy)=>{
	
	const Types = ['query','mutation','subscription','fragment']
	class Items extends Map{
		constructor(items){
			const fragments = items.filter(item=>item[1].type === 'fragment')
			super(items.filter(item=>item.type !== 'fragment'))
			this.fragments = new Map(fragments)
			this.fragment_names = fragments.map(fragment=>fragment[0].split(' on ')[0].trim())
		}
		get_fragments(item){
			let fragments = []
			let names = Array.from(this.fragments.keys())
			for(let fragment of names){
				let match = `...${fragment}`
				if(item.line.indexOf(match) >= 0) fragments.push(this.fragments.get(fragment).value)
			}
			return fragments
		}
	}
	
	
	//exports
	Points.utility = {
		signal_data:get_content
	}
	
	//shared actions
	function get_content(content){
		content = fix_content(content)
		const lines = content.split('\r').map(line=>line.trim()).filter(line=>line.length)
		const items = new Items(lines.map(get_content_item))

		//return value
		return new Proxy(items,{
			deleteProperty(o,name){return o.delete(name)},
			get(o,name){
				let value = null
				if(fxy.is.symbol(name) && name in o) value = o[name]
				else value = o.has(name) ? o.get(name).value:null
				if(fxy.is.function(value)) value = value.bind(o)
				return value
			},
			has(o,name){return o.has(name)},
			set(o,name,data){return set_data(o,name,data)}
		})
		
		// shared actions
		function get_content_item(line){
			const name = get_content_item_name(line)
			return [name,{
				name,
				has_fragments:line.indexOf('...') >= 0,
				line,
				type:get_content_item_type(line),
				get value(){ return get_value(this) }
			}]
			
			//shared actions
			function get_value(item){
				if(item.has_fragments){
					let value = [item.line]
					let fragments = items.get_fragments(item)
					value = value.concat(fragments)
					return Array.from(new Set(value)).join('\n')
				}
				return item.line
			}
			
		}
	}
	
	function set_data(o,name,data){
		if(fxy.is.text(name)){
			if(fxy.is.text(data)) data = {value:data}
			if(fxy.is.data(data)) o.set(name,data)
		}
		return true
	}
	
	function get_content_item_name(line){
		let name = line
		for(let type of Types) name = name.replace(type,'')
		name = name.trim()
		if(name.includes('(')) name = name.split('(')[0]
		if(name.includes('{')) name = name.split('{')[0]
		if(name.includes(' on ')) name = name.split(' on ')[0]
		return name.trim()
	}
	
	function get_content_item_type(line){
		for(let type of Types) if(line.indexOf(type) === 0) return type
		return Types[0]
	}
	
	function fix_content(content){
		return content.replace(/\r/g,' ')
		              .replace(/\n/g,' ')
		              .replace(/\t/g,' ')
		              .replace(/       /g,' ')
		              .replace(/      /g,' ')
		              .replace(/     /g,' ')
		              .replace(/    /g,' ')
		              .replace(/   /g,' ')
		              .replace(/  /g,' ')
		              .replace(/ {/g,'{')
		              .replace(/query /g,'\rquery ')
		              .replace(/mutation /g,'\rmutation ')
		              .replace(/subscription /g,'\rsubscription ')
		              .replace(/fragment /g,'\rfragment ')
	}
	
	
})