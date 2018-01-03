//const { DateTime, Duration, Interval } = require('luxon')

//exports
module.exports = unix_date

//shared actions
function unix_date(timestamp){
	const x = 1000
	return {
		unix:timestamp,
		get date(){ return new Date(this.timestamp) },
		get timestamp(){ return this.unix * x },
		get time(){ return this.date.toLocaleTimeString() },
		get now(){ return Date.now() / x  }
	}
}