import {app} from '/client/app.js';

import Profiles from '/imports/models/profiles.js';
import Lists from '/imports/models/lists.js';

class ProjectpageCtrl{

  constructor($rootScope, $scope, $element, $timeout, $mdSidenav, $log, $mdDialog, $state, $mdToast){
      'ngInject';

      console.info('branchID', $rootScope.listID);
      $scope.listID = $rootScope.listID;
      $scope.userID = $rootScope.userID;

      $scope.subscribe('lists');

      $scope.helpers({
          lists() {
                var listID = $scope.listID;
                console.info('listID =', $scope.listID);
                var selector = {_id : listID};
                var lists = Lists.find(selector);
                console.info('projects', lists.count());
                return lists;
        }
      });//helpers

      $scope.show = false;

      $scope.perPage = 10;
      $scope.page = 1;
      $scope.page2 = 1;
      $scope.sort = 1;
      $scope.searchText = null;
      $scope.searchText2 = null;
      $scope.partyID = null;
      $scope.deletedNow = false;
      $scope.deletedNows = false;
      $scope.done = false;
      $scope.existing = false;
      $scope.last = false      

      var last = {
        bottom: true,
        top: false,
        left: true,
        right: false
      };

      $scope.toastPosition = angular.extend({},last);

      $scope.getToastPosition = function() {
        sanitizePosition();

        return Object.keys($scope.toastPosition)
        .filter(function(pos) { return $scope.toastPosition[pos]; })
        .join(' ');
      };

      function sanitizePosition() {
        var current = $scope.toastPosition;

        if ( current.bottom && last.top ) current.top = false;
        if ( current.top && last.bottom ) current.bottom = false;
        if ( current.right && last.left ) current.left = false;
        if ( current.left && last.right ) current.right = false;

        last = angular.extend({},current);
      }

      $scope.openDialog = function ($event) {
          $scope.listID = $scope.listID;
          console.info('userid', $scope.listID );
          var listID = $scope.listID;
          $mdDialog.show({
          clickOutsideToClose: false,
          escapeToClose: true,
          transclude: true,
          locals:{
            listID : $scope.listID
          },
          controller: function($scope, $mdDialog, listID){
            $scope.listID = listID;
            $scope.deletedNow = false;
            $scope.existing = false;
            $scope.done = false;

            $scope.removeuserNow = function(listID) {
              console.info('listID', listID);
              var listID = listID;

            $scope.done = true;
            $scope.deletedNow = !$scope.deletedNow;

            Meteor.call('deleteProject', listID, function(err, listID) {
                      if (err) {
                          //do something with the id : for ex create profile
                          $scope.done = false;
                          $scope.deletedNow = !$scope.deletedNow;
                          $scope.existing = true;
                          window.setTimeout(function(){
                            $scope.$apply();
                        },2000);
                        //UserProfile.insert({
                            //user: userId
                       //})
                     } else {
                       //simulation purposes
                         $scope.deletedNows = !$scope.deletedNows;
                         $scope.done = false;
                         window.setTimeout(function(){
                         $state.go('Dashboard');
                         $scope.$apply();
                       },2000);
                       console.log('mayaooo');
                     }
                  });
              }

              $scope.cancelNow = function() {
                $mdDialog.cancel();
              };


          },
          templateUrl: 'client/components/projectpage/delete.html',
          targetEvent: $event
        });
        };

        $scope.claimProject = function() {
          $scope.done = true;
          $scope.createdNow = false;
          $createdNows = false;
          var listID = $scope.listID ;
          var userType = 'user';
          var userID = $scope.userID;
          var listID = $scope.listID;
          console.info('userID', userID);
          console.info('listID', listID);

          $scope.register = Meteor.call('upsertProjectUser', userID, userType, listID, function(err, userID) {
            if (err) {
               console.log('error here');
              //do something with the id : for ex create profile
            } else {
             console.log('continue next user');
            }
          });

          $scope.register = Meteor.call('upsertProjectFromUser', userID, userType, listID, function(err, userID) {
            if (err) {
              var toasted = 'Error updating project details.';
              var pinTo = $scope.getToastPosition();
              $mdToast.show(
                $mdToast.simple()
                .textContent(toasted)
                .position(pinTo )
                .hideDelay(3000)
                .action('HIDE')
                .highlightAction(true)
                .highlightClass('md-accent')
              );
            } else {
              var toasted = 'Proect claimed';
              var pinTo = $scope.getToastPosition();
              $mdToast.show(
                $mdToast.simple()
                .textContent(toasted)
                .position(pinTo )
                .hideDelay(3000)
                .action('HIDE')
                .highlightAction(true)
                .highlightClass('md-accent')
              );
            }
          });
        }

    }
}

app.component('projectpage', {
    templateUrl: 'client/components/projectpage/projectpage.html',
    controllerAs: 'projectpage',
    controller: ProjectpageCtrl
})
