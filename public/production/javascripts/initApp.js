var app=angular.module("App",["ngRoute","ngMaterial","ngMessages","ngAnimate","ngSanitize"]);app.config(["$routeProvider","$locationProvider","$mdThemingProvider",function(e,t,a){e.when("/page/:page",{templateUrl:function(e){return"/partials/"+e.page},controller:"DiscussionCtrl",controllerAs:"discussionCtrl"}).when("/",{templateUrl:"/views/home.ejs"}),t.html5Mode({enabled:!0,requireBase:!1});var n=a.extendPalette("indigo",{contrastDefaultColor:"light",contrastDarkColors:["50"],50:"ffffff"});a.definePalette("custom",n),a.theme("default").primaryPalette("custom",{default:"500","hue-1":"50"}).accentPalette("amber"),a.theme("input","default").primaryPalette("grey")}]),$(window).on("load",function(e){"#_=_"==window.location.hash&&(window.location.hash="",history.pushState("",document.title,window.location.pathname),e.preventDefault())});