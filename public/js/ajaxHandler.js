/* AJAX HANDLER */

function sendFriendsData(){
	var friendsData = prepareFBFriendsData();
	unansweredGet(FRIENDS_DATA_PATH, friendsData);
}

function sendFriendsLikesData(friendsLikesData, friendId){
	var obj = {"id": friendId, "data":friendsLikesData};
	unansweredGet(FRIENDS_LIKES_DATA, obj);
}

function getPagesData () {
	answeredGet(PAGES_DATA, {}, function(res){
		trackedPages = res;
		trackedPagesKeys = Object.keys(trackedPages);
		baseTrackedPages = jQuery.extend(true, {}, trackedPages);

		mountDataArray();
	});
}

function getAllUsers(){
	answeredGet(ALL_USERS, {}, function(res){
		console.log(res);
		allServerUsers = res;
	});
}

function addUser(fb_id){
	unansweredGet(ADD_USER, {"fb_id": fb_id});	
}

function delUser(fb_id){
	unansweredGet(DEL_USER, {"fb_id": fb_id});		
}


function unansweredGet(path, data){
	$.get(path, data);
}

function unansweredPost(path, data){
	$.post(path, data);
}

function answeredGet(path, data, callback){
	$.get(path, data, callback);
}

function prepareFBFriendsData() {
	var object = {"friends_data": prepareFriendsData(friendsList)};
	console.log(object);
	return object;
}