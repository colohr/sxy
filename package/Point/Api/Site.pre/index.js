//export
module.exports = get_logic

//shared actions
function get_logic(){
	return new Promise((success,error)=>{
		return process.nextTick(()=>{
			try{ return success(read_logic()) }
			catch(e){ return error(e) }
		})
	})
}

function read_logic(){
	const fxy = require('fxy')
	const logic = {
		files:[
			'logic/utility.js',
			'logic/Signal.js',
			'logic/Pointer.js',
			'logic/index.js'
		]
	}
	const compress = text=>(require('wxy').Mini.convert.code(text,{compress:false,mangle:false})).trim()
	const items = logic.files.map(file=>fxy.read_item(fxy.join(__dirname,file)))
	const PointerLogic = JSON.stringify(items.map(get_logic_item))
	return compress(`
		(function create_pointer(){
			return ((http)=>{
				return new Promise(function(success,error){
					const Pointer = {}
					const PointerLogic = ${PointerLogic}
					//load
					return next()
					//shared actions
					function next(){
						for(let logic of PointerLogic){
							PointerLogic.splice(0,1)
							try{ return Promise.resolve((eval(logic))(get_window())).then(()=>next()).catch(error) }
							catch(e){ return error(e) }
						}
						return success(Pointer)
					}
					function get_window(){
						return {
							http,
							window:{ fxy:{ exports(name,callback){ return callback(Pointer) } } }
						}
					}
				})
			})
		})()`)
	
	function get_logic_item(item){
		return compress(`
			(()=>{
				return function logic_export({window,http}){ ${item.content} }
			})()
		`)
	}
}




