
const fxy = require('fxy')
const Server = require('./Server')




module.exports = get_app

function get_app(directory){
	let app_root =  directory || process.cwd()
	let app_json = fxy.join(app_root,'app.json')
	return new Promise((success,error)=>{
		if(fxy.exists(app_json)) return run_app(require(app_json),success)
		return create_app(app_root,app_json).then(app=>{
			return run_app(app,success)
		}).catch(error)
	})
}

function run_app(app,success){
	console.log('running app')
	app = get_directories(app)
	return Server.listen(app).then(success)
}

function get_directories(app){
	app.graph.structs = fxy.join(app.root,app.graph.structs)
	
	return app
}

function create_app(app_root,app_json){
	let app_example = require('./app.example.json')
	app_example.root = app_root
	
	return fxy.json.write(app_json,app_example).then(()=>{
		console.log('created app.json')
		console.log('file: '+app_json)
		console.log(app_example)
		return app_example
	})
}



