const fxy = require('fxy')
const info = require('./info').type.components

class WebComponent extends Map{
	constructor(name,folder) {
		super()
		this.name = name
		this.folder = folder
		this.path = fxy.join(this.folder, info.folder)
		this.statics = get_statics(this)
	}
	get controller(){ return get_controller(this.folder) }
	template(filename){ return get_template(this.folder,filename) }
}

//shared actions
module.exports = get_component

//shared actions
function get_component(name,folder){
	let path = fxy.join(folder,info.folder)
	if(fxy.exists(path)) return new WebComponent(name,folder)
	return null
}

function get_controller(folder){
	let file = fxy.join(folder,info.folder,info.controller_file)
	if(fxy.exists(file)) return require(file)
	return null
}

function get_statics(web_component){
	let components = fxy.join(web_component.path,info.components)
	let controller = fxy.join(web_component.path,info.controller_file)
	let has_components = fxy.exists(components)
	let has_controller = fxy.exists(controller)
	
	let statics = {}
	if(!has_controller && !has_components) statics.folder = web_component.path
	else if(has_components) statics.folder = components
	else statics.folder = fxy.join(web_component.path,info.component)
	return statics
}

function get_template(folder,filename){
	let file = fxy.join(folder,info.folder,filename)
	if(fxy.exists(file)){
		return {
			template:fxy.readFileSync(file,'utf8'),
			file:filename,
			path:fxy.join(folder,filename),
			render(data){ return require('wxy').template.get(this.template,data) }
		}
	}
	return null
}