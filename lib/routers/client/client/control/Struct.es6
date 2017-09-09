window.fxy.exports('struct',(struct,fxy)=>{
	
	
	class Struct extends Map{
		constructor(){
			super()
		}
	}
	//exports
	struct.Struct = Struct
	struct.type = get_type
	//shared actions
	function load(type){
		let index = type.constructor.index
		return struct.load.type(type,index).then(data=>{
			if(data && !('fields' in type.constructor)){
				type.constructor.fields = {}
				let fields = data.fields
				for(let field of fields) type.constructor.fields[field.name] = get_item(field)
			}
			return type.constructor
			
		}).catch(error=>console.error(error))
		//shared actions
		function get_item(field){
			let type = field.type
			let typename = type.name === null ? type.ofType.name:type.name
			let Type = get_type(typename,index)
			if(type.ofType) return [Type]
			return Type
		}
	}
	
	function get_type(typename,index,typemix){
		if(typename in struct.Types) return struct.Types[typename]
		let Mix = fxy.is.function(typemix) ? typemix:(x)=>{return x}
		return struct.Types[typename] = window.eval(`((Struct,Mix,Index)=>{ return class ${typename} extends Mix(Struct){ static get index(){ return Index } } })`)(struct.Struct,Mix,index)
	}
	
})