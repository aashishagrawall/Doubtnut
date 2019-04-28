angular.module('matchesController', []).controller('matchesController', function ($scope, Contact) {

    $scope.fetchMatchesData = function () {
        Contact.fetchAllMatches().then(function (response) {
            // console.log(data);
            if (response.data.status.code == 0) {
                $scope.matches = response.data.matches;
                $scope.setResult();
            } else { 
                alert(response.data.err);
            }

        });

    };

    $scope.setResult = function(){
        $scope.liveMatches = [];
        $scope.playedMatches = [];
        $scope.comingMatches = [];
        $scope.matches.forEach(function(match){
            if(match.status === 'ongoing') {
                $scope.liveMatches.push(match);
            } else if(match.status === 'completed'){
                $scope.playedMatches.push(match);
            } else {
                $scope.comingMatches.push(match);
            }
        });
         
    };




});