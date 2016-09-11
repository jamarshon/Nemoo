// script.js
    var app = angular.module('App');

    var scrollBottom = function(scrollContainer) {
        $(scrollContainer).scrollTop(scrollContainer.scrollHeight);
    };

    // For the user
    app.controller('MainCtrl', function($scope) {
        var that = this;
        this.socket = io();
        this.socket.on('user connected', function(){
            $scope.$apply(function(){ that.currentNumOnline++; });
        });
        this.socket.on('user disconnected', function(){
            $scope.$apply(function(){ that.currentNumOnline--; });
        });
    });

    app.controller('DiscussionCtrl', function($routeParams, $timeout, $scope) {
        var that = this;
        console.log($routeParams.page);
        // Scroll the container to the bottom
        var scrollContainer = document.getElementById('scrollable-container');
        $timeout(function(){ scrollBottom(scrollContainer); }, 0);

        this.init = function(main){
            this.main = main;
            this.main.socket.on('message received', function(msg, user){
                var message = {
                    displayName: user.displayName,
                    profilePic: user.profilePic,
                    backgroundColor: user.backgroundColor,
                    created: user.created,
                    message: msg
                };
                that.data.push(message);
                $scope.$apply();
            });
        };
        
    });

    app.animation('.animate-message', [function() {
        var scrollContainer = document.getElementById('scrollable-container');
        return {
            enter: function(element) {
                $(element).addClass('animated bounce');
                scrollBottom(scrollContainer);
            }
        };
    }]);

    

    