angular.module('adminMatchCtrl', []).controller('adminMatchController', function ($scope,Contact) {
let params;
$scope.isWicketTaken="false";
var whosBatting="team1";
$scope.currentScore={};
$scope.currentScore.totalRun=0;
$scope.currentScore.totalWicket=0;

$scope.runScored=0;
$scope.extrasScored=0;
$scope.totalBalls=0;



    $scope.fetchmatchDetails=function(){
      
        params=window.location.pathname.split('/');
        console.log(params[params.length-1]);
    

        Contact.FetchAllMatchDetails(params[params.length-1]).then(function(data){
            console.log(data);
            if(data.data.status==1){
                $scope.matchData=data.data.match;
                evaluateBattingAndBowlingTeam();
                if(whosBatting=="team1")
                $scope.currentScore= $scope.matchData.currentBall_team1 ?  $scope.matchData.currentBall_team1 :$scope.currentScore;
                else
                $scope.currentScore=  $scope.matchData.currentBall_team2 ?  $scope.matchData.currentBall_team2 :$scope.currentScore;

                $scope.totalBalls=$scope.matchData.totalnumberofballs;

                

            }

        })
    }

    $scope.SubmitTossData=function(){

        Contact.SubmitTossData({
            matchId:params[params.length-1],
            tossWinner:$scope.tossWinner,
            tossWinnerSelection:$scope.tossWinnerSelection
        }).then(function(data){
            console.log(data);
            if(data.data.status==1){
                $scope.matchData=data.data.match;

                evaluateBattingAndBowlingTeam();
                if(whosBatting=="team1")
                $scope.currentScore= $scope.matchData.currentBall_team1 ?  $scope.matchData.currentBall_team1 :$scope.currentScore;
                else
                $scope.currentScore=  $scope.matchData.currentBall_team2 ?  $scope.matchData.currentBall_team2 :$scope.currentScore;

                $scope.totalBalls=$scope.matchData.totalnumberofballs;
                
         

            }

        })
    }

    function evaluateBattingAndBowlingTeam(){
        console.log($scope.matchData.tossWinner._id==$scope.matchData.team_1._id)
        if($scope.matchData.tossWinnerSelection=="bat" && $scope.matchData.currentInnings==1 ){
            if($scope.matchData.tossWinner._id==$scope.matchData.team_1._id){
                whosBatting="team1";
            $scope.battingTeam=$scope.matchData.team_1;
            $scope.ballingTeam=$scope.matchData.team_2;
        }else{
            whosBatting="team2";
            $scope.battingTeam=$scope.matchData.team_2;
            $scope.ballingTeam=$scope.matchData.team_1;

        }
        }
        else if($scope.matchData.tossWinnerSelection=="ball" && $scope.matchData.currentInnings==1){
            if($scope.matchData.tossWinner._id==$scope.matchData.team_1._id){
                whosBatting="team2";
                $scope.battingTeam=$scope.matchData.team_2;
                $scope.ballingTeam=$scope.matchData.team_1;
            }else{
                whosBatting="team1";
                $scope.battingTeam=$scope.matchData.team_1;
                $scope.ballingTeam=$scope.matchData.team_2;
    
            }
        }
        else if($scope.matchData.tossWinnerSelection=="bat" && $scope.matchData.currentInnings==2){
            if($scope.matchData.tossWinner._id==$scope.matchData.team_1._id){
                $scope.battingTeam=$scope.matchData.team_2;
                whosBatting="team2";
                $scope.ballingTeam=$scope.matchData.team_1;
            }else{
                whosBatting="team1";
                $scope.battingTeam=$scope.matchData.team_1;
                $scope.ballingTeam=$scope.matchData.team_2;
    
            }
        }else{
            if($scope.matchData.tossWinner._id==$scope.matchData.team_1._id){
                whosBatting="team1";
                $scope.battingTeam=$scope.matchData.team_1;
                $scope.ballingTeam=$scope.matchData.team_2;
            }else{
                whosBatting="team2";
                $scope.battingTeam=$scope.matchData.team_2;
                $scope.ballingTeam=$scope.matchData.team_1;
    
            }

        }

        console.log(  $scope.battingTeam,  $scope.ballingTeam)


    }

    $scope.submitMatchStatus=function(){
       let gameChange=false;
       let gameOver=false;
        if((($scope.totalBalls+1)/6)==$scope.matchData.numberOfOvers)
        {
            gameChange=true;
            alert(" Game Over ! Now next team will bat")


        }else if(($scope.totalBalls*6)==$scope.matchData.numberOfOvers && $scope.matchData.currentInnings==2){
            alert(" After this game will be over")
            gameOver=true;

        }
        var postData={
            matchId:params[params.length-1],
            battingTeam:$scope.battingTeam._id,
            ballingTeam:$scope.ballingTeam._id,
            bowler:$scope.bowler,
            striker:$scope.striker,
            nonStriker:$scope.nonStriker,
            totalRun:$scope.currentScore.totalRun + $scope.runScored + $scope.extrasScored ,
            totalWicket:$scope.currentScore.totalWicket + ($scope.isWicketTaken=="false" ? 0 :1),
            runScored:$scope.runScored,
            runReson:$scope.runReson,
            extrasScored:$scope.extrasScored,
            extraReason:$scope.extraReason,
            isWicketTaken:$scope.isWicketTaken=="false"?false:true,
            playerOut:$scope.playerOut,
            KindOfOut:$scope.KindOfOut,
            outBy:$scope.outBy,
            gameChange:gameChange
        }

        Contact.ballToss(postData).then(function(data){

            if(gameOver==true){
                alert('All over');
                return;

            }
            alert(data.data.message);
        console.log(data);
            if(data.data.status==1){
                console.log(data);
                if(gameChange){
                    $scope.matchData=data.data.match;

                evaluateBattingAndBowlingTeam();
                $scope.currentScore.totalRun=0;
$scope.currentScore.totalWicket=0;
            

                $scope.totalBalls=$scope.matchData.totalnumberofballs;

                }else{
                setTimeout(function(){
                    $scope.$apply(function(){
                        $scope.currentScore.totalRun=postData.totalRun;
                        $scope.currentScore.totalWicket=postData.totalWicket;
                        $scope.totalBalls+=1;
                    })

                },500)
            }
             

               
            }

        })
    }

 

});