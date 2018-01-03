const fxy = require('fxy')
const window = bundle => ({ fxy:{ exports(name,on_export){ return on_export(bundle,fxy) } } })
module.exports = bundle(__dirname)

//shared actions
function bundle(folder){
	const items = fxy.tree(fxy.join(folder,'logic'),'js').items.only
	const bundle = {get_content}
	for(let item of items) bundle_item(item.content,bundle)
	return bundle
}

function bundle_item(text,bundle){ return eval(`(()=>function item_export(window){ ${text} })() `)(window(bundle)) }

function get_content(name){
	const folder = get_folder()
	if(!folder) return ''
	return content()
	//shared actions
	function content(){
		let items = fxy.tree(folder,'actions.graphql','signal.graphql').items.only
		let content = items.map(item=>item.content)
		return content.join('\n')
	}
	function get_folder(){
		if(fxy.exists(name)) return name
		let struct = require('../../../Utility').get(name)
		if(struct) return struct.folder
		return null
	}
}