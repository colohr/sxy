
const DateType = require('../Date')

const DateTime = new DateType({
	formats:['YYYY-MM-DD HH:mm:ss.SSS Z','MM/DD/YYYY hh:mm:ssA'],
	name:'DateTime',
	structure:'DATE'
})

module.exports = DateTime.graph_type