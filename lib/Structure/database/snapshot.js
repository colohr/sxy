
module.exports = function get_value_snapshot(ss){
	return new Proxy(ss,{
		get(o,k){
			
			switch(k){
				case 'count':
				case 'length':
					return o.numChildren()
					break;
				case 'value':
				case 'data':
					return o.val()
					break;
				case 'empty':
					let e = o.exists()
					if(e === true){
						return o.numChildren() === 0
					}
					return e !== true;
					break;
				case 'array':
					let v = o.val()
					if(typeof v === 'object' && v !== null){
						return Object.keys(v).map(key=>{return v[key]});
					}
					return []
					break;
				case 'isNull':
					return o.val() === null;
					break;
				
			}
			
			if(k in o) return o[k];
			return;
		}
	})
}