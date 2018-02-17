const Data = require('../Data')
const Get = require('./Get')
const BaseItem = (Item, ...Mixes)=>Mixes.reduce((Base, Mix)=>Mix(Base), Data.Type(`${Item}`))
const GenerateItem = (...X)=>class extends BaseItem(...X){ static get Type(){ return X[0] } }

//exports
module.exports = (location,...x)=>{
	try{
		const item = Get.item(location, ...Get.names(...x))
		return GenerateItem(item, ...Get.mixins(...x))
	}
	catch(e){ invalid_item(e,location,...x) }
}
module.exports.Generate = GenerateItem

//shared actions
function invalid_item(error,...x){
	console.log('•••••••••••••••••••••••••••••')
	console.error('Error: sxy.Point')
	console.error(error)
	console.log('-----------------------------')
	for(const i of x){
		console.log(i)
		console.dir(i,{colors:true,showHidden:true,depth:5})
	}
	console.log('•••••••••••••••••••••••••••••')
}