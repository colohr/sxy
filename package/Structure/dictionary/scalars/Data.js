const fxy = require('fxy')

//exports
module.exports = require('../../../Struct').scalar('Data','any-Structured Data',{
	get:get_value,
	literal:get_value,
	value:get_value
})

//shared actions
function get_value(value){
	if(fxy.is.text(value) && fxy.is.json(value)) {
		let data = JSON.parse(value)
		if(fxy.is.data(data)) return data
	}
	else if(fxy.is.data(value)) return value
	return null
}