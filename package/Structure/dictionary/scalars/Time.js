const DateType = require('../Date')

const Time = new DateType({
	formats:['HH:mm:SS','h:mma'],
	name:'Time',
	structure:'TIME'
})
Time.pre = function(v){
	if(this.is.text(v)){
		if(v.includes(':')){
			if(v.includes(' ')) return v
			else return this.moment(v,this.formats[0])
		}
	}
	return v
}

//exports
module.exports = Time.graph_type


