(function(get_struct_client){ return get_struct_client() })
(function(){
    return function export_struct_client(struct,fxy){
    	
	    const struct_interface = Symbol('struct_interface')
	    
        const ElementMix = Base => class extends Base{
        	get struct_interface(){
        		if(struct_interface in this) return this[struct_interface]
        		if(this.hasAttribute('endpoint')) return set_interface(this,this.getAttribute('endpoint'))
        		return null
	        }
	        set struct_interface(endpoint){ return set_interface(this,endpoint) }
	        get client(){ return this.struct_interface }
        }
        
        load_client_interface()
        
        //shared actions
		function set_interface(element,endpoint){
        	return element[struct_interface] = new struct.Interface(endpoint)
		}
		function load_client_interface(){
			let folder = fxy.file.join(struct.library.client,'control/Interface.es6')
			window.fxy.port.eval(window.url(folder)).then(Interface=>{
				struct.Interface = Interface
				struct.Element = ElementMix
			})
		}
    }
})