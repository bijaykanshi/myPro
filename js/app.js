var $urlRouterProviderRef = null;
var $stateProviderRef = null;
var app = angular.module('app', ["ui.router", "ui.bootstrap",
"ui.bootstrap.tpls", "ui.bootstrap.modal", "ui.bootstrap.popover", "summernote", "ngSanitize",'builder', 'builder.components', 'validator.rules']);

    
app.config(function($stateProvider, $urlRouterProvider) {
   $urlRouterProviderRef = $urlRouterProvider;
   $stateProviderRef = $stateProvider;
})