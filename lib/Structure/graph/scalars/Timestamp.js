const DateType = require('../Date')
const fxy = require('fxy')
const Timestamp = new DateType({
	formats:['YYYY-MM-DD HH:mm:ss','x'],
	name:'Timestamp',
	structure:'NOW',
	kind:'INT'
})

Timestamp.pre = function(v){
	if(fxy.is.text(v)) {
		v = this.moment(v).format('x')
		return fxy.as.number(v)
	}
	return v
}
Timestamp.parse = function(m,v){
	return fxy.as.number(m)
}

module.exports = Timestamp.graph_type


