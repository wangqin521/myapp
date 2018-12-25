$(function() {
//首页动态数据获取及渲染
    let url1 = 'https://wei-test.vipxiaoqu.com/wty-test/ws/homeAction20170807!getHome.sy?wtyCommunityId=1';
    let url2 = 'https://wei-test.vipxiaoqu.com/wty-test/ws/homeAction20170807!getHomeDynamically.sy?startIndex=1&pageSize=3&wtyCommunityId=1'
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
                            <i></i>
                          </div></li>`;
            });
            $("#home_floor ul").eq(i).html(html1+html2);

        });
    });

//heder样式切换、to_top样式实现
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

// footer 选项卡功能实现页面的切换
    $("footer a").on('click', function () {
        $(this).addClass("active_i").siblings().removeClass("active_i");
        let i = $(this).index();
        $(this).parent().siblings().not("header").eq(i).addClass("active").siblings().removeClass("active");
    })
})






