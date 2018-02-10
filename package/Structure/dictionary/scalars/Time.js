const Struct = require('../../../Struct')
const date = require('../../../Struct/Date')

module.exports = Struct.scalar('Time','any-Time - Example: 9:29am',{
	get:get_value,
	literal:get_value,
	value:get_value
})

//shared actions
function get_value(value){
	const date_time = date(value).moment
	return date_time.format('h:mma')
}


