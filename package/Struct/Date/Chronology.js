const chronology = require('chrono-node')
const moment = require('moment-timezone')
const fxy = require('fxy')
const information = Symbol('chronology information')
const input = Symbol('input values')

class Chronology{
	static get chronology(){ return chronology }
	static get formats(){ return require('./formats') }
	static get luxon(){ return require('luxon') }
	static get moment(){ return moment }
	static get timezone(){ return moment.tz.guess() }
	constructor(value){ this[input] = value }
	get date(){ return this.info.date() }
	get day(){ return this.info.get('day') }
	get format(){ return this.constructor.formats.action(this.moment) }
	get hour(){ return this.info.get('hour') }
	get info(){ return get_info(this) }
	get millisecond(){ return this.info.get('millisecond') }
	get minute(){ return this.info.get('minute') }
	get month(){ return this.info.get('month') }
	get moment(){ return moment(this.date) }
	get range(){ return get_range(this) }
	get second(){ return this.info.get('second') }
	get text(){ return get_text(this) }
	get year(){ return this.info.get('year') }
}

//exports
module.exports = (...x)=>new Chronology(...x)
module.exports.Chronology = Chronology

//shared actions
function get_info(date){
	if(information in date) return date[information]
	return date[information] = get_value(date)[0].start
}

function get_range(date){
	const value = get_value(date)
	const start = value.start
	const end = value.end || value.start
	return {
		start,
		end,
		get days(){
			const from = moment(this.start.date())
			const to = moment(this.end.date())
			return from.diff(to,'days')
		}
	}
}

function get_text(date){
	let value = date[input]
	if(fxy.is.text(value)) return value
	else if(fxy.is.date(value)) return `${value}`
	return `${new Date()}`
}

function get_value(date){
	const info = chronology.parse(date.text)
	return !info.length ? info : chronology.parse(`${new Date()}`)
}