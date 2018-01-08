;(function ($) {
    var Tab=function (tab, config) {
        var _this_=this;
        //配置默认参数
        this.tab=tab;
        this.config={
            "triggerType":"click",//触发类型
            "effect":"default",//显示效果
            "invoke":1,//初始化 选中状态
            "auto":false,//是否自动
        }
        //保存tab标签列表
        this.tabItems=this.tab.find('ul.tab-ul li.tab-li');
        this.contentItems=this.tab.find('div.tab-main div.tab-item');

        //保存好扩展掉的配置参数
        var config=this.config;
        if(config.triggerType==='click'){
            this.tabItems.bind(config.triggerType,function () {
                _this_.invoke($(this));//$(this)-->li 的当前状态active
            })
        }else if(config.triggerType==='mouseover' || config.triggerType!="click"){
            this.tabItems.bind(config.triggerType,function () {
                // _this_.invoke($(this));// console.log($(this))//$(this)-->li 的当前状态active
                var self=$(this);
                this.timer=window.setTimeout(function () {
                    _this_.invoke($(self));
                },500)
            }).mouseout(function () {
                window.clearTimeout(this.timer);
            });
        }
        // 自动切换功能，当配置了时间.....
        if(config.auto){
            //定义一个全局的定时器
            this.timer=null;
            this.loop=0;
            this.autoPlay();//自动播放的函数

            //
            this.tab.hover(function(){
                window.clearTimeout(_this_.timer);//鼠标移入清除定时器
            },function(){
                //鼠标离开，继续自动轮播
                _this_.autoPlay();

            });

        };
        //    设置默认显示第几个tab
        if(config.invoke>1){
            this.invoke(this.tabItems.eq(config.invoke-1));

        }


    };
    Tab.prototype={
        //自动切换函数
        autoPlay:function () {
            var _this_=this,//保存this
                tabItems=this.tabItems,//保存li
                tabLength=tabItems.size(),//li的长度
                config=this.config;//保存config

            this.timer=window.setInterval(function () {
                _this_.loop++;
                if(_this_.loop>=tabLength){//如果计数器大于li的长度
                    _this_.loop=0;
                };
                tabItems.eq(_this_.loop).trigger(config.triggerType)//自动切换
            },config.auto);

        },
        //事件驱动函数
        invoke:function (currentTab) { //currentTab页面当中的li
            var _this_=this;
            //执行Tab的选中状态active()
            //切换对应的tab的内容，根据配置参数的effect
            //获取当前的下标参数
            var index=currentTab.index();//存储索引值
            currentTab.addClass("active").siblings().removeClass("active");//点击li的时候添加类
            //内容区域切换
            var effect=this.config.effect;//配置参数--显示效果
            var conItems=this.contentItems;//内容区域div
            // conItems.eq(index).addClass("current").siblings().removeClass("current");//对应内容切换
            if(effect==="default" || effect!="fade"){
                conItems.eq(index).addClass("current").siblings().removeClass("current");
                // console.log(contentItems);
            }else if(effect==="fade"){
                conItems.eq(index).fadeIn().siblings().fadeOut();
            }
            //index  loop同步 如果配置了自动切换,把loop同步值换成index
            if(this.config.auto){
                this.loop=index;
            };


        },

        //配置获取参数
        // getConfig:function () {
        //     //获取tab的data的data-config
        //     var config=this.tab.attr("data-config");
        //     // console.log(config)
        //     //确定有配置参数
        //     if(config && config!=''){//如果页面中配置参数不等于空
        //        return $.parseJSON(config)
        //     }else{
        //        return null;//如果没有配置参数 则返回空
        //     }
        // }
    }
    //Tab初始化函数
    Tab.init=function(tabs){
        var _this_=this;
        tabs.each(function(){
            new _this_($(this));
        })
    }
    //注册成jquery方法
    $.fn.extend({
        tab:function(){
            this.each(function(){
                new Tab($(this))
            })
            return this;
        }
    })

    //将Tab赋值为全局变量
    window.Tab=Tab;
})(jQuery)//匿名函数自