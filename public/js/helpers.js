/*helpers.js*/

$(function (){
	init();
});


function setFriendsList(friendsList){
	var select = $("#friendsList");
	select.empty();
	for(var i = 0; i < friendsList.length; i++) {
		select.append($("<option value='" + friendsList[i].id + "'>" + friendsList[i].name + "</option>"));
	}
}

function setLikesList(likesList){
	var select = $("#myLikesSelect");
	select.empty();
	for(var i = 0; i < likesList.length; i++) {
		select.append($("<option value='" + likesList[i].id + "'>" + likesList[i].name + "</option>"));
	}	
}

function setLikesByIDList(likesList){
	var select = $("#myFriendsLikesSelect");
	select.empty();
	for(var i = 0; i < likesList.length; i++) {
		select.append($("<option value='" + likesList[i].id + "'>" + likesList[i].name + "</option>"));
	}	
}

function setStatus(content){
	$("#status").html(content);
}

function init(){
	bindEvents();
}

function bindEvents() {
	$("#getLikes").on("click", onGetLikesClick);
	$("#getFriendsLikes").on("click", onGeMyFriendLikes)
	$("#matchLikes").on("click", onMatchLikes)
	$("#btFB").on("click", checkLoginState);
	$("#startTestButton").on("click", onStartTest);
	$("#byMyLikes").on("click", onMyLikes);
	$("#byFriendsLikes").on("click", onFriendsLikes);
}

function onFriendsLikes(e) {
	var matchedLikes = getMatchedLikes();

	var leftKeys = Object.keys(matchedLikes.left);
	var rightKeys = Object.keys(matchedLikes.right); 

	var leftLikes = 0;
	var rightLikes = 0;

	for(var i = 0; i < leftKeys.length; i++){
		leftLikes += matchedLikes.left[leftKeys[i]];
	}

	for(var i = 0; i < rightKeys.length; i++){
		rightLikes += matchedLikes.right[rightKeys[i]];	
	}

	drawMyPosition($("#me"), leftLikes, rightLikes, leftLikes + rightLikes);
}

function getMatchedLikes(){
	var friendsIds = Object.keys(friendsList);
	var id, friendData, likes, likesKeys, likeKey;
	var matches = {"left": {}, "right": {}};
	
	
	for(var i = 0; i < friendsIds.length; i++){
		id = friendsIds[i];
		friendData = friendsList[id];
		likes = friendData.likes;
		likesKeys = Object.keys(likes);
		
		for(var j = 0; j < likesKeys.length; j++){
			likeKey = likesKeys[j];
			// Match on left
			if(leftWing[likeKey] != undefined) {
				if(matches.left[likeKey])
					matches.left[likeKey]++;
				else 
					matches.left[likeKey] = 1;
				
				continue;
			}
			
			if(rightWing[likeKey] != undefined) {
				if(matches.right[likeKey])
					matches.right[likeKey]++;
				else 
					matches.right[likeKey] = 1;
				
				continue;
			}
		}
	}	
	
	return matches;
}

function onMyLikes(e){
	//var myPosition = $()
	var myLikesOnLeft = getLikesOnLeft();
	var myLikesOnRight = getLikesOnRight();

	var totalCount = myLikesOnLeft.length + myLikesOnRight.length;

	mountList(myLikesOnLeft, myLikesOnRight);

	drawMyPosition($("#me"), myLikesOnLeft.length, myLikesOnRight.length, totalCount);
}

function getLikesOnLeft() {
	var retArray = [];
	var obj, id;

	for(var i = 0; i < myLikesData.length; i++){
		id = myLikesData[i].id;
		obj = leftWing[id];
		if(obj != undefined){
			obj = {"pageId": id, "pageName": obj.pageName};
			retArray = retArray.concat(obj);
		}
	}

	return retArray;
}

function getLikesOnRight () {
	var retArray = [];
	var obj, id;

	for(var i = 0; i < myLikesData.length; i++){
		id = myLikesData[i].id;
		obj = rightWing[id];
		if(obj != undefined){
			obj = {"pageId": id, "pageName": obj.pageName};
			retArray = retArray.concat(obj);
		}
	}

	return retArray;	
}


function onStartTest(e) {
	getPagesData();
}

function onMatchLikes(e){
	
}

function onGeMyFriendLikes(e){
	getLikesDataByID($("#friendsList").val());
	setLikesByIDList(myLikesData);
}

function onGetLikesClick(e){
	getMyLikesData();
	setLikesList(myLikesData);
}

function addPageByTag(pageKey, page){
	var tags = page.tags; 
	if(!tags)
		tags = ["untagged"];

	var obj = {pageName: pageKey, pageData: page};

	for(var i = 0; i < tags.length; i++){
		if(!pagesByTags[tags[i]])
			pagesByTags[tags[i]] = [obj];
		else
			pagesByTags[tags[i]] = pagesByTags[tags[i]].concat(obj);
	}
}

function mountDataArray(){
	var page, pageKey;

	for(var i = 0; i < trackedPagesKeys.length; i++){
		pageKey = trackedPagesKeys[i];
		page = trackedPages[trackedPagesKeys[i]];
		addPageByTag(pageKey, page);
	}

	separateWingData();
	mountMap();	
}

function separateWingData() {
	var absoluteLeftData = pagesByTags["Esquerda"].concat(pagesByTags["anti-antiPT"]);
	var absoluteRightData = pagesByTags["Direita"].concat(pagesByTags["anti-PT"]);

	var pageObject;

	// leftData
	for(var i = 0; i < absoluteLeftData.length; i++){
		pageObject = absoluteLeftData[i];
		if(pageObject.pageData.fb_id)
			leftWing[pageObject.pageData.fb_id] = {pageName: pageObject.pageName};
	}

	// rightData
	for(var i = 0; i < absoluteRightData.length; i++){
		pageObject = absoluteRightData[i];
		if(pageObject.pageData.fb_id)
			rightWing[pageObject.pageData.fb_id] = {pageName: pageObject.pageName};	
	}
}


/*normal Helpers*/

function max(i, j){
	if (i > j) 
		return i;
	return j;
}