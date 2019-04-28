angular.module('matchMainController', []).controller('matchMainController', function ($scope, Contact) {

    var matchId = window.location.pathname.split('/').slice(-1)[0]
    
    $scope.fetchMatchData = function () {
        $scope.activePanel = 'panel1';
        Contact.getSingleMatch(matchId).then(function(response){
            if (response.data.status.code == 0) {
                $scope.match = response.data.match;
                $scope.setResult();
            } else { 
                alert(response.data.err);
            }
        });
    };

    $scope.setResult = function(){
        $scope.match.Scorecard = [
            {
                'name': 'RCB',
                'hasBat': true,
                'hasBall': true,
                'batScoreCard' : [
                    {
                        name: 'Dhoni',
                        runs: 78,
                        balls: 98,
                        hasBat: true,
                        out: true
                    },
                    {
                        name: 'loda',
                        runs: 78,
                        balls: 98,
                        hasBat: true,
                        out: true
                    },
                    {
                        name: 'lehsin',
                        runs: 78,
                        balls: 98,
                        hasBat: true,
                        out: true
                    },
                    {
                        name: 'hkjg',
                        runs: 78,
                        balls: 98,
                        hasBat: true,
                        out: false
                    },
                    {
                        name: 'dds',
                        runs: 78,
                        balls: 98,
                        hasBat: true,
                        out: false
                    },
                    {
                        name: 'hkjg',
                        runs: 78,
                        balls: 98,
                        hasBat: false,
                        out: false
                    },
                    {
                        name: 'hkjg',
                        runs: 78,
                        balls: 98,
                        hasBat: false,
                        out: false
                    },
                    {
                        name: 'hkjg',
                        runs: 78,
                        balls: 98,
                        hasBat: false,
                        out: false
                    }
                ],
                'ballScoreCard': [
                    {
                        name: 'hkjg',
                        runs: 78,
                        overs: 8
                    },
                    {
                        name: 'hkjg',
                        runs: 78,
                        overs: 8
                    },
                    {
                        name: 'hkjg',
                        gaveRuns: 78,
                        overs: 8
                    },
                    {
                        name: 'hkjg',
                        runs: 78,
                        overs: 8
                    },
                    {
                        name: 'hkjg',
                        gaveRuns: 78,
                        overs: 8
                    },
                    {
                        name: 'hkjg',
                        runs: 78,
                        overs: 8
                    }
                ]
            },
            {
                'name': 'Delhi',
                'hasBat': true,
                'hasBall': true,
                'batScoreCard' : [
                    {
                        name: 'Dhoni',
                        runs: 78,
                        balls: 98,
                        hasBat: true,
                        out: true
                    },
                    {
                        name: 'loda',
                        runs: 78,
                        balls: 98,
                        hasBat: true,
                        out: true
                    },
                    {
                        name: 'lehsin',
                        runs: 78,
                        balls: 98,
                        hasBat: true,
                        out: true
                    },
                    {
                        name: 'hkjg',
                        runs: 78,
                        balls: 98,
                        hasBat: true,
                        out: false
                    },
                    {
                        name: 'dds',
                        runs: 78,
                        balls: 98,
                        hasBat: true,
                        out: false
                    },
                    {
                        name: 'hkjg',
                        runs: 78,
                        balls: 98,
                        hasBat: false,
                        out: false
                    },
                    {
                        name: 'hkjg',
                        runs: 78,
                        balls: 98,
                        hasBat: false,
                        out: false
                    },
                    {
                        name: 'hkjg',
                        runs: 78,
                        balls: 98,
                        hasBat: false,
                        out: false
                    }
                ],
                'ballScoreCard': [
                    {
                        name: 'hkjg',
                        gaveRuns: 78,
                        overs: 8
                    },
                    {
                        name: 'hkjg',
                        gaveRuns: 78,
                        overs: 8
                    },
                    {
                        name: 'hkjg',
                        gaveRuns: 78,
                        overs: 8
                    },
                    {
                        name: 'hkjg',
                        runs: 78,
                        overs: 8
                    },
                    {
                        name: 'hkjg',
                        runs: 78,
                        overs: 8
                    },
                    {
                        name: 'hkjg',
                        runs: 78,
                        overs: 8
                    }
                ]
            }
        ]
    };

    $scope.setActivePanel= function(panel){
        $scope.activePanel = panel;
    };

    var setSocket = function(){
        var socket = io.connect('/');
        socket.on('hello', function(data){
            console.log(data);
        });
        socket.on(matchId, function(data){
            console.log(data);
            setTimeout(function(){
                $scope.$apply(function(){
                    $scope.match = data

                })
            },200)
            //$scope.match = data
        });
    }

    setSocket();
});