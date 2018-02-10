const Struct = require('../../../Struct')
const date = require('../../../Struct/Date')

module.exports = Struct.scalar('Date','any-Date - Example: 01/22/1922',{
	get:get_value,
	literal:get_value,
	value:get_value
})

//shared actions
function get_value(value){
	const date_time = date(value).moment
	return date_time.format('M/D/YYYY')
}