const auth = require('basic-auth');


module.exports = get_router

function get_router(app_admin){
	const admin = require('./admins')(app_admin)
	return (req,res,next)=>{
		if(matches(req,app_admin)){
			let user = auth(req)
			if(admin(user)) return next();
			res.statusCode = 401
			res.setHeader('WWW-Authenticate', 'Basic realm="graph_ui"')
			return res.end('Access denied')
		}
		return next();
	}
}

function matches(req,app_admin){
	let path = app_admin && app_admin.path ? app_admin.path:null
	if(!path) return false
	return req && req.path ? req.path.includes(path):false
}