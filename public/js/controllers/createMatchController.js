angular.module('createMatchController', []).controller('createMatchController', function ($scope, Contact) {

    var sortableFirstTeam;
    var sortableSecondTeam;

    $scope.fetchAllTeams = function () {
        Contact.fetchAllTeams().then(function (data) {
            // console.log(data);
            if (data.data.status == 1) {
                $scope.teams = data.data.teams;
            }
        })

    }

    $scope.fetchTeamPlayer = function (id, who) {
        console.log(who);
        Contact.fetchAllTeamPlayers(id).then(function (data) {
            if (data.data.status == 1) {
                console.log(data);
                data.data.teams.forEach(function(item){
                    item.battingPositon=0;
                    item.playingAs=[];
                })
                if (who == "firstTeam") {
                    $scope.firstTeamPlayers = data.data.teams;
                } else {
                    $scope.secondTeamPlayers = data.data.teams;
                }

            }

        })


    }

    $scope.fetchVenues=function(){
        Contact.fetchAllVenues().then(function (data) {
            if (data.data.status == 1) {
                $scope.matchVenues=data.data.venues;

            }

        })


    }
    $scope.CreateMatch=function(){
        var team_1_players=[];
       $scope.firstTeamPlayers.forEach(function(player){
            team_1_players.push({playerId:player._id,playingAs:player.playingAs,battingPositon:player.battingPositon});

        })
        var team_2_players=[];
       $scope.secondTeamPlayers.forEach(function(player){
            team_2_players.push({playerId:player._id,playingAs:player.playingAs,battingPositon:player.battingPositon});

        })

        let createMatchObject={
            team_1:$scope.firstTeam,
            team_2:$scope.secondTeam,
            venue:$scope.matchVenue,
            matchType:$scope.matchType,
            team_1_players:team_1_players,
            team_2_players:team_2_players
        }
    
         Contact.createMatch({match:createMatchObject } ).then(function(data){
            console.log(data);

            if(data.data.status==1){
              
                alert("Match Created Succesfully");
            }
         })

    }

    $scope.FetchAllMatches=function(){
        console.log("here");
        Contact.FetchAllNewCreatedMatches().then(function(data){
            console.log(data);
            if(data.data.status==1){
                $scope.matches=data.data.matches;

            }else{
                alert("no newly added");
            }
        })

    }

    $scope.startCurrentMatch=function(id){
        console.log(id);
        Contact.startCurrentMatch({id:id}).then(function(data){
            console.log(data);
            if(data.data.status==1){
              //  $scope.matches=data.data.matches;
              alert("match started successfully");
              window.location.href = '/admin/match/' + id;
    

            }else{
                alert("not startted");
            }
        })


    }



});