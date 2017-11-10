
const DateType = require('../Date')

const DateTime = new DateType({
	formats:['YYYY-MM-DD HH:mm:ss.SSS Z','MM/DD/YYYY hh:mm:ssA'],
	name:'DateTime',
	structure:'DATE',
	description:`Example: 01/22/1922 09:30:01AM`
})

module.exports = DateTime.graph_type