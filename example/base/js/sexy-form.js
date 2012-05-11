/**
 * 基于 Twitter bootstrap 构造表单dom
 * @param  {[type]} host   [description]
 * @param  {[type]} jQuery [description]
 * @return {[type]}        [description]
 */
(function(host , jQuery){
	var util = function() {
		this.isFunction = function (x) {
			if ( ! x ) return false ;
			var rx = /function/, ft = "function";
			switch (typeof x) {
			    case ft: return true;
			    case "object":
			        if ((ft !== typeof x.toString) &&
			            (ft !== typeof x.valueOf))
			            try { return rx.test(x); } catch (x) { return false; }
			        else
			            return Object.prototype.toString.call(x) === "[object Function]";
			        break;
			    default: return false;
			}
		};

		this.isObject = function(x) {
		    if ( Object.prototype.toString.call(x) !== "[object Object]" ){
		    	return false;
		    }
		        
		    var key;
		    for ( key in x ) {
		    	break;
		    }
		    
		    return !key || Object.prototype.hasOwnProperty.call(x, key);
		};

		this.isArray = function(x){
			if(Array.isArray) return Array.isArray(x);
			return Object.prototype.toString.call(x) === "[object Array]";
		};

		this.isString = function(x){
			return Object.prototype.toString.call(x) === "[object String]"; 
		};

		this.isNumeric = function(x){
			if(Object.prototype.toString.call(x) === "[object Number]"){
				return true;
			}
			if(this.isString(x)){
				var regex = /^\-?[0-9]*\.?[0-9]+$/;
				return regex.test(x);
			}
			return false;
		};

		this.isEmail = function(x){
			if(this.isString(x)){
				var regex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,6}$/i;
		        return regex.test(x);
			}	
			return false;
		};

		this.isEmpty = function(x){
			if(false === this.isString(x)) x = x.toString();
			return x === null || this.trim(x) === "" ? true : false;
		 };

		 this.isUndefined = function(x){
		 	return undefined === x ? true : false;
		};

		this.isWhitespace = function(x) {
		 	if(false === this.isString(x)) x = x.toString();
		 	var regex = /^\s*$/;
		    return regex.test(x);
		};

		/**
		 * 首字母大写
		 * @param  {[type]} str [description]
		 * @return {[type]}     [description]
		 */
		this.ucfirst = function(str){
			return String(str).replace(/\b\w+\b/, function(word) {
		       return word.substring(0,1).toUpperCase() + word.substring(1);
		    });
		};

		this.trim = function(x){
			if(false === this.isString(x)) x = x.toString();
			if(String.prototype.trim) return x.trim();

			var trimLeft, trimRight;

		    if (this.isWhitespace("\xA0")) {
		      trimLeft = /^\s+/;
		      trimRight = /\s+$/;
		    } else {
		      // IE doesn't match non-breaking spaces with \s, thanks jQuery.
		      trimLeft = /^[\s\xA0]+/;
		      trimRight = /[\s\xA0]+$/;
		    }
		    return x.replace(trimLeft, "").replace(trimRight, "");
		};



		this.inArray = function(item,array){
			if(false === this.isArray(array)) return false;
			var isIn = false;
			this.each( array , function( v ){
				if( item === v )
				{
					isIn = true;
					return false;
				}
			} );
			return isIn;
		};
		  
		/**
		 * 转换html
		 * @param  {[type]} x [description]
		 * @return {[type]}   [description]
		 */
		this.escapeHTML = function(x){
			var escapeMap = {
			    "&": "&amp;",
			    "<": "&lt;",
			    ">": "&gt;",
			    '"': '&quot;',
			    "'": '&#39;'
			};
			return String(x).replace(/&(?!\w+;)|[<>"']/g, function (s) {
				return escapeMap[s] || s;
			});
		};

		/**
		 * 去除html
		 * @param  {[type]} x [description]
		 * @return {[type]}   [description]
		 */
		this.toText = function(x){
			return String(x).replace(/<[^>].*?>/g,"");
		};


		this.each = function( items , callback ){
			if(false === this.isFunction(callback)) return false;
			if (this.isArray(items)) {
				var count = items.length;
				for(var i=0; i<count; i++)
				{
					var ret = callback( items[i] , i );
					if( false === ret )
					{
						break;
					}
				}
			}
			else if(this.isObject(items)){
				for( var k in items )
				{
					var ret = callback( items[k] , k );
					if( false === ret )
					{
						break;
					}
				}
			}
		};
	}();

	/**
	 * 验证规则
	 */
	var validators = function() {

	    /**
	     * 是否邮箱
	     * @param str
	     */
	    var isEmail = function(str) {
	        if (util.isEmail(str)) {
	            return {
	                'success': true
	            };
	        }
	        return {
	            'success': false,
	            'msg': '邮箱格式错误'
	        };
	    };

	    /**
	     * 是否数字
	     * @param str
	     */
	    var isNumber = function(str) {
	        if (util.isNumeric(str)) {
	            return { 
	                'success': true
	            };
	        }
	        return {
	            'success': false,
	            'msg': '只能为数字'
	        };
	    };

	    /**
	     * 是否网址
	     * @param str
	     */
	    var isUrl = function(str) {
	            var url = /^http:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/;
	            var ret = url.test(str);

	            if (ret) {
	                return {
	                    'success': true
	                };
	            }
	            return {
	                'success': false,
	                'msg': '网址格式错误'
	            };
	        };

	    /**
	     * 不为空
	     * @param str
	     */
	    var notEmpty = function(str) {
	            if (false === util.isEmpty(str)) {
	                return {
	                    'success': true
	                };
	            }
	            return {
	                'success': false,
	                'msg': '不能为空'
	            };
	        };

	    return {
	        isEmail: isEmail,
	        isNumber: isNumber,
	        isUrl: isUrl,
	        notEmpty: notEmpty
	    };
	}();

	/**
	 * 数据过滤
	 * @return {[type]} [description]
	 */
	var filters = function(){
	    var trim = function(str){
	        if(util.isString(str)){
	            return util.trim(str);
	        }
	        else if(util.isArray(str)){
	            var ret = [];
	            util.each(str , function(v,k){
	                ret[k] = trim(v);
	            });
	            return ret;
	        }
	    };

	    /**
	     * 转小写
	     * @param  {String||Array} o 如果是数组,只支持一维
	     * @return {String||Array}
	     */
	    var toLowerCase = function(str){
	        if(util.isString(str)){
	            return str.toLowerCase();
	        }
	        else if(util.isArray(str)){
	            var ret = [];
	            util.each(str , function(v,k){
	                ret[k] = toLowerCase(v);
	            });
	            return ret;
	        }
	    };

	    /**
	     * 转大写
	     * @param  {String||Array} o 如果是数组,只支持一维
	     * @return {String||Array}
	     */
	    var toUpperCase = function(str){
	        if(util.isString(str)){
	            return str.toUpperCase();
	        }
	        else if(util.isArray(str)){
	            var ret = [];
	            util.each(str , function(v,k){
	                ret[k] = toUpperCase(v);
	            });
	            return ret;
	        }
	    };

	    /**
	     * 转码html
	     * @param  {[type]} str [description]
	     * @return {[type]}     [description]
	     */
	    var escapeHTML = function(str){
	        return util.escapeHTML(str);
	    }

	    /**
	     * 转成数字
	     * @param  {[type]} str [description]
	     * @return {[type]}     [description]
	     */
	    var toNumber = function(str){
	        if(util.isNumeric(str)){
	            return Number(str);
	        }
	        else if(util.isArray(str)){
	            var ret = [];
	            util.each(str , function(v,k){
	                ret[k] = toNumber(v);
	            });
	            return ret;
	        }
	        return 0;
	    };

	    return {
	        trim : trim ,
	        toLowerCase : toLowerCase ,
	        toUpperCase : toUpperCase ,
	        escapeHTML : escapeHTML ,
	        toNumber : toNumber
	    }
	}();

	/**
	 * 表单元素基类
	 * @param {[type]} args  [description]
	 * @param {[type]} undef [description]
	 */
	var FormElementBase = function(args, undef){
		this.name       = args.name || '';
		this.label      = args.label || '';
		this.value      = args.value || '';
		this.attr       = args.attr || {};
		this.validators = args.validators || [];
	    this.filters    = args.filters || [];
	    this.data       = args.data || [];
	    this.type       = 'text';
	    this.dom        = false;

		/**
	     * 闭包
	     */
	    var _self = this;

	    this.elementHtml =  function(){
	    	return '<input type="text" name="'+ this.name +'"/>';
	    };

	    this.buildDom = function(){
	    	this.dom    = jQuery('<div class="control-group"></div>');
	    	var label   = jQuery('<label class="control-label">'+ this.label +'</label>').appendTo( this.dom );
	    	var content = jQuery('<div class="controls">' + this.elementHtml() + '</div>').appendTo( this.dom );
	    	var tip     = jQuery('<span class="help-inline"></span>').hide().appendTo( content );
	    	this.dom.data('label' , label);
	    	this.dom.data('content' , content);
	    	this.dom.data('tip' , tip);

	    	return this.dom;
	    };

	    /**
	     * 设置或取得表单的值
	     * @param  {String||Array||undefined} val 要设置的值
	     * @return {String||Array||undefined}   
	     */
	    this.val = function(val){
	    	if(undef === val){
	    		return this.value;
	    	}
	        //过滤
	        util.each(this.filters , function(v){
	            //console.log(filters)
	            if(filters.hasOwnProperty(v)){
	                val = filters[v](val);
	            }
	        });
	    	this.value = val;
	        return this.value;
	    };

	    /**
	     * 取配置
	     * @return {[type]} [description]
	     */
	    this.getConfig = function(){
	        return {
	            name : this.name ,
	            label : this.label ,
	            value : this.value ,
	            attr : this.attr ,
	            validators : this.validators ,
	            filters : this.filters ,
	            data : this.data ,
	            type : this.type
	        };
	    };

	    /**
	     * 发生错误时触发
	     * @param  {[type]} msg [description]
	     * @return {[type]}     [description]
	     */
	    this.onValidateError = function(msg){
	    	if(this.dom){
	    		this.dom.addClass('error').data('tip').html(msg).show();
	    	}
	        return msg;
	    };

	    this.on = function(event , callback){
	        var property = 'on' + util.ucfirst(event);
	        if(this.hasOwnProperty(property)){
	            this[property] = callback;
	        }
	    };

		/**
		 * 验证，成功后回调
		 * @param callback
		 */
		this.validate = function(callback) {
		    callback = callback || function() {};
		    var value = this.val();

		    var isPass = true;
	        
		    util.each(this.validators, function(v , k) {
		        if (validators.hasOwnProperty(v)) {
	                
		            var ret = validators[v](value);
		            isPass = ret.success;
	                //console.log(ret)
		            if (false == isPass) {
		                _self.onValidateError(ret.msg);
		                return false;
		            }
		            else{
		            	if(_self.dom){
		            		_self.dom.removeClass('error').data('tip').hide();
		            	}
		            }
		        }
		    });

		    if (isPass) {
		        callback(value);
		    }
		};
	};

	/**
	 * 表单组件
	 */
	var formElements = {};

	/**
	 * 文本框
	 * @param {[type]} args [description]
	 */
	formElements.Text = function(args){
	    FormElementBase.call(this,args);
	};


	/**
	 * 隐藏值
	 * @param {[type]} args [description]
	 */
	formElements.Hidden = function(args){
	    FormElementBase.call(this,args);
	    this.type = 'hidden';

	    this.elementHtml =  function(){
	    	return '<input type="hidden" name="'+ this.name +'"/>';
	    };
	};

	/**
	 * 密码框
	 * @param {[type]} args [description]
	 */
	formElements.Password = function(args){
	    FormElementBase.call(this,args);
	    this.type = 'password';

	    this.elementHtml =  function(){
	    	return '<input type="password" name="'+ this.name +'"/>';
	    };
	};

	/**
	 * 下拉框
	 * @param {[type]} args [description]
	 */
	formElements.Select = function(args , undef){
	    FormElementBase.call(this,args);
	    this.type = 'select';
	    
	    var _self = this;

	    this.elementHtml =  function(){
	    	var html = '<select name="'+ this.name +'">';

	    	util.each(this.data , function(v){
	    		html += '<option value="' + v.value + '">' + v.label + '</option>';
	    	})

	    	html += '</select>';
	    	return html;
	    };

	    /**
	     * 设置或取得表单的值
	     * @param  {String||Array||undefined} val 要设置的值
	     * @return {String||Array||undefined}   
	     */
	    this.val = function(val){
	        
	        if(undef === val){
	            return this.value;
	        }
	        
	        util.each(this.data , function(v){
	            if(util.isNumeric(val)) val = Number(val);

	            if(v.value === val){
	                _self.value = v.value;

	                return false;
	            }
	        });
	        //console.log(this.value)

	        return this.value;
	    };
	};

	/**
	 * 单选框
	 * @param {[type]} args [description]
	 */
	formElements.Radio = function(args , undef){
	    FormElementBase.call(this,args);
	    this.type = 'radio';

	    var _self = this;

	    this.elementHtml =  function(){
	    	var html = '';

	    	util.each(this.data , function(v){
	    		html += '<label class="checkbox inline"><input name="'+ _self.name +'" type="radio" value="' + v.value + '" >' + v.label + '</label>'; 
	    	})
	    	return html;
	    };

	    /**
	     * 设置或取得表单的值
	     * @param  {String||Array||undefined} val 要设置的值
	     * @return {String||Array||undefined}   
	     */
	    this.val = function(val){
	        if(undef === val){
	            return this.value;
	        }
	   
	        util.each(this.data , function(v){
	            if(util.isNumeric(val)) val = Number(val);
	            if(v.value === val){
	                _self.value = v.value;
	                return false;
	            }
	        });

	        return this.value;
	    };
	};

	/**
	 * 复选框
	 * @param {[type]} args [description]
	 */
	formElements.Checkbox = function(args , undef){
	    FormElementBase.call(this,args);
	    this.type = 'checkbox';

	    this.elementHtml =  function(){
	    	var html = '';

	    	util.each(this.data , function(v){
	    		html += '<label class="checkbox inline"><input name="'+ _self.name +'" type="checkbox" value="' + v.value + '" >' + v.label + '</label>'; 
	    	})
	    	return html;
	    };

	    /**
	     * 设置或取得表单的值
	     * @param  {String||Array||undefined} val 要设置的值
	     * @return {String||Array||undefined}   
	     */
	    this.val = function(val){
	        if(undef === val){
	            return this.value;
	        }
	        var attr = [];
	        util.each(this.data , function(v){
	            if(util.isNumeric(val)) val = Number(val);
	            if(v.value === val){
	                attr[attr.length] = v.value;
	            }
	        });
	        this.value = attr;

	        return this.value;
	    };
	};


	/**
	 * 多行文本
	 * @param {[type]} args [description]
	 */
	formElements.Textarea = function(args){
	    FormElementBase.call(this,args);
	    this.type = 'textarea';

	    this.elementHtml =  function(){
	    	return '<textarea rows="3" name="'+ _self.name +'" class="input-xlarge"></textarea>';
	    };
	};

	var Form = function(action , method , enctype){
		this.action  = action || '';
		this.method  = method || 'POST';
		this.enctype = enctype || 'multipart/form-data';

	    /**
	     * 表单元素对象
	     * @type {Object}
	     */
	    var _elements = {};

	    /**
	     * 表单的值
	     * @type {Object}
	     */
	    var _values = {};

	    var _self = this;

	    var _isPass = false;

	    /**
	     * 添加组件
	     * @param {[type]} type [description]
	     * @param {[type]} args [description]
	     */
	    this.add = function(type , args){
	        type = util.ucfirst(type);
	        if( util.isString(args.name) && formElements.hasOwnProperty(type) ){
	            _elements[args.name] = new formElements[type](args);
	        }

	        return this;
	    };

	    /**
	     * 添加验证规则
	     * @param {[type]}   name     [description]
	     * @param {Function} callback [description]
	     */
	    this.addValidator = function(name , callback){
	        validators[name] = callback;
	    };

	    /**
	     * 添加过滤规则
	     * @param {[type]}   name     [description]
	     * @param {Function} callback [description]
	     */
	    this.addFilter = function(name , callback){
	        filters[name] = callback;
	    };

	    /**
	     * 设置表单的值
	     * @param {[type]} values [description]
	     */
	    this.setValues = function(values){
	        //console.log(_elements.sex.val);
	        util.each(values,function(v,name){
	            
	            if(_elements.hasOwnProperty(name)){
	                _elements[name].val(v);
	            }
	        });

	        return this;
	    };

	    /**
	     * 验证发生错误时触发
	     * @param  {FormElementBase} element 发生错误的表单元素
	     * @param  {String} msg     错误信息
	     */
	    this.onValidateError = function(element , msg){};

	    /**
	     * 提交事件
	     * @param  {[type]} values [description]
	     * @return {[type]}        [description]
	     */
	    this.onSubmit = function(values){
	    	return _isPass;
	    	
	    };

	    this.on = function(event , callback){
	        var property = 'on' + util.ucfirst(event);
	        if(this.hasOwnProperty(property)){
	            this[property] = callback;
	        }
	    };

	    /**
	     * 验证表单
	     * @param  {Function} callback [description]
	     * @return {[type]}            [description]
	     */
	    this.validate = function(callback){
	        callback = callback || function(){};

	        _values = {};
	        var passCount  = 0;
	        var checkCount = 0;
	        util.each(_elements,function(e){
	           

	            e.on('validateError' , function(msg){
	                //console.log(msg)
	                _self.onValidateError(e, msg);
	            });

	            e.validate(function(val){
	                passCount++;
	                _values[e.name] = val;
	            });
	            checkCount++;
	        });
	        //验证通过
	        if( passCount ===  checkCount)
	        {
	            callback(_values);
	        }
	    };

	    /**
	     * 取表单的配置
	     * @return {[type]} [description]
	     */
	    this.getConfig = function(){
	        var config = {
	            action : this.action ,
	            method : this.method ,
	            enctype : this.enctype ,
	            elements : []
	        };

	        util.each(_elements,function(e){
	            config.elements[ config.elements.length ] = e.getConfig();
	        });

	        return config;
	    };
	};


	host.Form = Form;

})(window , jQuery);