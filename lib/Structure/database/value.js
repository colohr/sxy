
module.exports = function get_value_for_save(value){
	if(Array.isArray(value)){
		let o = {}
		value.forEach((item,i)=>{
			o[i] = item;
		})
		return o
	}
	return value;
}