angular.module('contactService', []).factory('Contact', ['$http', function($http) {
	var baseUri = '';
	return {
			getAllPlayers : function() {
				return $http.get('/api/getAllPlayers');
			},
			addPlayers:function(details){
				return $http.post('/api/addPlayers',details)
			},
			addVenues:function(details){
				return $http.post('/api/addVenues',details)
			},
			submitTeams:function(details){
				return $http.post('/api/addTeamAndPlayers',details);
			},
			fetchAllTeams:function(){
				return $http.get('/api/fetchAllTeams');
			},
			fetchAllTeamPlayers:function(details){
				return $http.get('/api/fetchAllTeamPlayers/'  + details)
			},
			fetchAllVenues:function(){
				return $http.get('/api/fetchAllVenues')
			},
			createMatch:function(details){
				return $http.post('/api/createMatch',details)
			},
			FetchAllNewCreatedMatches:function(){
				return $http.get('/api/FetchAllNewCreatedMatches')

			},
			FetchAllMatchDetails:function(details){
				console.log(details);
				return $http.get('/api/FetchAllMatchDetails/' + details);

			},
			startCurrentMatch:function(details){
				return $http.post('/api/startCurrentMatch',details);
			},
			SubmitTossData:function(details){
				console.log(details);
				return $http.post('/api/createMatchToss',details);
			},
			fetchAllMatches: function() {
				return $http.get('/api/matches');
			},
			getSingleMatch: function(matchId) {
				return $http.get('/api/match/'+matchId);
			},

			ballToss:function(details){
				return $http.post('/api/ballToss',details);
			}


			

			

		}

	

}]);