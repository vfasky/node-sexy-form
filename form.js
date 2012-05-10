/**
 * 表单验证
 */
var util = require('./util');

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

	/**
     * 闭包
     */
    var _self = this;

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
};

/**
 * 密码框
 * @param {[type]} args [description]
 */
formElements.Password = function(args){
    FormElementBase.call(this,args);
    this.type = 'password';
};

/**
 * 下拉框
 * @param {[type]} args [description]
 */
formElements.Select = function(args , undef){
    FormElementBase.call(this,args);
    this.type = 'select';
    
    var _self = this;

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

exports = module.exports = Form;



