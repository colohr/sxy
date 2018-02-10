const Struct = require('../../../Struct')
const date = require('../../../Struct/Date')

//exports
module.exports = Struct.scalar('DateTime','any-Date & Time - Example: 01/22/1922 09:30:01AM',{
	get:get_value,
	literal:get_value,
	value:get_value
})

//shared actions
function get_value(value){
	const date_time = date(value).moment
	return date_time.format('MM/DD/YYYY hh:mm:ssA')
}