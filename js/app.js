var $urlRouterProviderRef = null;
var $stateProviderRef = null;
var app = angular.module('app', ["ui.router", "ui.router", "ui.bootstrap",
"ui.bootstrap.tpls", "ui.bootstrap.modal", "ui.bootstrap.popover"]);
    /*app.config(function($stateProvider, $urlRouterProvider){
    $stateProvider
        .state('peopleList', {
            url: "/peopleList",
            views: {
                "page": {
                    templateUrl: "template/afterLogin.html"
                },
                "sideBar@peopleList": {
                    templateUrl: "template/sideBar.html"
                },
                 "body@peopleList": {
                    templateUrl: "template/listOfPeople.html"
                },
                "rightSideBar@peopleList": {
                    templateUrl: "template/rightSideBar.html"
                },
                 "footer@peopleList": {
                    templateUrl: "template/footer.html"
                }
            }
        })
        .state('home', {
            url: "",
            views: {
                "page": {
                    templateUrl: "coach/index.html"
                }
            },
            onEnter: [
            "$modal",
            function($modal) {
              $modal.open({
                controller: "loginSignUp",
                templateUrl: 'template/modals/login.html',
                resolve: {
                    parameter: function(){
                        return undefined
                    }
                },
              })
            }
          ]

        })
       
    })*/
app.config(function($stateProvider, $urlRouterProvider) {
   $urlRouterProviderRef = $urlRouterProvider;
   $stateProviderRef = $stateProvider;
})