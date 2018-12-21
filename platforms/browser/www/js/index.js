// footer 选项卡功能实现页面的切换
$(function(){
    $("footer a").on('click',function(){
        $(this).addClass("active").siblings().removeClass("active");
        let i = $(this).index();
        !$(this).parent().siblings().not("header").eq(i).addClass("active").siblings().removeClass("active");
    })
})
