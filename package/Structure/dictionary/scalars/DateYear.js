const Struct = require('../../../Struct')
const date = require('../../../Struct/Date')

//exports
module.exports = Struct.scalar('DateYear','any-Date Year',{
	get:get_value,
	literal:get_value,
	value:get_value
})

//shared actions
function get_value(value){ return date(value).year }