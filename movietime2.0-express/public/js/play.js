$(function(){
	//从URL里获取filmName参数的值
	var filmName = getQueryString('filmName');
	$('#video').attr('src','movie/' + filmName);
	$('#video_name').html(filmName);
	
	
	
	
})

$('#btn_full').on('click',function(){
    FullScreen();
   // exitFullscreen();
});

//进入全屏
function FullScreen() {
    var ele = document.getElementById('video');
    if (ele .requestFullscreen) {
        ele .requestFullscreen();
    } else if (ele .mozRequestFullScreen) {
        ele .mozRequestFullScreen();
    } else if (ele .webkitRequestFullScreen) {
        ele .webkitRequestFullScreen();
    }
}
//退出全屏
function exitFullscreen() {
    var de = document;
    if (de.exitFullscreen) {
        de.exitFullscreen();
    } else if (de.mozCancelFullScreen) {
        de.mozCancelFullScreen();
    } else if (de.webkitCancelFullScreen) {
        de.webkitCancelFullScreen();
    }
}
