var app=angular.module("App");app.controller("SearchBoxCtrl",["$http","$q","$location","$mdSidenav","$mdMedia",function(e,t,r,n,o){var s=this;this.querySearch=function(r){var n=t.defer();return e.post("/searchDiscussion",{searchText:s.searchText}).then(function(e){n.resolve(e.data.discussions)}),n.promise},this.searchTextChange=function(e){},this.selectedItemChange=function(e){e&&this.togglePanel(function(){s.softRedirect("/page/"+e.name)})},this.togglePanel=function(e){var t=n("left"),r=o("gt-sm");r?e():t.close().then(e)},this.softRedirect=function(e){r.url(e)}}]),app.directive("nemooSearchBox",function(){return{restrict:"E",templateUrl:"/views/searchBox.ejs",controller:"SearchBoxCtrl",controllerAs:"searchBoxCtrl"}});