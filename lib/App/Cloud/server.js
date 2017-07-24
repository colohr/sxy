const fxy = require('fxy')
const express = require('express')
const compression = require('compression')

module.exports = (static_folders,root_folder,admins)=>{
	const app = express()
	app.use(compression())
	if(admins) app.use(admins.router)
	get_static_folders(static_folders,root_folder).forEach( value => app.use(...value) )
	return app
}

function get_static_folders(folders,root_folder){
	const root = root_folder || '/'
	if(fxy.is.data(folders)){
		return Object.keys(folders).map(name=>{
			let path = folders[name]
			let routes = fxy.is.text(path)
			let value
			if(routes) {
				path = fxy.join(root, path)
				value = [ name, express.static(path) ]
			}
			else {
				path = fxy.join(root, name)
				value = [ express.static(path) ]
			}
			return value
		})
	}
	return []
}