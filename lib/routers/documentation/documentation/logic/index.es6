window.fxy.exports('struct',(struct,fxy)=>{
	
	const ToolMix = Base => class extends Base{
		get reader(){ return fxy.require('struct/documentation').reader }
		get html(){ return fxy.require('struct/documentation').html }
	}
	
	//exports
	struct.documentation = {
		Tool:ToolMix
	}
	
})