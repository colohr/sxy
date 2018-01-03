window.fxy.exports('Points',(Points,fxy)=>{
	class Signal{
		constructor(content,name){
			if(!fxy.is.text(content)) throw new Error('Actions content value must be a text value.')
			this.name = name
			this.data = Points.utility.signal_data(content)
			this.get=(name)=>this.data[name]
			this.has=(name)=>name in this.data
			this.set=(name,data)=>this.data[name]=data
		}
		
	}
	
	//exports
	Points.Signal = Signal
})