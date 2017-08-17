window.fxy.exports('struct',(struct,fxy)=>{
	if(!struct.library){
		let library = {}
		library.folder = window.kit.has('struct') ? window.kit.get('struct'):'/struct/'
		library.client = fxy.file.join(library.folder,'client')
		struct.library = library
	}
})