var fs = require('fs');
var models = require('../models/models');
var app = require('../app.js');
var getMatchScore = require('./matchResult').getMatchScore;

exports.getAllPlayers = function (req, res) {
  models.Player.find({
    teamId: null
  }, function (err, data) {
    if (err) {
      res.json({
        status: 0,
        message: err
      });
      return;
    }
    res.json({
      status: 1,
      message: 'Added Successfully',
      players: data
    });

  })


}
exports.addPlayers = function (req, res) {
  let playersdata = req.body.players;

  models.Player.insertMany(playersdata, function (err, data) {
    if (err) {
      res.json({
        status: 0,
        message: err
      });
      return;
    }
    res.json({
      status: 1,
      message: 'Added Successfully'
    });

  })
}


exports.addTeamsAndplayers = function (req, res) {
  let teamsdata = req.body.teams;


  try {
    teamsdata.map(async function (team) {
      let newTeam = new models.Team(team);

      let teamAdded = await newTeam.save();

      let updatedplayersPromises = team.players.map(async (player) => {

        return await models.Player.findOneAndUpdate({
          "_id": player
        }, {
          $set: {
            "teamId": teamAdded._id
          }
        })


      })

      let updatedplayers = await Promise.all(updatedplayersPromises);
      return updatedplayers;

    })
    res.json({
      status: 1,
      message: "successfull"
    });

  } catch (err) {
    res.json({
      status: 0,
      message: err
    });

  }



}

exports.addVenue = function (req, res) {
  let venueData = req.body.venues;

  models.Venue.insertMany(venueData, function (err, data) {
    if (err) {
      res.json({
        status: 0,
        message: err
      });
      return;
    }
    res.json({
      status: 1,
      message: 'Added Successfully',
      venues: data
    });

  })

}


exports.addTournament = function (req, res) {

  let tournamentData = req.body.tournament;
  let tournamentModel = new models.Tournament(tournamentData);
  tournamentModel.save(function (err) {
    if (err) {
      res.status(500).json(err);
    } else {
      res.send({
        status: 1,
        message: " Tournament Added successfull"
      });
    }

  })



}
exports.addSubTournament = function (req, res) {
  let subTournamentData = req.body.subTournament;
  let subTournamentModel = new models.SubTournament(subTournamentData);
  subTournamentModel.save(function (err) {
    if (err) {
      res.status(500).json(err);
    } else {
      res.send({
        status: 1,
        message: " Tournament Added successfull"
      });
    }

  })


}

exports.createMatch = async function (req, res) {

  try {
    let matchData = req.body.match;

    matchData.numberOfOvers = matchData.matchType == "t20" ? 20 : 50;
    let matchModel = new models.Match(matchData);
    let matchSave = await matchModel.save();

    let team_1_playersPromise = matchData.team_1_players.map(async function (player) {
      let playerInMatchData = player;
      playerInMatchData.matchId = matchSave._id;
      let playerInMatchModel = new models.PlayerInMatch(player)
      return await playerInMatchModel.save();


    })
    let team_2_playersPromise = matchData.team_2_players.map(async function (player) {
      let playerInMatchData = player;
      playerInMatchData.matchId = matchSave._id;
      let playerInMatchModel = new models.PlayerInMatch(player)
      return await playerInMatchModel.save();


    })
    let team_1_players = await Promise.all(team_1_playersPromise);
    let team_2_players = await Promise.all(team_2_playersPromise);
    res.json({
      status: 1,
      message: "match created Successfully"
    })
  } catch (err) {
    res.json({
      status: 0,
      message: err

    })
  }
}

