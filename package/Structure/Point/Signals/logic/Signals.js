window.fxy.exports('Points',Points=>{
	//exports
	Points.create = create_signals
	
	//shared actions
	function create_signals(pointer,content){
		const Signals = new Points.Signal(content,pointer.struct.name)
		return new Proxy(Signals,{
			get(o,name){
				if(name in o.data){
					const query = o.data[name]
					return signal(pointer,query)
				}
				return null
			}
		})
	}
	
	function signal(pointer,query){
		return (variables,context)=>{
			return pointer.container(query,variables,context).then(result=>result.data)
		}
	}
})