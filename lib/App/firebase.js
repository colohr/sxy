const fxy = require('fxy')

//exports
module.exports = load_firebase

//shared actions
function load_firebase(folder,info){
	let certificate_path = fxy.join(folder,info.account)
	const admin = require('firebase-admin')
	return new Promise((success,error)=>{
		if(fxy.exists(certificate_path)){
			let service_account = require(certificate_path);
			admin.initializeApp({
				credential: admin.credential.cert(service_account),
				databaseURL: info.url
			})
			console.info(`The firebase admin account is ready for => ${info.url}`)
			console.info('------------')
			return success()
		}
		else error(new Error(`firebase certificate account json not found app.firebase object`))
	})
}