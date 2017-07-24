window.fxy.exports('type',(type,fxy)=>{
	
	const frame = Symbol('type iframe')
	
	type.Frame = Base => class extends Base{
		get frame(){ return get_frame_element(this) }
	}
	
	function get_frame_element(element) {
		if(frame in element) return element[frame]
		let type_frame = document.createElement('type-frame')
		element[frame] = type_frame
		element[frame].url = element.api.type.docs
		get_frame_container(element,element.frame_container).appendChild(type_frame)
		return element[frame]
	}
	
	function get_frame_container(element,container){
		let root = null
		if(fxy.is.element(container)) {
			if('shadowRoot' in container) root = container.shadowRoot
			else root = container
		}
		else root = element.shadowRoot
		return root
	}

	
})