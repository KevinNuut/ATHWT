Ajax.TXMRequest = function(action, userOptions)
{
	options = {
		'parameters': (Object.isUndefined(userOptions.parameters) == false ? userOptions.parameters : ''),
		'onCreate':   (Object.isUndefined(userOptions.onCreate)   == false ? userOptions.onCreate   : ''),
		'onComplete': (Object.isUndefined(userOptions.onComplete) == false ? userOptions.onComplete : ''),
		'onSuccess':  (Object.isUndefined(userOptions.onSuccess)  == false ? userOptions.onSuccess  : alert),
		'onFailure':  (Object.isUndefined(userOptions.onFailure)  == false ? userOptions.onFailure  : alert)
	};	
	
	// Create the AJAX request            
    new Ajax.Request(action, 
    { 
        method: 'post',            
        parameters: options.parameters,
		onCreate: function()
		{
			Ajax.TXMFormatReturn(Ajax.activeRequestCount + 1, options.onCreate);
		},
		onComplete: function()
		{
			Ajax.TXMFormatReturn(Ajax.activeRequestCount - 1, options.onComplete);
		},
		onSuccess: function(response) 
        {
			var JSON = response.headerJSON;
			if (JSON && typeof(JSON['success']) != 'undefined') {
				if (JSON['success'] == true) {
					Ajax.TXMFormatReturn(response.responseText, options.onSuccess);
				} else {
					Ajax.TXMFormatReturn(response.responseText, options.onFailure);
				};
            } else {
				Ajax.TXMFormatReturn('Invalid Page Response.\nPlease try again...\n', options.onFailure);
            };
        },            
        onFailure: function()
        { 
			Ajax.TXMFormatReturn('No Response From Server.\nPlease try again...', options.onFailure);
        }    
    });
};

Ajax.TXMFormatReturn = function(response, object) {
	if (Object.isFunction(object) == true) {
		object(response);
	} else if(Object.isElement(object) == true) {
		object.update(response);	
	};	
};

Ajax.Responders.register(
{
	onCreate: function(e) 
	{		
		$('loading').appear({duration: 0.2});		
	},
	onComplete: function()
	{
		$('loading').fade({duration: 0.2});
	}
});
		