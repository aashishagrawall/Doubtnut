angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	$routeProvider

		
		.when('/admin/addTeams&players', {
			templateUrl: 'views/addTeamsAndPlayers.html'
		})
		.when('/home', {
			templateUrl: 'views/home.html'
		})
		.when('/admin/createMatch',{
			templateUrl: 'views/createMatch.html'
		})
		.when('/admin/match/:id',{
			templateUrl: 'views/adminMatch.html'
		})
		
		
		.when('/matches',{
			templateUrl: 'views/matches.html'

		})
		.when('/match/:id',{
			templateUrl: 'views/match.html'

		});

	
	$locationProvider.html5Mode(true);

}]);