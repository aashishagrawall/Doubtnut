var path = require('path');
module.exports = function(app) {
	var controller = require('../controllers/contact');
	var matchController = require('../controllers/matchResult');
	console.log(controller);

	// server routes ===========================================================
	// handle things like api calls
	// authentication routes
	app.route('/api/addPlayers').post(controller.addPlayers);
	app.route('/api/addTeamAndPlayers').post(controller.addTeamsAndplayers);
	app.route('/api/addVenues').post(controller.addVenue);
	app.route('/api/addTournament').post(controller.addTournament);
	app.route('/api/addSubTournament').post(controller.addSubTournament);
	app.route('/api/createMatch').post(controller.createMatch);
	app.route('/api/createMatchToss').post(controller.createMatchToss);
	app.route('/api/ballToss').post(controller.ballToss);
	app.route('/api/getAllPlayers').get(controller.getAllPlayers);
	app.route('/api/fetchAllTeams').get(controller.fetchAllTeams);
	app.route('/api/fetchAllTeamPlayers/:id').get(controller.fetchAllTeamPlayers);
	app.route('/api/fetchAllVenues').get(controller.fetchAllVenues);
	app.route('/api/FetchAllNewCreatedMatches').get(controller.FetchAllNewCreatedMatches);
	app.route('/api/startCurrentMatch').post(controller.startCurrentMatch);

	app.route('/api/FetchAllMatchDetails/:id').get(controller.FetchAllMatchDetails);

	app.route('/api/match/:id').get(matchController.getMatchScoreSingle);
	app.route('/api/matches').get(matchController.getMatchesList);

		// frontend routes =========================================================
	// route to handle all angular requests
    app.get('*', function(req, res) {
		
		res.sendFile(path.resolve(__dirname, '../public/index.html'));
	});




};