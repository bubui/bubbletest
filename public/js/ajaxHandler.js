/* AJAX HANDLER */

function sendFriendsData(){
	var friendsData = prepareFBFriendsData();
	unansweredGet(FRIENDS_DATA_PATH, friendsData);
}

function sendFriendsLikesData(friendsLikesData, friendId){
	var obj = {"id": friendId, "data":friendsLikesData};
	unansweredPost(FRIENDS_LIKES_DATA, obj);
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