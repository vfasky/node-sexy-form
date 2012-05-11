友好的表单验证
=============


用户跟服务端交互,往往是通过表单. 而客户端提交的数据是不可信的. 于是,这样的代码出现了:


    if(undefined !== req.body.data.name && 0 != req.body.data.name.length  ){
        var name = util.escapeHTML(req.body.data.name);
        name = tuil.trim(name);
    }else{
        return res.json({success : false , msg : '名称不能为空' });
    }

    if(util.isNumeric(req.body.data.sex)){
        var sex = Number(req.body.data.sex);
    }else{
        return res.json({success : false , msg : '性别数据异常' });
    }

    if(util.isEmail(req.body.data.email)){
        //....
    }else{
        return res.json({success : false , msg : '邮箱格式错误' });
    }
    //....


是不是很不sexy , 于是 , sexy-form 来了:

    var Form = require('sexy-form');
    var form = new Form();

    form.add('text',{
        name : 'name' ,
        label : '姓名' ,
        validators : ['isString' , 'notEmpty'] ,
        filters : ['trim' , 'escapeHTML' , 'toUpperCase']
    }).add('select' , {
        name : 'sex' ,
        label : '性别' ,
        data : [
            { value : 1 , label : '男' } ,
            { value : 2 , label : '女' } ,
            { value : 3 , label : '保密' }
        ]
    }).add('text' , {
        name : 'email' ,
        label : '邮箱' ,
        validators : ['isEmail'] ,
        filters : ['trim']
    });
    
    //验证失败的处理, 注意,如果有多个表单元素验证失败,会执行多次
    form.on('validateError',function(e , msg){
        return res.json({success : false , msg : e.label + msg });
    });

    form.setValues(req.body.data).validate(function(value){
        //验证通过,返回经过过滤的值
        console.log(value);
    });


sexy多了吧,而且,表单的定义还可以传给view.
客户端只需要扩展下 sexy-form , 加上构造表单dom的能力,客户端的实时验证也实现了(后续功能)
    
    res.render('admin/index' , {form : form.getConfig() });


项目地址: [https://github.com/vfasky/node-sexy-form](https://github.com/vfasky/node-sexy-form)

默认支持的验证规则:

 - isEmail
 - isNumber
 - isUrl
 - notEmpty

默认支持的滤规则

 - trim
 - toLowerCase
 - toUpperCase
 - escapeHTML
 - toNumber


示例:

    var Form = require('sexy-form');
    var form = new Form();

添加自定义过滤规则

    form.addFilter('test' , function(str){
        return 'Hello' + str;
    });

添加自定验证规则

    form.addValidator('test' , function(str){
        if(str === 'xx@mail.com') return { success : true };
        return {
            success : false ,
            msg : '我说你错,你就是错'
        };
    })

构造表单结构

    form.add('text' , {
        name : 'name' ,
        label : '姓名' ,
        validators : ['isString'] ,
        filters : ['trim' , 'escapeHTML' , 'toUpperCase' , 'test']
    }).add('text' , {
        name : 'email' ,
        label : '邮箱' ,
        validators : ['isEmail' , 'test'] ,
        filters : ['trim']
    }).add('select' , {
        name : 'sex' ,
        label : '性别' ,
        data : [
            { value : 1 , label : '男' } ,
            { value : 2 , label : '女' } ,
            { value : 3 , label : '保密' }
        ]
    }).add('radio' , {
        name : 'degree' ,
        label : '学历' ,
        data : [
            { value : 1 , label : '大专' } ,
            { value : 2 , label : '本科' } 
        ]
    }).add('checkbox' , {
        name : 'hobby' ,
        label : '爱好' ,
        data : [
            { value : 1 , label : '篮球' } ,
            { value : 2 , label : '足球' } 
        ]
    }).add('hidden' , {
        name : 'id' ,
        filters : ['toNumber'] 
    });

    console.log( form.getConfig() );


测试过滤

    form.setValues({
        name : '<div>test</div>'  ,
        email : 'xx@mail.com' ,
        sex : 1 ,
        degree : 1 ,
        hobby : 2 ,
        id : 'ddd'
    }).validate(function(value){
        //验证通过,返回经过过滤的值
        console.log(value);
    });

测试验证

    form.setValues({
        name : '<div>test</div>'  ,
        email : 'sdfdsff@dd.com' ,
        sex : 1 ,
        degree : 1 ,
        hobby : 2 ,
        id : 'ddd'
    });

错误回调

    form.on('validateError',function(e , msg){
        console.log(e.label + '发生错误,信息:' + msg);
    });

执行验证

    form.validate();
