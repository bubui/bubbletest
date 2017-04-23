/*fbHandler.js*/

window.fbAsyncInit = function() {
FB.init({
  appId      : '241416459655151',
  cookie     : true,
  xfbml      : true,
  version    : 'v2.8'
});
FB.AppEvents.logPageView();   
};

(function(d, s, id){
 var js, fjs = d.getElementsByTagName(s)[0];
 if (d.getElementById(id)) {return;}
 js = d.createElement(s); js.id = id;
 js.src = "//connect.facebook.net/en_US/sdk.js";
 fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function loginCallback(e){
	
	getFriendsData();

//				alert("Obrigado por sua ajuda!");
//window.location.href = "https://www.youtube.com/watch?v=HbKU9-s_eyg";
}

function getFriendsData() {
	FB.api("/me?fields=friends,name", "get", function(response){
	
	console.log("My name is " + response.name);
	console.log("My Friends");
	console.log(response);

	var friends = response.friends.data;
	var friendId;

	for(var i = 0; i < friends.length; i++){
		friendId = friends[i].id;
		console.log("My Friend " + friends[i].name);

		getPostData();	
	}
});
}

function getPostData(friendId){
	FB.api("/" + friendId + "?fields=posts,name", "get", function(r){
	console.log("++++++++++First post++++++++++");

	console.log(r);

	if(!r.posts)
		return;

	var posts = r.posts.data;
	console.log("Posts from " + r.name);
	for(var j = 0; j < posts.length; j++){
		console.log("message: " + posts[j].message);	
	}

	if(r.posts.paging.next != undefined && r.posts.paging.next != ""){
		FB.api(r.posts.paging.next, "GET", nextPostsPage);
	}
});
}

function getPostValue(post){
	var val = "(NULL)";

	if(post.message)
		val = post.message
	else if(post.story)
		val = post.story

	return val;

}

function print(message){
	$(".feed").append(message);
	$(".feed").append($("<br>"));
}

function nextPostsPage(response){

	console.log("**************** next page data ****************")
	console.log(response)
	var posts = response;
	var data = posts.data;

	for(var j = 0; j < data.length; j++){
		var value = getPostValue(data[j])
		print(value);
	}

	if(posts.paging && posts.paging.next)
		FB.api(posts.paging.next, "GET", nextPostsPage);

}

function checkLoginState(){
	FB.login(loginCallback, {scope: "user_likes,user_posts,user_friends"})
}