const fxy = require('fxy')
const is = {root:is_root}
const of = {structs:of_structs}

//exports
module.exports = folder_name
module.exports.clean = clean
module.exports.is = is
module.exports.of = of
module.exports.shared = shared_folders

//shared actions
function clean(folder){
	return folder.split('/')
	             .filter(part=>part.length>0)
	             .join('/')
}

function folder_name(folder){ return folder.replace(fxy.basename(folder),'') }

function is_root(folder){
	const parts = fxy.join(folder,'../').split('/').filter(part=>part.length > 0)
	return parts[parts.length - 1] === 'structs'
}

function of_structs(folder,count){
	if(!fxy.is.number(count)) count = 0
	if(count >= 20) return null
	const location = fxy.join(folder,'../')
	return is_root(folder) ? location:of_structs(location,count++)
}

function shared_folders(folder){
	const structure_folder = of_structs(folder)
	return (...names)=>names.map(name=>fxy.join(structure_folder,name))
}