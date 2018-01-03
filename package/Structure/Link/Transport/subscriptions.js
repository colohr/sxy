const { PubSub } = require('graphql-subscriptions')

//exports
module.exports = get_subscriptions

//shared actions
function get_subscriptions(transport){
	if('subscriptions' in transport) return transport.subscriptions
	return transport.subscriptions = new PubSub()
}