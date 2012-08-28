jQuery.topics = {};
jQuery.Topic = function( id ) {
	var callbacks,
		method,
		topic = id && jQuery.topics[ id ];
	if ( !topic ) {
		callbacks = jQuery.Callbacks();
		topic = {
			publish: callbacks.fire,
			subscribe: callbacks.add,
			unsubscribe: callbacks.remove
		};
		if ( id ) {
			jQuery.topics[ id ] = topic;
		}
	}
	return topic;
};