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

	console.log(matchedLikes);
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

function createMyPosition() {

	var politicalMap = $("#politicalMap");
	var bubbles = $(".bubbleWrapper");

	var x = $(bubbles[0]).width();
	var y = $(bubbles[1]).width();
	var z = politicalMap.width();
	var h = z - (x + y);

	var pos0 = h/2; 

	var me = $("<div id='me'>").addClass("point");

	politicalMap.append(me);
}

function onMyLikes(e){
	//var myPosition = $()

	createMyPosition();

	var myLikesOnLeft = getLikesOnLeft();
	var myLikesOnRight = getLikesOnRight();

	var totalCount = myLikesOnLeft.length + myLikesOnRight.length;

	var leftPages = $("#leftPages");
	var rightPages = $("#rightPages");

	leftPages.empty();
	rightPages.empty();
	
	var newItem, pageItem;

	for(var i = 0; i < myLikesOnLeft.length; i++){
		newItem = $("<li>").addClass("pageItem");
		pageItem = myLikesOnLeft[i];
		newItem.append(pageItem["pageName"]);
		leftPages.append(newItem);
	}

	for(var i = 0; i < myLikesOnRight.length; i++){
		newItem = $("<li>").addClass("pageItem");	
		pageItem = myLikesOnRight[i];
		newItem.append(pageItem["pageName"]);
		rightPages.append(newItem);
	}
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

function mountMap() {
	var rightDiv = $("#rightWing");
	var leftDiv  = $("#leftWing");
	var map = $("#testWrapper");
	var startButton = $("#startTestButton");

	var rightSize = Object.keys(rightWing).length;
	var leftSize = Object.keys(leftWing).length;

	rightDiv.css({"width": rightSize + "px", "height": rightSize + "px", "border-radius" : (rightSize / 2) + "px"})
	leftDiv.css({"width": leftSize + "px", "height": leftSize + "px", "border-radius" : (leftSize / 2) + "px"})

	map.css("display", "block");
	startButton.css({"display": "none"});
}