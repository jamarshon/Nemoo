var app=angular.module("App");app.controller("MainCtrl",[function(){this.socket=io(),emojify.setConfig({img_dir:"/images/emoji"})}]);