const DateType = require('../Date')

const Date = new DateType({
	formats:['YYYY-MM-DD','M/D/YYYY'],
	name:'Date',
	structure:'DATEONLY'
})

module.exports = Date.graph_type