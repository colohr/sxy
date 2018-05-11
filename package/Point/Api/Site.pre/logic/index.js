window.fxy.exports('Points',Points=>{
	Points.pointer = function get_pointer(endpoint,signals,...x){
		const get_headers = x.filter(i=>typeof i === 'function')[0]
		const socket = x.filter(i=>i!==get_headers)[0]
		return new Points.Pointer(endpoint,signals,get_headers,socket)
	}
	Points.index = function load_points(index_file,get_headers){
		return http.get(index_file).then(x=>x.data).then(index=>{
			let items = index.items
			let points = {}
			for(let name in items){
				let point = items[name]
				let actions = 'actions' in point ? point.actions.content:null
				points[name] = new Points.Pointer(point.endpoint,actions,get_headers)
			}
			return new Proxy({index,points},{
				get(o,name){
					if(name in o.points) return o.points[name].api
					else if(name in o.index) return o.index[name]
					else if(name in o) return o[name]
					return null
				}
			})
		})
	}
})