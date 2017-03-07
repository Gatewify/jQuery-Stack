/* ******************************************* *
 * jQuery Stack
 * Developed by Splash Frame
 * Free To use
 * 
 * This is for stacking ajax
 * calls
 * 
 * as a FIFO
 * ******************************************* */
(function( global, factory ) {

	if ( typeof module === "object" && typeof module.exports === "object" ) {
		// For CommonJS and CommonJS-like environments where a proper window is present,
		// execute the factory and get jQuery
		// For environments that do not inherently posses a window with a document
		// (such as Node.js), expose a jQuery-making factory as module.exports
		// This accentuates the need for the creation of a real window
		// e.g. var Stack = require("stack")(window);
		// See ticket #14549 for more info
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "Stack requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
}(typeof window !== "undefined" ? window : this, function( window, noGlobal ) {
	
	var Stack=function(){
		if(((typeof window.jQuery)=='undefined') && ((typeof jQuery)=='undefined'))
		{
			throw new Error('This plugin needs jQuery!');
		}
		return new Stack.fn.init();
	};
	var version = '1.0.1';
	Stack.fn = Stack.prototype = {
		v:'1.0.1',
		constructor:Stack,
		debug:false,
		timer:50,
		stack:[],
		setTimer:function(time){
			Stack.fn.timer=time;
		},
		setCustomDebugTimer:function(time){
			Stack.fn.cdtimer=time;
		},
		getTimer:function(time){
			return Stack.fn.timer;
		},
		getDebug:function(){
			return Stack.fn.debug;
		},
		enableDebug:function(){
			Stack.fn.debug=true;
		},
		disableDebug:function(){
			Stack.fn.debug=false;
		},
		init:function(){
			Stack.fn.start();
		},
		stop:function(){
			console.log(Stack.fn.queure);
			if((typeof Stack.fn.queure)!='undefined')
			{
				if(Stack.fn.running==true){
					Stack.fn.running=false;
				}
				clearInterval(Stack.fn.queure);
			}
		},
		start:function(){
			if(Stack.fn.running==false){
				if(Stack.fn.getDebug()==true){
					console.log('Debug Active');
				}
				else{
					console.log('Debug inactive');
				}
				if(Stack.fn.getDebug()==true)
				{
					if((typeof Stack.fn.cdtimer)=='undefined'){
						Stack.fn.setTimer(3000);
					}
					else{
						Stack.fn.setTimer(Stack.fn.cdtimer);
					}
				}
				console.log('Request Timer:'+Stack.fn.getTimer());
				Stack.fn.queure=setInterval(function(){
					if(Stack.fn.running==false){
						Stack.fn.running=true;
					}
					if(Stack.fn.getDebug()==true)
						console.log(Stack.fn);
					if(Stack.fn.stack.length!=0)
					{
						var obj=Stack.fn.stack.shift();
						if(Stack.fn.getDebug()==true)
							console.log(obj);
					}
					if(Stack.fn.getDebug()==true)
					{
						console.log('Ajax Status:');
						console.log(Stack.fn.ajaxCheck());
						console.log('++++++++++++++++++++');
						console.log('Current Request?:');
						console.log(Stack.fn.getStatus());
						console.log('++++++++++++++++++++');
					}
			    	if(Stack.fn.ajaxCheck()!=true){
			    		if(Stack.fn.getMStatus()==false){
					    	try{
					    		if(Stack.fn.getDebug()==true){
					    			console.log('checking for data to execute...');
					    		}
					    		if((typeof (obj))!='undefined'){
					    			if(Stack.fn.getDebug()==true){
						    			console.log('Data Found!');
						    		}
						    		Stack.fn.stop();
						    		Stack.fn.toggleStatus();
						    		if(Stack.fn.getDebug()==true){
						    			console.log('trying to execute ajax with:');
						    			console.log(obj);
						    		}
						    		jQuery.ajax(obj);
						    		Stack.fn.toggleStatus();
									Stack.fn.start();
					    		}
					    		else{
					    			if(Stack.fn.getDebug()==true){
						    			console.log('No data Found to execute, proceeding to next avaliable Request');
						    		}
					    		}
							} catch(e){
								//else print the error message output
								console.log(e);
								Stack.fn.start();
							}
			    		}
			    	}
				},Stack.fn.getTimer());
			}
		},
		ajaxCheck:function(){
			if(jQuery.active>0)
			{return true;}
			return false;
		},
		getStatus:function(){
			return Stack.fn.status;
		},
		status:'idle',
		statusActive:function(){
			Stack.fn.status='active';
		},
		statusIdle:function(){
			Stack.fn.status='idle';
		},
		toggleStatus:function(){
			if(Stack.fn.status=='idle'){
				Stack.fn.status='active';
			}
			else{
				Stack.fn.status='idle';
			}
		},
		getMStatus:function(){
			if(Stack.fn.status=='idle'){
				return false;
			}
			return true;
		},
		add:function(obj){
			if((typeof obj)!=='object')
			{Stack.fn.error.data_error();}
			else{
				var temp=obj;
				if(((typeof temp.url) ==='string') && (((typeof temp.data) ==='object') || ((typeof temp.data) ==='array')) && ((typeof temp.success) ==='function')){
			    	var method='POST';
			    	if(((typeof temp.method) ==='string'))
			    	{
			    		method=temp.method;
			    	}
			    	var t={
			    		url:temp.url,
			    		data:temp.data,
			    		method:method,
			    		success:temp.success
			    	};
			    	if((typeof temp.error)==='function'){
			    		t.error=temp.error;
			    	}
			    	if((typeof temp.complete)==='function'){
			    		t.complete=temp.complete;
			    	}
			    	if((typeof temp.beforeSend)==='function'){
			    		t.beforeSend = temp.beforeSend;
			    	}
			    	if((typeof temp.dataFilter)==='function'){
			    		t.dataFilter=temp.dataFilter;
			    	}
					Stack.fn.stack.push(t);
					if(Stack.fn.getDebug()==true){
						console.log('addered:');
						console.log(t);
					}
				}
				else
				{Stack.fn.error.data_error();}
			}
		},
		/*error defenition*/
		error:{
			data_error:function(){
			console.log('All Fundamental data needs to be provided! like the object bellow:');
			console.log({
					url:'string',
					data:{
						'data1':'value',
						'data2':'value',
						'data3':'value',
						'data4':'value',
					},
					success:function(result){
						
					}
				});
			}
		},
		running:false,
		isRunning:function(){
			return Stack.fn.running;
		}
	};
	init = Stack.fn.init = function(){
		Stack.fn.start();
		return Stack.fn;
	};
	
	var strundefined = typeof undefined;
	// Register as a named AMD module, since Stack can be concatenated with other
	// files that may use define, but not via a proper concatenation script that
	// understands anonymous AMD modules. A named AMD is safest and most robust
	// way to register. Lowercase jquery is used because AMD module names are
	// derived from file names, and jQuery is normally delivered in a lowercase
	// file name. Do this after creating the global so that if an AMD module wants
	// to call noConflict to hide this version of Stack, it will work.
	
	// Note that for maximum portability, libraries that are not Stack should
	// declare themselves as anonymous modules, and avoid setting a global if an
	// AMD loader is present. Stack is a special case. For more information, see
	// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon
	
	if ( typeof define === "function" && define.amd ) {
		define( "Stack", [], function() {
			return Stack;
		});
	}
	// Expose Stack and $ identifiers, even in
	// AMD (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
	// and CommonJS for browser emulators (#13566)
	if ( typeof noGlobal === strundefined ) {
		window.Stack = window.S = Stack();
	}
	return Stack;
}));
