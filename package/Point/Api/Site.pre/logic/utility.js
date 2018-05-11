window.fxy.exports('Points',Points=>{
	const Types = ['query','mutation','subscription','fragment']
	class Items extends Map{
		constructor(items){
			const fragments = items.filter(item=>item[1].type === 'fragment')
			super(items.filter(item=>item.type !== 'fragment'))
			this.fragments = new Map(fragments)
			this.fragment_names = fragments.map(fragment=>fragment[0].split(' on ')[0].trim())
		}
		get_fragments(item,set){
			let fragments = []
			let names = Array.from(this.fragments.keys())
			for(let fragment of names){
				if(!set.has(fragment)){
					let match = `...${fragment}`
					if(item.line.indexOf(match) >= 0) {
						set.add(fragment)
						fragments.push(this.fragments.get(fragment).value(set))
					}
				}
			}
			return fragments
		}
	}
	
	//exports
	Points.utility = {signal_data:get_content}
	
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
				if(typeof name === 'symbol' && name in o) value = o[name]
				else value = o.has(name) ? o.get(name).value(new Set()):null
				if(!value){
					if(name in o && typeof o[name] === 'function') value = o[name].bind(o)
					else if(name === 'fragments') return o.fragments
				}
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
				value(set){ return get_value(this,set) }
			}]
			
			//shared actions
			function get_value(item,set){
				if(item.has_fragments){
					let value = [item.line]
					let fragments = items.get_fragments(item,set)
					value = value.concat(fragments)
					return Array.from(new Set(value)).join('\n')
				}
				return item.line
			}
			
		}
	}
	
	function set_data(o,name,data){
		if(typeof name === 'string'){
			if(typeof data === 'string') data = {value:data}
			if(typeof data === 'object' && data !== null) o.set(name,data)
		}
		return true
	}
	
	function get_content_item_name(line){
		let name = line
		for(let type of Types) name = name.replace(type,'')
		if(name.includes('@')){
			const directive = name.substring(name.lastIndexOf("@")+1,name.lastIndexOf(")"))
			name = name.replace(`@${directive})`,'')
		}
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
					  .replace(/ @/g,'@')
					  .replace(/ \) }/g,')}')
		              .replace(/query /g,'\rquery ')
		              .replace(/mutation /g,'\rmutation ')
		              .replace(/subscription /g,'\rsubscription ')
		              .replace(/fragment /g,'\rfragment ')
	}
})