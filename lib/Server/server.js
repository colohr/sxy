const fxy = require('fxy')
const express = require('express')
const app = express()
const compression = require('compression')

app.use(compression())

module.exports = (static_folders,root_folder,admin)=>{
	const root = root_folder || '/'
	console.log({admin})
	if(admin){
		app.use(require('./admin')(admin))
	}
	get_static_folders(static_folders).forEach( value => app.use(...value) )
	
	return app
	
	function get_static_folders(folders){
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
}
