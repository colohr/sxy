const fxy = require('fxy')

module.exports = {
	get structs(){ return require('../Structs/index') },
	listen({ admin, firebase, graph, host, path, port, root, statics }){
		const server = require('./server')(statics,root,admin)
		
		return new Promise((resolve)=>{
			server.use(this.structs.load(graph))
			return server.listen( port, () => {
				let hostname = host.includes('localhost') ? `${host}:${port}${path}`: fxy.join(host,path)
				let urls = [ hostname ]
				if(firebase) return initialize_firebase(root,firebase).then(()=>{ return resolve(urls.join('\n')) })
				return resolve(urls.join('\n'))
			})
		})
	}
}


function initialize_firebase(app_root,firebase_info){
	let certificate_path = fxy.join(app_root,firebase_info.account)
	const admin = require('firebase-admin')
	return new Promise((success,error)=>{
		if(fxy.exists(certificate_path)){
			let service_account = require(certificate_path);
			admin.initializeApp({
				credential: admin.credential.cert(service_account),
				databaseURL: firebase_info.url
			})
			console.log(firebase_info.url,' - firebase admin account ready')
			return success()
		}
		else error(new Error(`firebase certificate account json not found app.firebase object`))
		
	})
	
}