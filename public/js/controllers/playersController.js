angular.module('playerCtrl', []).controller('playersController', function($scope,Contact) {


	$scope.playersData=[];
	$scope.venuesData=[];
	$scope.teamsData=[];





	$scope.AddPlayers=function(){
		$scope.playersData.push({
			name:$scope.playerName,
			playerRole:$scope.playerRole
		})
		$scope.playerName="";
		$scope.playerRole=[];


	}

	$scope.SubmitPlayers=function(){
		console.log(	$scope.playersData);

		Contact.addPlayers({players:$scope.playersData}).then(function(data){
			if(data.data.status==1){
				alert("Players Added Successfully");

			}


		})
	}
	$scope.AddVenues=function(){
		$scope.venuesData.push({
			stadiumName:$scope.stadiumName,
			city:$scope.city
		})
		$scope.stadiumName="";
		$scope.city="";


	}

	$scope.SubmitVenues=function(){

		Contact.addVenues({venues:$scope.venuesData}).then(function(data){
			if(data.data.status==1){	
				alert("Venues Added Successfully")	
			}
		})
	}

	$scope.GetAllPlayers=function(){
		Contact.getAllPlayers().then(function(data){
			if(data.data.status==1){	
			 $scope.allPlayers=data.data.players;
		//	 console.log(	 $scope.allPlayers);
			}
		})

	}
	$scope.changeCaptainPlayers=function(){
		$scope.captainsPlayers=[];
		
		 $scope.teamPlayers.forEach(element => {
			// console.log(element);

			$scope.allPlayers.forEach(player=>{

				if(player._id==element)
				$scope.captainsPlayers.push(player);

			})

			 
		 });
		 
	}

	$scope.AddTeams=function(){
		let teamsdata={
			name:$scope.teamName,
			country:$scope.teamCountry,
			owner:$scope.teamOwner,
			coach:$scope.teamCoach,
			captain:$scope.teamCaptain,
			players:$scope.teamPlayers,

		}


		$scope.teamsData.push(teamsdata);
		$scope.teamName="";
		$scope.teamCountry="";
$scope.teamOwner="";
	$scope.teamCoach="";
		$scope.teamCaptain="";
		$scope.teamPlayers=[];


		let randomarray=[];
	
		console.log(	$scope.captainsPlayers);
	
		var x;

		 for(let i=0;i<$scope.allPlayers.length;i++){
			 x=1;
			 for(let j=0;j<$scope.captainsPlayers.length;j++){

			 if($scope.allPlayers[i]._id==$scope.captainsPlayers[j]._id){
			 x=0;
			 break;
			}



		 }
		 if(x==1)
		 randomarray.push($scope.allPlayers[i]);
			
		}
	
		$scope.allPlayers=randomarray;
		$scope.captainsPlayers=[];

	console.log($scope.teamsData);

	}


	$scope.SubmitTeams=function(){
		Contact.submitTeams({teams:$scope.teamsData}).then(function(data){
			if(data.data.status==1){	
	      alert("teams added successfully");

			}
		})

	}


//for view all messages button
	$scope.viewallMessages=function(){
		window.open('/messages');
	}




});