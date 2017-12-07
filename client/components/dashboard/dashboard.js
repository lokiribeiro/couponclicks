import {app} from '/client/app.js';
import Lists from '/imports/models/lists.js';

class DashboardCtrl{

  constructor($scope, $timeout, $window, $mdSidenav, $log, $mdDialog, $state, $stateParams){
      'ngInject';           

      /*      $mdDialog.show({
              clickOutsideToClose: false,
              escapeToClose: false,
              transclude: true,
              locals: {
                userDetails: $scope.userDetails
              },
              controller: function($mdDialog, userDetails, $scope) {
                  $scope.userDetails = userDetails;

                  $scope.removeNow = function() {
                      var userID = $scope.passedId;

                      $scope.done = true;
                      $scope.existing = false;
                      $scope.createdNow = !$scope.createdNow;
                      //var status = createUserFromAdmin(details);

                      Meteor.call('sendVerificationLink', userID, function(err, detail) {
                        if (err) {
                          $scope.createdNows = !$scope.createdNows;
                          $scope.done = false;
                          //delete old apps
                          window.setTimeout(function(){
                            $scope.$apply();
                          },2000);
                            //do something with the id : for ex create profile
                          } else {
                            $scope.done = false;
                            $scope.createdNow = !$scope.createdNow;
                            $scope.existing = true;
                            window.setTimeout(function(){
                              $scope.$apply();
                            },2000);

                          }
                      });
                    }

                    $scope.closeDialog = function() {
                      $mdDialog.cancel();
                    };
                  },
                  templateUrl: 'client/components/welcomepage/welcomepage.html'                  
                });              
                */
      

      $('body').removeClass('loginP');

      $scope.userId = Meteor.userId();
      $scope.sort = 1;
      $scope.subscribe('lists');

      $scope.helpers({
        lists(){
          var selector = {};
          var lists =  Lists.find(selector);
          console.info('lists', lists);
          var count = lists.count();
          console.info('listCount', count);
          //themeProvider.setDefaultTheme(statehold);
          return lists;
        }

      });//helpers


      $scope.projected = function (selected) {
        console.info('project', selected);
        var projectId = selected;
        $state.go('Projectpage', { userID : $scope.userId, stateHolder : 'codes', listID : projectId });
      }

      $scope.items = [
        { name: "Add list", icon: "../../assets/img/white_roleadd24.svg", direction: "left" }
      ];

      $scope.openDialog = function($event) {
      // Show the dialog      
      $mdDialog.show({
        clickOutsideToClose: false,
        escapeToClose: true,
        controller: function($mdDialog) {
          // Save the clicked item
          $scope.FABitem = item;
          // Setup some handlers
          $scope.close = function() {
            $mdDialog.cancel();
          };
        },
        controllerAs: 'createlist',
        controller: DashboardCtrl,
        template: '<createlist></createlist>',
        targetEvent: $event
      });      
    }


    }
}

app.component('dashboard', {
    templateUrl: 'client/components/dashboard/dashboard.html',
    controllerAs: 'dashboard',
    controller: DashboardCtrl
})
