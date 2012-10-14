(function(JE) {
	var JE = JE || {};
	
	JE.util = {
		extend: function( cls, base ) {
			function F(){ };
		 	F.prototype = base.prototype;

		    cls.prototype = new F();
		    cls.prototype.constructor = cls;
		    cls.superclass = base.prototype;
		}
	};
	
	window.JE = JE;
}(window.JE));