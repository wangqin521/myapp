$(function() {
//首页动态数据获取及渲染
    let url1 = 'https://wei-test.vipxiaoqu.com/wty-test/ws/homeAction20170807!getHome.sy?wtyCommunityId=1';
    let url2 = 'https://wei-test.vipxiaoqu.com/wty-test/ws/homeAction20170807!getHomeDynamically.sy?startIndex=1&pageSize=3&wtyCommunityId=1';
    let url3 = 'https://wei-test.vipxiaoqu.com/wty-test/ws/serviceAction20170807!getServiceMenu.sy?communityId=1';
    let imgUrl = 'https://file-test.vipxiaoqu.com/';
    //轮播图、快捷区、专题区、苏果专场、品牌特卖
    $.get(url1, function (res) {
        let data = $.parseJSON(res).data;
        // 轮播图---自动播放
        let lunbo = data.headAdvert;
        let lun_url = lunbo.map(function(val){
            return imgUrl+val.url;
        })
        let h_img = '';
        for(let i in lun_url){
            let src = lun_url[i]
            h_img += `<li><a href="#"><img src=${src}></a></li>`;
        }
        $("#banner_img").html(h_img);

        let imgCon = $("#banner_img li img");
        let dLi = $("#banner_dian");
        let len = imgCon.length;
        let html = "";
        for (let i=0;i<len;i++){
            if(i===0){
                html += '<li class=active_dian>' +'</li>';
                imgCon.eq(i).show();
            }else{
                html += '<li>' +'</li>';
                imgCon.eq(i).hide();
            }
        }
        dLi.html(html);
        function showPic(index){
            imgCon.eq(index).show().parents("li").siblings().find("img").hide();
            dLi.find("li").eq(index).addClass("active_dian").siblings("li").removeClass("active_dian");
        };
        let count = 1;
        function fMove(){
            if(count==len){
                count=0;
            }
            showPic(count);
            count++;
        }
        setInterval(fMove,2500);

        //苏宁专场
        let snzc = data.homePageTemplateInfo[0].module;
        let zc_url = snzc.mkArray.map(function(val){
            return imgUrl+val.picUrl;
        })
        let name1 = snzc.name1;
        let name2 = snzc.name2
        let zc_html1 = `<h1><b>${name1}</b><span>${name2}</span></h1>`
        let zc_html2 = '';
        for(let i in zc_url){
            let zc_src = zc_url[i]
            zc_html2 += `<li><a href="#"><img src=${zc_src}></a></li>`;
        }
        zc_html2 = `<ul>${zc_html2}</ul>`
        $("#home_sgzc").html(zc_html1+zc_html2)

        //品牌特卖
        let pptm = data.homePageTemplateInfo[1].module;
        let tm_sm_url = pptm.mkArray.map(function(val){
            return imgUrl+val.picUrl;
        })
        let tm_bg_url = imgUrl+pptm.pic.pic;
        let tm_html1 = `<li><a href="#"><img src=${tm_bg_url}></a></li>`
        let tm_html2 = ``
        for(let i in tm_sm_url){
            let tm_sm_src = tm_sm_url[i];
            tm_html2 += `<li><a href="#"><img src=${tm_sm_src}></a></li>`;
        }
        $("#home_pptm ul").html(tm_html1+tm_html2);
    });
    // 1F、2F、3F
    $.get(url2, function (res2) {
        let res = $.parseJSON(res2).data;
        let data = res.homePageTemplateInfo;
        $("#home_floor ul").map(function (index,val) {
            let i = index;
            let floor_bg_img = imgUrl+data[i].floor.lb[0].pic;
            let html1 = `<li><a href="#"><img src=${floor_bg_img}></a></li>`;
            let html2 = '';
            data[i].floor.sp.map(function(val){
                let floor_sm_img = imgUrl+val.serviceEvent.picture;
                let name = val.name.substring(0,8)+'...';
                let oldprice = val.serviceEvent.priceNotInUse.substring(3);
                let newprice = val.serviceEvent.priceInUse;
                let saleprice = (oldprice.substring(1)-newprice.substring(1)).toFixed(2);
                html2 += `<li><div><img src=${floor_sm_img} alt=""><b>直降${saleprice}元</b></div>
                          <p>${name}</p>
                          <div>
                            <span>${newprice}</span>
                            <del>${oldprice}</del>
                            <i class="add_cart"></i>
                          </div></li>`;
            });
            $("#home_floor ul").eq(i).html(html1+html2);

        });
    });

// heder样式切换、to_top样式实现
    $("#home_article").on('scroll',function(){
        let top = $("#home_article").scrollTop();
        let height1 = $("#home_banner").height();
        let height2 = $("#home_pptm").offset().top;
        let height3 = $("home_article header").height();
        if(top>=height1){
            $("#home_article header").css("background","linear-gradient(to right,#F2555F,#C64440)");
        }else{
            $("#home_article header").css("background","rgba(0,0,0,0.05)");
        }
        if(height2 <= height3){
            $("#to_top").show();
        }else{
            $("#to_top").hide();
        }

    })
    // 点击返回头部
    $("#to_top").on('click',function(){
        $("#home_article").scrollTop(0);
    })
//分类页
    //分类页数据渲染
    $.get(url3,function(res){
        let data = $.parseJSON(res).data;
        let html = '';
        let html1 = '';
        let html2 = '';
        let html4 = '';
        let html5 = '';
        data.map(function(val,index){
            let name = val.name;
            let code = val.code;
            if(index == 0){
                html1 = `<li class="classify_left_bg" id="${code}">${name}</li>`
            }else{
                html2 += `<li id="${code}">${name}</li>`
            }
            html=html1+html2;

            let url_r = url3+'&parentId='+code;
            $.get(url_r,function(res){
                let code_r = url_r.split("=")[2];
                let data_r = $.parseJSON(res).data;
                let html3 = '';
                data_r.map(function(val){
                    let name_r = val.name;
                    let picture =imgUrl+val.picture;
                    html3 += `<li><a href="#"><div><img src="${picture}" alt=""></div><span>${name_r}</span></a></li>`;
                })
                if( code_r == 4000){
                    html4 = `<ul class="active_ul" id="${code_r}">${html3}</ul>`;
                }else{
                    html5 += `<ul class="unactive_ul" id="${code_r}">${html3}</ul>`;
                }
                $("#classify_right").html(html4+html5);
            })
        })
        $("#classify_left ul").html(html);
        // 分类页样式
        $("#classify_left li").on('click',function(){
            $(this).addClass("classify_left_bg").siblings().removeClass("classify_left_bg");
            let id_l = $(this).attr("id")
            $("#classify_right ul").map(function(index,val){
                let id_r = val.id;
                if(id_r == id_l){
                    $("#classify_right ul").eq(index).addClass("active_ul").removeClass("unactive_ul").siblings().addClass("unactive_ul").removeClass("active_ul")
                }
            })
        })
    })
// 购物车样式
    $(".select").on('click',function (val) {
        $(this).addClass("select_bg").removeClass("unselect_bg");
    })
// 页面切换底部按钮样式切换
    $(".change").on('click',function(){
        let href =$(this).attr("href").substr(1);
        $("footer a").map(function (index,val) {
            let href1 = val.href.split("#")[1];
            if(href1==href){
                $("footer a").eq(index).addClass("active").siblings().removeClass("active")
            }
        })
    })
// 添加到购物车
    $(".add_cart").on('click',function () {
        let price = $(this).parent()[0].innerText.split(" ");
        console.log(price);
    })
})