exports.createMatchToss = async function (req, res) {

  try {
    var matchId = req.body.matchId;
    let matchModels = await models.Match.findOne({
      _id: matchId
    });
    matchModels.tossWinner = req.body.tossWinner;
    matchModels.tossWinnerSelection = req.body.tossWinnerSelection;
    let revisedMatchModel = await matchModels.save();

    let finalMatch = await models.Match.findOne({
        _id: matchId
      })
      .populate('team_1')
      .populate('team_2')
      .populate('venue')
      .populate('subTournament')
      .populate('tossWinner')
      .populate('matchWinner')
      .populate('manoftheMatch')
      .populate('currentBall_team1')
      .populate('currentBall_team2')
    // console.log(JSON.Parse(finalMatch));

    let playersinteam = await models.PlayerInMatch.find({
      matchId: matchId
    }).populate('playerId');

    let playersInteam1 = [];
    let playersInteam2 = [];
    finalMatch = finalMatch.toJSON();
    playersinteam.forEach(function (player) {

      if (player.playerId.teamId.equals(finalMatch.team_1._id))
        playersInteam1.push(player)
      else
        playersInteam2.push(player)

    })
    finalMatch.team_1.players = playersInteam1;
    finalMatch.team_2.players = playersInteam2;



    res.json({
      status: 1,
      message: "tossAdded Successfull",
      match: finalMatch
    })
  } catch (err) {
    res.json({
      status: 0,
      message: err
    })

  }
}

exports.ballToss = async function (req, res) {
  try {
    var matchId = req.body.matchId;
    let matchModels = await models.Match.findOneAndUpdate({
      _id: matchId
    }, {
      $inc: {
        "totalnumberofballs": 1
      }
    });
    let match = matchModels.toJSON();
    let totalBalls = match.totalnumberofballs + 1;
    let OverId;
    let ballId;
    if (totalBalls % 6 == 1) {
      let overData = {
        matchId: matchId,
        battingTeam: req.body.battingTeam,
        ballingTeam: req.body.ballingTeam,
        overNumber: totalBalls % 6 == 0 ? (totalBalls / 6) : Math.floor((totalBalls / 6) + 1),
        bowler: req.body.bowler,
        currentInnings: match.currentInnings
      }
      let OverModel = new models.Over(overData);
      let OverSave = await OverModel.save();
      OverId = OverSave.toJSON()._id;
      //create new Over round

    } else {
      //query old Over

      let overData = await models.Over.findOne({
        matchId: matchId,
        overNumber: totalBalls % 6 == 0 ? totalBalls / 6 : Math.floor(totalBalls / 6) + 1,
        currentInnings:match.currentInnings
      });
      OverId = overData.toJSON()._id;
    }

    let ballData = {
      matchId: matchId,
      overId: OverId,
      ballNumber: totalBalls % 6 == 0 ? 6 : totalBalls % 6,
      striker: req.body.striker,
      nonStriker: req.body.nonStriker,
      totalRun: req.body.totalRun,
      totalWicket: req.body.totalWicket,
      runScored: req.body.runScored,
      runReson: req.body.runReson,
      extrasScored: req.body.extrasScored,
      extraReason: req.body.extraReason
    }


    let ballModel = new models.Ball(ballData);
    let ballSave = await ballModel.save();
    ballId = ballSave.toJSON()._id;

    let isWicketTaken = req.body.isWicketTaken;
    if (isWicketTaken) {
      let wicketData = {
        matchId: matchId,
        ballId: ballId,
        playerOut: req.body.playerOut,
        KindOfOut: req.body.KindOfOut,
        outBy: req.body.outBy

      }
      console.log(wicketData);

      let wicketModel = new models.Wicket(wicketData);
      let wicketSave = await wicketModel.save();



      //  let matchBallSave=await matchModels.save();



    }
 
    console.log(match);


    if (req.body.battingTeam == match.team_1._id) {
      let matchBallSave = await models.Match.findOneAndUpdate({
        _id: match._id
      }, {
        currentBall_team1: ballId
      });


    } else {
      let matchBallSave = await models.Match.findOneAndUpdate({
        _id: match._id
      }, {
        currentBall_team2: ballId
      });
    }
    let finalMatch = null;

    if (req.body.gameChange) {
      let matchupdate = await models.Match.findOneAndUpdate({
        _id: match._id
      }, {
        $set: {
          "totalnumberofballs": 0,
          "currentInnings": 2
        }
      });

      finalMatch = await models.Match.findOne({
          _id: match._id
        })
        .populate('team_1')
        .populate('team_2')
        .populate('venue')
        .populate('subTournament')
        .populate('tossWinner')
        .populate('matchWinner')
        .populate('manoftheMatch')
        .populate('currentBall_team1')
        .populate('currentBall_team2')
      // console.log(JSON.Parse(finalMatch));

      let playersinteam = await models.PlayerInMatch.find({
        matchId: match._id
      }).populate('playerId');

      let playersInteam1 = [];
      let playersInteam2 = [];
      finalMatch = finalMatch.toJSON();
      playersinteam.forEach(function (player) {

        if (player.playerId.teamId.equals(finalMatch.team_1._id))
          playersInteam1.push(player)
        else
          playersInteam2.push(player)

      })
      finalMatch.team_1.players = playersInteam1;
      finalMatch.team_2.players = playersInteam2;


    }
    res.json({
      status: 1,
      message: "successfull",
      match: finalMatch,
      gameOver: req.body.gameOver

    });
    let socket = app.getSocketInstance();
    let data = await getMatchScore(matchId, true);
    socket.emit(matchId, data);
  } catch (err) {
    console.log(err);
    res.json({
      status: 0,
      message: err
    })

  }






}

