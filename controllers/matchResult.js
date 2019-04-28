var fs = require('fs');
var _ = require('lodash');
var models = require('../models/models');


function getPlayingTeam(match) {
    if(!match.tossWinner){
        return 'team_1';
    }
    if (match.tossWinner.name == match.team_1.name) {
        if (match.tossWinnerSelection == 'bat') {
            return match.currentInnings == 1 ? 'team_1' : 'team_2';
        } else if (match.tossWinnerSelection == 'bowl') {
            return match.currentInnings == 2 ? 'team_2' : 'team_1';
        }
    } else if (match.tossWinner.name == match.team_2.name) {
        if (match.tossWinnerSelection == 'bat') {
            return match.currentInnings == 1 ? 'team_2' : 'team_1';
        } else if (match.tossWinnerSelection == 'bowl') {
            return match.currentInnings == 2 ? 'team_1' : 'team_2';
        }
    }
}

async function addPlayerScore(match, player){
    let score = await models.Ball.aggregate([
        {
            $match: {
                matchId: match._id,
                striker: player._id
            }
        },
        {
            $group: {
                _id: player.name,
                runs: {$sum: '$runScored'},
                balls: {$sum: 1}
            }
        }
    ]);
    console.log(score);
    return score[0] || {runs: 0, balls: 0};
}

async function addCurrentBatsManScore(finalMatch, team){
    let balls = team.ball;
    let striker = balls.striker;
    let nonStriker = balls.nonStriker;
    striker.score = await addPlayerScore(finalMatch, striker);
    nonStriker.score = await addPlayerScore(finalMatch, nonStriker);
    return balls;
}


function addScoreToTeam(team, match, fieldName){
    let balls = match[fieldName];
    team.ball = balls;
    if(balls){
        team.hasBat = true;
        team.totalScore = balls.totalRun;
        team.totalWickets = balls.totalWicket;
        team.overNumber =  balls.overId ? balls.overId.overNumber : 0;
        team.ballNumber = balls.ballNumber;
    } else {
        team.hasBat = false
    }
}

async function addExtras(match, playingTeam) {
    let overs = await models.Over.find({
        matchId: match._id,
        battingTeam: playingTeam._id
    });
    let extrasPromiseArr = _.map(overs,(over) => {
        return models.Ball.find({
            overId: over._id,
            extrasScored: {$gt: 0}
        }, 'extrasScored extraReason');
    });
    let extras = await Promise.all(extrasPromiseArr);
    let arr = [];
    _.each(extras, (extra)=>{
        _.each(extra, (ex) => {
            arr.push(ex);
        });
    });
    return arr;
}

async function addBallsToOvers(playingTeam){
    let ball = playingTeam.ball;
    let over = ball.overId;
    let balls = await models.Ball.find({
        overId : over._id
    });
    over.balls = balls;
}   
let getMatchScore = async function (matchId, addScore) {
    try {
        let finalMatch = await models.Match.findOne({ _id: matchId })
            .populate('team_1')
            .populate('team_2')
            .populate('venue')
            .populate('subTournament')
            .populate('tossWinner')
            .populate('matchWinner')
            .populate('manoftheMatch')
            .populate({
                path: 'currentBall_team1',
                populate: {
                    path: 'overId striker nonStriker',
                    populate: {
                        path: 'bowler'
                    }
                }
            })
            .populate({
                path: 'currentBall_team2',
                populate: {
                    path: 'overId striker nonStriker',
                    populate: 'bowler'
                }
            });

        finalMatch = finalMatch.toJSON();
        let playingTeamName = getPlayingTeam(finalMatch);

        let team_1 = _.clone(finalMatch.team_1);
        let team_2 = _.clone(finalMatch.team_2);

        addScoreToTeam(team_1, finalMatch, 'currentBall_team1');
        addScoreToTeam(team_2, finalMatch, 'currentBall_team2');
        let playingTeam, opponentTeam;
        
        if(playingTeamName == 'team_1'){
            playingTeam = team_1;
            opponentTeam = team_2;
        } else {
            playingTeam = team_2;
            opponentTeam = team_1;
        }

        if(finalMatch.matchWinner){
            finalMatch.result = {
                won: finalMatch.matchWinner.name,
                by: finalMatch.winBy.score + finalMatch.winBy.winName
            }
        }
        let extras = [];
        if(addScore && playingTeam.ball){
            playingTeam.ball = await addCurrentBatsManScore(finalMatch, playingTeam);
            await addBallsToOvers(playingTeam);
            extras = await addExtras(finalMatch, playingTeam);
        }
       
        delete finalMatch.currentBall_team1;
        delete finalMatch.currentBall_team2;

        finalMatch.currentStatus = {
            totalScore: playingTeam.totalScore || 0,
            totalWickets: playingTeam.totalWickets || 0,
            overNumber: (playingTeam.ball && playingTeam.ball.overId.overNumber) || 0,
            ballNumber: (playingTeam.ball && playingTeam.ball.ballNumber) || 0,
            playingTeam : playingTeam,
            opponentTeam: opponentTeam,
            balls: playingTeam.ball,
            extras: extras
        }
        delete playingTeam.ball;


        return finalMatch;


    } catch (err) {
        throw err;

    }
};


exports.getMatchScoreSingle = async function(req, res){
    var matchId = req.params.id;
    try {
        let data = await getMatchScore(matchId, true);
        res.json({
            status: {
                code: 0,
                message: 'success'
            },
            match: data
        });
    } catch(err) {
        res.json({
            err: err,
            stack: err.stack
        })
    }
}



exports.getMatchesList = async function(req, res){
    var matchId = req.params.id;
    try {
        let matches = await models.Match.find({});
        let finalMatchesPromiseArr = _.map(matches, (match) => {
            return getMatchScore(match._id);
        });
        finalMatches = await Promise.all(finalMatchesPromiseArr);
        res.json({
            status: {
                code: 0,
                message: 'success'
            },
            matches: finalMatches
        });
    } catch(err) {
        res.json({
            err: err.message,
            stack: err.stack
        })
    }
}

exports.getMatchScore = getMatchScore;