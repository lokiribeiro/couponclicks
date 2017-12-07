import {app} from '/client/app.js';

import { name as Register } from '../register/register';
import Profiles from '/imports/models/profiles.js';
import Lists from '/imports/models/lists.js';
import Codes from '/imports/models/codes.js';


class ClaimcodeCtrl {

  constructor($scope, $reactive, $rootScope, $state){
    'ngInject';

    

    $scope.userID = $rootScope.userID;
    $scope.listID = $rootScope.listID;
    console.info('userID', $scope.userID);
    console.info('listID', $scope.listID);0

    $scope.subscribe('users');
    $scope.subscribe('lists');
    $scope.subscribe('codes');

    $.get("http://ipinfo.io", function(response) {
      $scope.ipAddress = response.ip;      
  }, "jsonp");

    $scope.helpers({
        codes(){          
          var listID  = $scope.listID;          
          var selector = {listID : listID};
          var lists = Codes.find(selector);
          var upserted = 'false';
          console.info('tasks', lists);
          var proNum = lists.count();
          lists.forEach(function(list){
            console.info('lists', list.couponCode);
            if(list.status == 'unclaimed' && upserted == 'false'){
            $scope.couponCode = list.coupon_code;
            console.info('insideIP', $scope.ipAddress);
            console.info('listID', listID);
            upserted = 'true';
            Meteor.call('upsertCouponCode', listID, $scope.ipAddress, function(err, detail) {
              if (err) {
                console.info('error encountered');
             } else {               
              console.info('success encountered');
             }
          });
            }
          });
          console.info('pronum', proNum);
          return $scope.couponCode;
        },
        totalLists(){            
          var listID = $scope.listID;
          console.info('taskID', listID);
          var selector = {listID : listID};
          var totalcodes = Codes.find(selector).count();     
          console.info('totalcodes', totalcodes);          
          return totalcodes;
        }

      })//helpers

     $('body').addClass('loginP');

     

    this.$state = $state;

    $scope.loginerror = '';

    $reactive(this).attach($scope);

    this.credentials = {
      username: '',
      password: ''
    };

    this.error = '';

    $log = this.credentials;

    $scope.login = function($log) {
    Meteor.loginWithPassword($log.username, $log.password,
      this.$bindToContext((err) => {
        if (err) {
          $scope.loginerror = err.reason;
              console.info('err: ' ,   $scope.loginerror );
          } else {
            $state.go('Dashboard', { userID : Meteor.userId(), stateHolder : 'Dashboard' });
          }
        })
      );
    }

    $scope.onSignIn = function (googleUser) {
      var id_token = googleUser.getAuthResponse().id_token;
      var profile = googleUser.getBasicProfile();
      console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
      console.log('Name: ' + profile.getName());
      console.log('Image URL: ' + profile.getImageUrl());
      console.log('Email: ' + profile.getEmail());
    };

    $scope.signOut = function() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
  };

  $rootScope.$on('event:social-sign-in-success', function(event, userDetails){
    console.info('userDetails', userDetails);
  })

  }
}

app.component('claimcode', {
  templateUrl: 'client/components/claimcode/claimcode.html',
  controllerAs: 'claimcode',
  controller: ClaimcodeCtrl
});
