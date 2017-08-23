const wxy = require('wxy')

const Cloud = wxy.Cloud
class SxyApp extends Cloud{
	static get create(){ return create_app }
	static get get(){ return get_app_and_start }
	static get structs(){ return require('./structs') }
	constructor(value){
		super(value)
		let options = this.get('sxy')
		this.graphs =  require('./load')(options)
		if('routers' in options){
			let routers = require('../routers')
			let structs_index = this.graphs.structs_index
			for(let name in options.routers){
				if(name in routers){
					let router = routers[name](options.routers,options,structs_index)
					this.server.use(options.routers.path || '/struct',router)
				}
			}
		}
	}
	start(){
		this.server.use(this.graphs)
		return new Promise((success,error)=>{
			return super.start().then(()=>success(this)).catch(error)
		})
	}
	
}

//exports
module.exports = SxyApp

//shared actions
function create_app(value){ return new SxyApp(value) }

function get_app_and_start(value){
	console.log('\n•••••••••sxy••••••••••••')
	let app = create_app(value)
	console.log('\tStarting "sxy" app','\n------------')
	return app.start()
}


