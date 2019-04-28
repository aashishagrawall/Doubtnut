
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let Tournament = new Schema({
    name: {
        type: String
    },
    organizedBy: {
        type: String
    },
})

let SubTournament = new Schema({
    name: {
        type: String
    },
    teamsPlaying: [{
        type: Schema.Types.ObjectId,
        ref: 'Team'

    }],
    tournamnentId:{
        type:Schema.Types.ObjectId,
        ref:'Tournament'
    }

})


let Team = new Schema({
    name: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        default: "India",

    },
    owner: {
        type: String,
        default: '',
    },
    coach: {
        type: String,
        default: ''
    },
    captain: {
        type: Schema.Types.ObjectId,
        ref: 'Player',
        default: null
    }

})

let Player = new Schema({

    name: {
        type: String,
        default: ''
    },
    teamId: {
        type: Schema.Types.ObjectId,
        ref: 'Team',
        default:null
    },
    dateOfBirth: {
        type: Date,
        default: Date.now
    },
    playerRole: [{
        type: String,
        default: "batsman",
        lowercase: true,
        enum: ['batsman', 'bowler', 'wicketkeeper']

    }]
})

let Venue = new Schema({

    stadiumName: {
        type: String,
        default: 'Delhi Stadium'
    },
    city: {
        type: String,
        default: 'Delhi'
    }

})

let Match = new Schema({
    team_1: {
        type: Schema.Types.ObjectId,
        ref: 'Team'
    },
    team_2: {
        type: Schema.Types.ObjectId,
        ref: 'Team'
    },
    startDate: {
        type: Date
    },
    subTournament: {
        type: Schema.Types.ObjectId,
        ref: 'SubTournament'
    },
    venue: {
        type: Schema.Types.ObjectId,
        ref: 'Venue'
    },
    tossWinner: {
        type: Schema.Types.ObjectId,
        ref: 'Team'
    },
    tossWinnerSelection: {
        type: String,
        lowercase: true,
        enum: ['bat', 'ball']
    },
    matchWinner: {
        type: Schema.Types.ObjectId,
        ref: 'Team'
    },
    manoftheMatch: {
        type: Schema.Types.ObjectId,
        ref: 'Player'
    },
    winType: {
        type: String,
        lowercase: true,
        enum: ['chase', 'defend']

    },
    status:{
        type: String,
        lowercase: true,
        default:'will play',
        enum: ['will play', 'ongoing','completed']

    },

    isTie: {
        type: Boolean
    },
    winBy: {
        score: {
            type: Number
        },
        winName: {
            type: String,
            enum: ['runs', 'wickets']
        }
    },
    matchType: {
        type: String,
        enum: ['t20', '1day']
    },
    numberOfOvers: {
        type: Number,
        default: 0
    },
    totalnumberofballs: {
        type: Number,
        default: 0
    },
    currentInnings:{
        type:Number,
        default:1
    },
    currentBall_team1:{
        type:Schema.Types.ObjectId,
        ref:'Ball'
    },
    currentBall_team2:{
        type:Schema.Types.ObjectId,
        ref:'Ball'
    },
    




})


let Over=new Schema({
    matchId:{
        type:Schema.Types.ObjectId,
        ref:'Match'
    },
    battingTeam:{
        type:Schema.Types.ObjectId,
        ref:'Team'
    },
    ballingTeam:{
        type:Schema.Types.ObjectId,
        ref:'Team'
    },
    overNumber:{
        type:Number,
        default:1
    },
    bowler:{
        type:Schema.Types.ObjectId,
        ref:'Player'
    },
    currentInnings:{
        type:Number,
        default:1
    },



})


let Ball = new Schema({
    matchId:{
        type:Schema.Types.ObjectId,
        ref:'Match'
    },
    overId:{
        type:Schema.Types.ObjectId,
        ref:'Over'
    },
    ballNumber:{
        type:Number,
        required:true
    },
    striker:{
        type:Schema.Types.ObjectId,
        ref:'Player'

    },
    nonStriker:{
        type:Schema.Types.ObjectId,
        ref:'Player'
    },
    totalRun: {
        type: Number,
        default: 0
    },
    totalWicket: {
        type: Number,
        default: 0

    },
    runScored : {
        type: Number,
        default:0
    },
    runReson: {
        type: String,
        default:'',
        enum: ['','run', 'four', 'six']
    },
    extrasScored: {
        type: Number,
        default:0
    },
    extraReason: {
        type: String,
        default:'',
        enum: ['','noball', 'legby', 'wide']
    }

});


let Wicket=new Schema({
    matchId:{
        type:Schema.Types.ObjectId,
        ref:'Match'
    },
    ballId:{
        type:Schema.Types.ObjectId,
        ref:'Balls'
    },
    playerOut:{
        type:Schema.Types.ObjectId,
        ref:'Player'

    },
    KindOfOut:{
        type:String,
        enum:['catch','bold','lbw','runout','hitwicket']
    },
    outBy:{
        type:Schema.Types.ObjectId,
        ref:'Player'
    }







})

let PlayerInMatch=new Schema({

    matchId:{
        type:Schema.Types.ObjectId,
        ref:'Match'
    },

    playerId:{
        type:Schema.Types.ObjectId,
        ref:'Player'
    },
    playingAs:[{
        type:String,
        enum: ['bowler', 'batsman', 'wicketkeeper']
    }],
    hasPlayed:{
        type:Boolean,
        default:false
    },

    battingPositon:{
        type:Number
    }
   


})

module.exports={
    'Tournament':mongoose.model('Tournament',Tournament),
    'SubTournament':mongoose.model('SubTournament',SubTournament),
    'Team':mongoose.model('Team',Team),
    'Player':mongoose.model('Player',Player),
    'Over':mongoose.model('Over',Over),
    'Ball':mongoose.model('Ball',Ball),
    'Wicket':mongoose.model('Wicket',Wicket),
    'PlayerInMatch':mongoose.model('PlayerInMatch',PlayerInMatch),
    'Venue':mongoose.model('Venue',Venue),
    'Match':mongoose.model('Match',Match)



}


