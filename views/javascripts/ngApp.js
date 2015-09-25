/**
 * Created by HUQ on 9/22/15.
 */
"use strict";

var ngApp = angular.module('haven-sent', ['ui.router']);
console.log("ngApp is running");

ngApp.constant('constants', {
  apiUrl: 'http://localhost:3000'
});

var friendUnderConsideration;

ngApp.config(function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/');

  $stateProvider
      .state('friendInput', {
        url: '/friends',
        templateUrl: 'templates/friendInput.html',
        controller: 'FriendCtrl'
      })
      .state('familyInput', {
        url: '/families',
        templateUrl: 'templates/familyInput.html',
        controller: "FamilyCtrl"
      })
      .state('match', {
        url: '/match',
        templateUrl: 'templates/match.html',
        controller: "MatchCtrl"
      });
  //.state('friend', {
  //      abstract: true,
  //      templateUrl: 'views/friends/friends.html'
  //    });
  //    .state('friend.add', {
  //      templateUrl: 'views/friends/add.html'
  //    })
  //.state('friends.find', {
  //      templateUrl: 'views/friends/find.html'
  //    })

});


ngApp.controller('FriendCtrl', function($scope, $http, $state, Friend) {
  $scope.title = "Find and Add a friend";

  var buttonNum;
  $scope.receiveClick = function(id) {
    buttonNum = id;
    console.log("Button Shown!");
  };

  $scope.reveal = function (id) {
    return buttonNum == id;
  };


  $scope.selectFriendToMatch = function($event, thisFriend) {
    friendUnderConsideration = thisFriend;
    console.log("matchingpet:", thisFriend);
    $state.go('familyInput');
    $event.stopPropagation();

  };

  Friend.showAll()
    .then(function(res) {
      console.log("All friends loaded");
      $scope.allFriends = res.data;
    })
    .catch(function(error) {
      console.log(error);
    });

  $scope.addFriend = function () {
    console.log("add that friend!");

    Friend.add($scope.friend)
      .then(function(res) {
          $scope.newFriend = res.data;
          $scope.friend = {};
      })
      .catch(function(error){
        $scope.newFriend = error;
      })
    };

});


ngApp.controller('FamilyCtrl', function($scope, $http, Family) {
  $scope.title = "Find and Add a Family";

  var buttonNum;

  $scope.friend = friendUnderConsideration;

  $scope.isSelectingMatch = function() {
    return friendUnderConsideration;
  };
  $scope.cancelMatch = function () {
    friendUnderConsideration = null;
  };

  //TODO: we use these following two functions two times,
  //is it possible to make a factory?
  $scope.receiveClick = function(id) {
    buttonNum = id;
    console.log("Button Shown!");
  };

  $scope.reveal = function (id) {
    return buttonNum == id;
  };



  $scope.matchFriendToFamily = function($event, item) {
    console.log("Match Made!");
    $event.stopPropagation();
    console.log(item._id, friendUnderConsideration._id);
    if (friendUnderConsideration) {
      Family.match(item._id, friendUnderConsideration._id)
      .then(function(res) {
            $scope.family = {};
            console.log(res.data);
            //TODO: get here
          })
      .catch(function(err){
            console.log(err);
          });
      friendUnderConsideration = null;
    } else
      $scope.noFriend = "There is no friend to Match";
  };

  Family.showAll()
      .then(function(res) {
        console.log("All family loaded");
        $scope.allFamilies = res.data;
      })
      .catch(function(error) {
        console.log(error);
      });

  $scope.addFamily = function () {
    console.log("add that family!");

    Family.add($scope.family)
        .then(function(res) {
          $scope.newFamily = res.data;
          $scope.family = {};
        })
        .catch(function(error){
          $scope.newFamily = error;
        })
  };

});



ngApp.controller('MatchCtrl', function($scope, $http, Family) {
  console.log("This is the MatchCtrl talking");




  //
  //$scope.addFriend = function () {
  //  console.log("make that match!");
  //  $http.post('http://localhost:3000/friends', $scope.friend)
  //      .then(function(data) {
  //        $scope.dump = data;
  //      })
  //      .catch(function(error){
  //        $scope.dump = error;
  //      })
  //};


});


ngApp.service('Friend', function($http, constants) {
  let api = constants.apiUrl;
  this.showAll = function(){return $http.get(api + '/friends');};
  this.add = function(params) {return $http.post(api + '/friends', params);};
});

ngApp.service('Family', function($http, constants) {
  let api = constants.apiUrl;
  this.showAll = function(){return $http.get(api + '/families');};
  this.add = function(params) {return $http.post(api + '/families', params);};
  this.match = function(familyId, friendId) {return $http.put(api + '/match/' + familyId + '/' + friendId )}
});



  //  $scope.addTickerToTracked = (ticker) => {
  //    console.log(ticker);
  //    Tracked.add(ticker);//.then((data)=>console.log('data', data));
  //  };
  //
  //  $scope.tickerFinder = "";
  //
  //  $scope.isAddingTicker = () => {
  //    return $scope.displayedTicker !== undefined && ($scope.tickerFinder ===  "");
  //  };
  //
  //
  //  $scope.tickerDisplay = (tickerData) => {
  //    $scope.displayedTicker = tickerData;
  //    $scope.tickerFinder = "";
  //  };
  //
  //  $scope.tickerData = {Symbol: ""};
  //
  //
  //  $scope.searchTicker = () => {
  //
  //    var ticker = $scope.tickerFinder;
  //    ticker = ticker.toUpperCase();
  //    var url = "http://dev.markitondemand.com/Api/v2/Lookup/jsonp?input=" + ticker + "&callback=JSON_CALLBACK";
  //    $http.jsonp(url).success((data) => {
  //      console.log("searchies!!!");
  //      $scope.tickerData = data;
  //    });
  //  };
  //
  //}));

