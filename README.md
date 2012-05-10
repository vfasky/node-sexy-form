友好的表单验证
=============

示例:

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
