var jquery = require("jquery");
var about = require('./about.js');
require('./css/index.css');

var box = $("#box");
$.ajax({
	url:"/v2/book/1220562",
	type:"GET",
	success:function(res){
		console.log(res);
	}
})
console.log(about.sayname());
alert(box);
