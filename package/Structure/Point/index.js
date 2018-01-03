const fxy = require('fxy')
const point = Symbol('point')
const Point = require('./Point')

//exports
module.exports.get = get_point

//shared actions
function get_point(struct,pointer){
	if(struct.has(point) && fxy.is.nothing(pointer)) return struct.get(point)
	return set_point(struct,pointer)
}

function set_point(struct,pointer){
	const Pointer = Point(pointer || class basic_pointer{})
	Pointer.prototype.struct = struct
	return struct.set(point,new Pointer()).get(point)
}

