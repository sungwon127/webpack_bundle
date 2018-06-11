var m4 = m4 || {};
m4.hasJqueryObject = function($elem){ return $elem.length > 0; };
m4.isMobile = window.matchMedia("screen and (max-width:767px)");

// Init Check Console
// m4.console.log(String);
// m4.console.error(String);
// m4.console.reset(String);
m4.console = new function(){
	this.log = function(name){ console.log("pubLog : " + name + " is added"); };
	this.error = function(name){ console.log("pubError : " + name + " is not init"); };
	this.reset = function(name){ console.log("Reset : "+ name +" Reset Complete"); };
};

// Module Manager
// add - m4.moduleManager.add("name", func);
// find - m4.moduleManager.find("name");
// all - m4.moduleManager.all();
// reset - m4.moduleManager.reset();
m4.moduleManager = new function(){
	var _that = this;
	_that.hash = {};
	_that.arr = [];
	_that.add = function(name, func){
		var _func = new func();
		m4.console.log(name);
		return _that.hash[name] = _func, _that.arr.push({ name: name, func: _func}), _that;
	};

	_that.find = function(name){
		return _that.hash[name];
	};

	_that.all = function(){
		return _that.arr;
	};

	_that.reset = function(){
		for(var i = 0; i < _that.arr.length; i++){
			if(_that.arr[i].func.isInit){
				if(typeof _that.arr[i].func.reset === "function"){
					_that.arr[i].func.reset();
					m4.console.reset(_that.arr[i].name);
				}
			} else{
				m4.console.error(_that.arr[i].name);
			}
		}
	};
};

m4.mouseWheel = function(){
	return{
		init: function(){
			var total = m4.$body.find(".scrollItem").length;
			var index = 0;
			this.isWheel = false;
			m4.moduleManager.find("m4.animation").reset();
			m4.$window.on("mousewheel", function(e) {
				if(!m4.UI.find("m4.mouseWheel").isWheel){
					m4.UI.find("m4.mouseWheel").isWheel = true;
					var d = e.deltaY;
					var l = total;
					if(d < 0){
						index++;
						if(index >= l){
							index = l - 1;
							return m4.UI.find("m4.mouseWheel").isWheel = false;
						}
						m4.moduleManager.find("m4.animation").init(true, index);
					} else{
						index--;
						if(index < 0){
							index = 0;
							return m4.UI.find("m4.mouseWheel").isWheel = false;
						}
						m4.moduleManager.find("m4.animation").init(false, index);
					}
					
				}
			});
		},
		destroy: function(){
			m4.UI.find("m4.mouseWheel").isWheel = false;
			m4.$window.off("mousewheel");
		}
		
	}
};

m4.animation = function(){
	return{
		init: function(direction, index){
			var speed = .8;
			var val;
			if(direction) val = -100;
			else val = 100;
			m4.UI.find("m4.animation").$scrollItem.removeClass("current");
			m4.UI.find("m4.animation").$scrollItem.eq(index).addClass("current");
			
			m4.UI.find("m4.animation").$scrollItem.each(function(idx){
				var top = parseInt($(this).css("top")) / m4.$window.height() * 100;
				TweenMax.to($(this), speed, { top:top + val +"%", ease:Power1.easeOut });
			});
			TweenMax.delayedCall(speed, function(){ 
				m4.UI.find("m4.animation").$scrollItem.find(".iconList > li").removeClass("on");
				m4.UI.find("m4.animation").$scrollItem.eq(index).find(".iconList > li").each(function(idx){
					var _that = $(this);
					TweenMax.delayedCall(.1*idx, function(){
						_that.addClass("on");
					});
				});

				m4.UI.find("m4.mouseWheel").isWheel = false; 
			});
		},
		reset: function(){
			var that = this;
			that.$scrollWrap = m4.$body.find(".scrollWrap");
			that.$scrollItem = that.$scrollWrap.find(".scrollItem");
			that.$scrollItem.eq(0).addClass("current");
			TweenMax.delayedCall(.8, function(){
				that.$scrollItem.eq(0).find(".iconList > li").each(function(idx){
					var _that = $(this);
					TweenMax.delayedCall(.1*idx, function(){
						_that.addClass("on");
					});
				});
			});
			
			this.$scrollItem.each(function(idx){
				$(this).css({ "top": idx * 100+"%" });
			});
		}
	}
}

// UI
// find = m4.UI.find(String);
// all = m4.UI.all();
// reset = m4.UI.reset();
// init = m4.UI.startup();
m4.UI = new function(){
	this.find = function(name){
		return m4.moduleManager.find(name);
	};

	this.all = function(){
		return m4.moduleManager.all();
	};

	this.reset = function(){
		return m4.moduleManager.reset();
	};

	this.addModule = function(){
		if( m4.hasJqueryObject( m4.$window ) && m4.moduleManager.find("m4.mouseWheel") === undefined ) m4.moduleManager.add("m4.mouseWheel", m4.mouseWheel);
		if( m4.hasJqueryObject( m4.$body.find(".scrollWrap") ) && m4.moduleManager.find("m4.animation") === undefined ) m4.moduleManager.add("m4.animation", m4.animation);
	};

	this.init = function(){
		if(!m4.isMobile.matches){
			// PC
			console.log("PC");
			if( m4.hasJqueryObject( m4.$window ) && m4.moduleManager.find("m4.mouseWheel").isInit === undefined ) m4.moduleManager.find("m4.mouseWheel").init();
		} else{
			// Mobile
			console.log("Mobile");
			
		}
		
	};

	this.startup = function(){
		m4.UI.addModule();
		m4.UI.init();
	};
};

$(function(){
	m4.$window = $(window);
	m4.$body = $("body");
	m4.UI.startup();
});