/**
 * 
 */
function changeVerifyCode(img){
	img.src="./get-img-verify?" + Math.floor(Math.random()*100);
}

function getQueryString(name){
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r != null){
		return decodeURIComponent(r[2]);
	}
	return '';
}

 