exports.fetchAllTeams = function (req, res) {
  models.Team.find({}, function (err, data) {
    if (err) {
      res.json({
        status: 0,
        message: err
      });
      return;
    }
    console.log(data);
    res.json({
      status: 1,
      message: ' team Added Successfully',
      teams: data
    });

  })

}

exports.fetchAllTeamPlayers = function (req, res) {
  models.Player.find({
    teamId: req.params.id
  }, function (err, data) {
    if (err) {
      res.json({
        status: 0,
        message: err
      });
      return;
    }
    console.log(data);
    res.json({
      status: 1,
      message: ' player eceived successfully Successfully',
      teams: data
    });

  })

}
exports.fetchAllVenues = function (req, res) {
  models.Venue.find({}, function (err, data) {
    if (err) {
      res.json({
        status: 0,
        message: err
      });
      return;
    }
    console.log(data);
    res.json({
      status: 1,
      message: ' venue eceived successfully Successfully',
      venues: data
    });

  })

}

exports.FetchAllNewCreatedMatches = function (req, res) {
  models.Match.find({
    status: "will play"
  }).populate('team_1').populate('team_2').exec(function (err, data) {
    console.log(data);
    if (err) {
      res.json({
        status: 0,
        message: err
      });
      return;
    }
    console.log(data);
    res.json({
      status: 1,
      message: ' Matches eceived successfully Successfully',
      matches: data
    });


  })
}

exports.startCurrentMatch = async function (req, res) {

  try {
    let findMatch = await models.Match.findOne({
      _id: req.body.id
    });
    findMatch.status = "ongoing";
    let startMatch = await findMatch.save();
    res.json({
      status: 1,
      message: ' Matches started successfully',
    });

  } catch (err) {
    res.json({
      status: 0,
      message: err
    });

  }
}

exports.FetchAllMatchDetails = async function (req, res) {
  try {
    var matchId = req.params.id;


    let finalMatch = await models.Match.findOne({
        _id: matchId
      })
      .populate('team_1')
      .populate('team_2')
      .populate('venue')
      .populate('subTournament')
      .populate('tossWinner')
      .populate('matchWinner')
      .populate('manoftheMatch')
      .populate('currentBall_team1')
      .populate('currentBall_team2')
    // console.log(JSON.Parse(finalMatch));

    let playersinteam = await models.PlayerInMatch.find({
      matchId: matchId
    }).populate('playerId');

    let playersInteam1 = [];
    let playersInteam2 = [];
    finalMatch = finalMatch.toJSON();
    playersinteam.forEach(function (player) {

      if (player.playerId.teamId.equals(finalMatch.team_1._id))
        playersInteam1.push(player)
      else
        playersInteam2.push(player)

    })
    finalMatch.team_1.players = playersInteam1;
    finalMatch.team_2.players = playersInteam2;



    res.json({
      status: 1,
      message: "tossAdded Successfull",
      match: finalMatch
    })
  } catch (err) {
    res.json({
      status: 0,
      message: err
    })

  }


}