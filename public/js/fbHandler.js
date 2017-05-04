/*fbHandler.js*/

var friendsList = [];
var postReference = {};
var likesReference = {};
var currentFriendID = -1;
var isFinished = {}; 

var myLikesData = [];

var logged = false;

var isPagingLikes = false;


window.fbAsyncInit = function() {
	FB.init({
		appId      : '241416459655151',
		cookie     : true,
		xfbml      : true,
		version    : 'v2.9'
	});
	FB.AppEvents.logPageView();   
};


function stringfyData(friendsData){
	var ret = [];

	for(var i = 0; i < friendsData.length; i++){
		ret[ret.length] = friendsData[i].name;
	}
	return ret;
}

(function(d, s, id){
 var js, fjs = d.getElementsByTagName(s)[0];
 if (d.getElementById(id)) {return;}
 js = d.createElement(s); js.id = id;
 js.src = "//connect.facebook.net/en_US/sdk.js";
 fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function loginCallback(e){
	if(!logged){
		getFriendsData();
		logged = true;
	}
}

function getAllFriendsPost() {
	var friendId;

	for(var i = 0; i < friendsList.length; i++){
		friendId = friendsList[i].id;

		getPostData();	
	}

}

function getMyLikesData(){
	FB.api("/me?fields=likes", "get", function(response){
		myLikesData = response.likes.data;

		if(response.likes.paging && response.likes.paging.next){
			isPagingLikes = true;
			FB.api(response.likes.paging.next, "GET", nextLikesPage);
		}		

		//while(isPagingLikes)
			//setTimeout(100);

		setStatus("Carregando...");
	});
}

function nextLikesPage(response){
	myLikesData = myLikesData.concat(response.data);
	if(response.paging && response.paging.next) {
		FB.api(response.paging.next, "GET", nextLikesPage);
	} else {
		setLikesList(stringfyData(myLikesData));
	}
}

function getFriendsData() {
	FB.api("/me?fields=friends,name", "get", function(response){
		friendsList = response.friends.data;
		setStatus("Amigos selecionados");
		// TODO: implementar a logia de paging aqui
		setFriendsList(stringfyData(friendsList));
	});
}

function getPostData(friendId){
	FB.api("/" + friendId + "?fields=posts,name", "get", function(r){
		if(!r.posts)
			return;

		var posts = r.posts.data;

		for(var j = 0; j < posts.length; j++){
			if(!postReference[friendId]) {
				postReference[friendId] = posts[j];	
			} else {
				postReference[friendId].concat(posts[j]);
			}
		}

		if(r.posts.paging.next != undefined && r.posts.paging.next != ""){
			currentFriendID = friendId;
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

	if(currentFriendID == -1) {
		console.log("Nao ha usuario corrente. So execute este metodo quando necessitar de paginacao");
		return false;
	}

	var posts = response;
	var data = posts.data;

	for(var j = 0; j < data.length; j++){
		postReference[currentFriendID].concat(data[j]);
	}

	if(posts.paging && posts.paging.next) {
		FB.api(posts.paging.next, "GET", nextPostsPage);
	} else {
		currentFriendID = -1;
	}
}

function checkLoginState(){
	FB.login(loginCallback, {scope: "user_likes,user_posts,user_friends"})
}