(function(get_struct_client){ return get_struct_client() })
(function(){
    return function export_struct_client(struct){
	    
        const ElementMix = Base => class extends Base{
            get Struct(){ return get_struct(this) }
    		get struct(){ return struct.get(this) }
	        get client(){ return get_client(this) }
	        get(name,input){
	        	let actions = this.struct.actions
	        	let action = actions[name]
	        	return this.client.request(action,input).then(response=>response[name])
	        }
        }
        
        //load
        return load_client_interface()
        
        //shared actions
	    function get_client(element){ return struct.client(element.struct) }
	    function get_struct(element){
	    	if('typename' in element) return struct.type(element.typename,element.struct.index,element.typemix)
	    	return null
	    }
	    
		function load_client_interface(){
			if('Interface' in struct) return ElementMix
			else struct.load.interface().then(_=>struct.Element=ElementMix)
			return null
		}
    }
})