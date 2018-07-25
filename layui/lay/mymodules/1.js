layui.define(["jquery","laytpl"], function (exports) {
    var $ = layui.jquery;
    var laytpl = layui.laytpl;
    var zIndex=3000;    // 共用一个层级
    
    function Cascader(option) {
        var ele=option.ele;
        var d=option.data;

        var obj={
            domContent: "",     // content节点
            firstText: "",      // 第一层text
            secondText: "",     // 第二层text
            thirdText: "",
            textStr: "",        // 最终的text
            onOff: false,       // 是否显示
            // 初始化容器和标签
            init: function () {
                $(ele).after('<i class="layui-icon layui-icon-down"></i>');
                $(ele).after('<div class="Cascader-content"></div>');
            },
            // 初始化第一层
            initFirst: function () {
                var string =  laytpl(
                    `<ul class="Cascader-first Cascader-child">
                        {{# for(var i=0;i<d.length;i++){ }}
                            <li>{{ d[i].label }}<i class="layui-icon layui-icon-right"></i></li>
                        {{# } }}
                    </ul>`
                ).render(d);
                $(ele).siblings(".Cascader-content").append(string);
                this.domContent=$(ele).siblings(".Cascader-content");
                this.domContent.find(".Cascader-first").hide();

                // 显示隐藏第一层的标签
                for(var i=0;i<d.length;i++){
                    ("children" in d[i])?(
                        this.domContent.find("ul.Cascader-first li").eq(i).find("i").show()
                    ):(
                        this.domContent.find("ul.Cascader-first li").eq(i).find("i").hide()
                    );
                }
            },
            // 点击第一层
            clickItem: function (event) {
                event.stopPropagation();
                var index=$(this).index();
                $(this).addClass("active").siblings("li").removeClass("active");
                return index;
            },
            // 若有第二层则初始化第二层
            initSecond: function (index) {
                if(this.domContent.find(".Cascader-second").length!=0){
                    this.domContent.find(".Cascader-second").remove();
                    this.domContent.find(".Cascader-third").remove();
                    this.domContent.find(".Cascader-fourth").remove();
                }
                var string =  laytpl(
                    `<ul class="Cascader-second Cascader-child">
                        {{# for(var i=0;i<d[${index}]["children"].length;i++){ }}
                            <li>{{ d[${index}]["children"][i].label }}<i class="layui-icon layui-icon-right"></i></li>
                        {{# } }}
                    </ul>`
                ).render(d);
                this.domContent.append(string);

                // 显示隐藏第二层的标签
                for(var i=0;i<d[index]["children"].length;i++){
                    ("children" in d[index]["children"][i])?(
                        this.domContent.find("ul.Cascader-second li").eq(i).find("i").show()
                    ):(
                        this.domContent.find("ul.Cascader-second li").eq(i).find("i").hide()
                    );
                }
            },
            // 只有一层则获取text并关闭
            onlyFirst: function () {
                // 只有一层
                this.domContent.find(".Cascader-second").remove();
                this.domContent.find(".Cascader-third").remove();
                this.domContent.find(".Cascader-fourth").remove();
                this.textStr=this.firstText;
                $(ele).val(this.textStr)
                this.onOff = false;
                $(ele).siblings(".Cascader-content").find("ul").slideUp(100);
                $(ele).siblings("i").replaceWith('<i class="layui-icon layui-icon-down"></i>');
            },
            // 若有第三层则初始化第三层
            initThird: function (index,sIndex) {
                if(this.domContent.find(".Cascader-third").length!=0){
                    this.domContent.find(".Cascader-third").remove();
                    this.domContent.find(".Cascader-fourth").remove();
                }
                var string =  laytpl(
                    `<ul class="Cascader-third Cascader-child">
                        {{# for(var i=0;i<d[${index}]["children"][${sIndex}]["children"].length;i++){ }}
                            <li>{{ d[${index}]["children"][${sIndex}]["children"][i].label }}<i class="layui-icon layui-icon-right"></i></li>
                        {{# } }}
                    </ul>`
                ).render(d);
                this.domContent.append(string);

                // 显示隐藏第三层的标签
                for(var i=0;i<d[index]["children"][sIndex]["children"].length;i++){
                    ("children" in d[index]["children"][sIndex]["children"][i])?(
                        this.domContent.find("ul.Cascader-third li").eq(i).find("i").show()
                    ):(
                        this.domContent.find("ul.Cascader-third li").eq(i).find("i").hide()
                    );
                }
            },
            // 只有两层则获取text并关闭
            onlySecond: function () {
                // 只有两层
                this.domContent.find(".Cascader-third").remove();
                this.textStr=this.firstText+"/"+this.secondText;
                $(ele).val(this.textStr)
                this.onOff = false;
                $(ele).siblings(".Cascader-content").find("ul").slideUp(100);
                $(ele).siblings("i").replaceWith('<i class="layui-icon layui-icon-down"></i>');
            },
            initFourth: function (index,sIndex,tIndex) {
                if(this.domContent.find(".Cascader-fourth").length!=0){
                    this.domContent.find(".Cascader-fourth").remove();
                }
                var string =  laytpl(
                    `<ul class="Cascader-fourth Cascader-child">
                        {{# for(var i=0;i<d[${index}]["children"][${sIndex}]["children"][${tIndex}]["children"].length;i++){ }}
                            <li>{{ d[${index}]["children"][${sIndex}]["children"][${tIndex}]["children"][i].label }}</li>
                        {{# } }}
                    </ul>`
                ).render(d);
                this.domContent.append(string);
            },
            // 获取第三层text并关闭：self->obj
            onlyThird: function () {
                // 只有三层
                this.domContent.find(".Cascader-fourth").remove();
                this.textStr=this.firstText+"/"+this.secondText+"/"+this.thirdText;
                $(ele).val(this.textStr)
                this.onOff = false;
                $(ele).siblings(".Cascader-content").find("ul").slideUp(100);
                $(ele).siblings("i").replaceWith('<i class="layui-icon layui-icon-down"></i>');
            },
            onlyFourth: function (event,self) {
                event.stopPropagation();
                $(this).addClass("active").siblings("li").removeClass("active");
                self.textStr=self.firstText+"/"+self.secondText+"/"+self.thirdText+"/"+$(this).text();
                $(ele).val(self.textStr)
                self.onOff = false;
                $(ele).siblings(".Cascader-content").find("ul").slideUp(100);
                $(ele).siblings("i").replaceWith('<i class="layui-icon layui-icon-down"></i>');
            }
        }
        

        obj.init();
        obj.initFirst();

        // 点击第一层时显示第二层

        var s=".Cascader-first li";
        
        obj.domContent.on("click",s,function(event){
            obj.firstText=$(this).text();
            // 返回值为点击的第一层index
            index=obj.clickItem.call(this,event);
            // 判断当前是否存在第二层
            ("children" in d[index])?(
                obj.initSecond(index)
            ):(
                obj.onlyFirst()
            );
            
        })

        // 第二层绑定事件
        obj.domContent.on("click",".Cascader-second li",function(event){
            obj.secondText=$(this).text();
            sIndex=obj.clickItem.call(this,event);      

            // 判断当前是否存在第三层
            (("children" in d[index]) && ("children" in d[index]["children"][sIndex]))?(
                obj.initThird(index,sIndex)
            ):(
                obj.onlySecond()
            );

            
        })

        // 第三层绑定事件
        obj.domContent.on("click",".Cascader-third li",function(event) {
            obj.thirdText=$(this).text();
            var tIndex=obj.clickItem.call(this,event);      

            // 判断当前是否存在第三层
            (("children" in d[index]) && ("children" in d[index]["children"][sIndex]) && ("children" in d[index]["children"][sIndex]["children"][tIndex]))?(
                obj.initFourth(index,sIndex,tIndex)
            ):(
                obj.onlyThird()
            );
        });

        obj.domContent.on("click",".Cascader-fourth li",function(event){
            obj.onlyFourth.call(this,event,obj);
        })


        $(ele).on("click", function (event) {
            obj.onOff = !obj.onOff;
            event.stopPropagation();
            zIndex++;
            if (obj.onOff) {
                $(ele).siblings(".Cascader-content").find("ul").slideDown(100);
                $(ele).siblings("i").replaceWith('<i class="layui-icon layui-icon-up"></i>');

                obj.domContent.css("zIndex",zIndex);
            } else {
                $(ele).siblings(".Cascader-content").find("ul").slideUp(100);
                $(ele).siblings("i").replaceWith('<i class="layui-icon layui-icon-down"></i>');
            }
        })
        $(document).on("click",function() {
            obj.onOff = false;
            if(!obj.onOff){
                $(ele).siblings(".Cascader-content").find("ul").slideUp(100);
                $(ele).siblings("i").replaceWith('<i class="layui-icon layui-icon-down"></i>');
            }
        })
    }
    
    exports('Cascader', Cascader);
})