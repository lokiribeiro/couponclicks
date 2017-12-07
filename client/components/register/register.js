import {app} from '/client/app.js';
import { name as Login } from '../login/login';
import Profiles from '/imports/models/profiles.js';

class RegisterCtrl{

      constructor($scope, $reactive, $state) {
        'ngInject';

        //$('body').removeClass('loginP');
        
        this.$state = $state;
        $scope.confirmPass = '';

        $reactive(this).attach($scope);

        this.credentials = {
          email: '',
          password: ''
        };

        $scope.profile = {
          firstname: ''
        }

        this.error = '';

        $details = this.credentials;
        $scope.done = false;
        $scope.existing = false;
        $scope.createdNow = false;
        $scope.createdNos = false;



        $scope.registerUser = function(details, profiles) {
          console.log('heya:' + profiles.firstname);
          if($scope.confirmPass == details.password) {
          $scope.register.error = '';
          $scope.done = true;
          $scope.existing = false;
          $scope.createdNow = !$scope.createdNow;
          
          Meteor.call('createUserFromAdmin', details.email, details.password, function(err, detail) {
                var detail = detail;
                var newuserID = detail;
                console.log(detail);
                  if (err) {
                      //do something with the id : for ex create profile
                      $scope.done = false;
                      $scope.createdNow = !$scope.createdNow;
                      console.info('err', err);
                      $scope.existing = true;
                      window.setTimeout(function(){
                      $scope.$apply();
                    },2000);
                 } else {
                   $scope.registered = details;
                   $scope.profile = profiles;
                   $scope.newUserID = newuserID;
                   $scope.canCreateProfile = true
                   $scope.createdNows = !$scope.createdNows;
                   $scope.done = false;
                   //simulation purposes
                   window.setTimeout(function(){
                   $scope.$apply();
                   if($scope.canCreateProfile){
                   //create user profile
                       $scope.createProfile($scope.newUserID, details, $scope.profile);
                       console.info('created', $scope.created);
                     }
                 },2000);
                 }
              });
          } else {
            $scope.register.error = "Password does not match";
          }


        };

        $scope.logout = function() {
        Accounts.logout();
        $state.go('logout');
      }

      $scope.createProfile = function (newUserID, profileDetails, profile) {
        var userFirstname = profile.firstname;
        console.info('userFirstname', userFirstname);

        var toName = userFirstname;
        var toEmail = profileDetails.email;

        Meteor.call('sendEmail', toEmail, toName, function(err, detail) {
            if (err) {
              console.info('error encountered');
           } else {
            console.info('success encountered');
           }
        });
              

                console.log(newUserID);
                //console.log(profileDetails.emails[0].address);                

                var profile = [];

                profile.profiles_userID = newUserID;
                profile.name = userFirstname;
                profile.profiles_email = profileDetails.email;
                profile.profiles_password = profileDetails.password;
                profile.profiles_profilephoto = '../../assets/img/profiles/user.png';
                profile.profiles_createdAt = new Date();
                profile.profiles_type = 'user';

                var profileID = Profiles.insert(profile);


                console.info('profileID', profileID);

          Meteor.call('upsertUserFromAdmin', newUserID, userFirstname, function(err, detail) {
            if (err) {
              console.info('error encountered');
           } else {
            console.info('success encountered');
           }
        });
          };

      }
};

app.component('register', {

    templateUrl: 'client/components/register/register.html',
    controllerAs: 'register',
    controller: RegisterCtrl
});
