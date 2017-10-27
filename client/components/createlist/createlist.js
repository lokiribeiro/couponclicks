import {app} from '/client/app.js';
import Lists from '/imports/models/lists.js';
import ngFileUpload from 'ng-file-upload';
import Papa from '/imports/ui/papaparse.js';

class CreatelistCtrl{

  constructor($scope, $timeout, $reactive, $mdSidenav, $log, $mdDialog, $state, Upload, $rootScope){
      'ngInject';



      //helpers
      this.$state = $state;
      $scope.userID = $rootScope.userID;

      $reactive(this).attach($scope);

      Slingshot.fileRestrictions("myFileUploads", {
      allowedFileTypes: null,
      maxSize: 10 * 1024 * 1024 // 10 MB (use null for unlimited).
      });

      $scope.uploader = new Slingshot.Upload('myFileUploads');  

      $scope.createdNow = false;
      $scope.createdNows = false;
      $scope.done = false;
      $scope.existing = false;        

      $scope.canCreateProfile = false;

      this.credentials = {
        productName: ''
      };

      this.register = {
        productName: ''
      }

      this.error = '';

      $scope.productName = ''

      //var details = this.credentials;
           

      $scope.createList = function(details, index) {        
        console.info('product name', $scope.productName);
        var detail = details;
        $scope.indexPoint = index;
        console.info('detail from for loop', detail.email);

        console.info('detail', details);       
        //var status = createUserFromAdmin(details);
        var couponCode = details.couponcode;
        if(couponCode){
           Meteor.call('upsertCode', couponCode, $scope.listID, function(err, result) {
               if (err) {
                 console.log('success upsertCode');
              } else {
                 console.log('error upsertCode');                
              }
            });
        }       
        console.info('indexPoint', $scope.indexPoint);
        console.info('arrayLength', parseInt($scope.arrayLength) - 1);
        if($scope.indexPoint == (parseInt($scope.arrayLength) - 1))
           {
             Meteor.call('upsertTotalCodes', $scope.indexPoint, $scope.listID, function(err, result) {
               if (err) {
                 console.log('success upsertCode');
              } else {
                 console.log('error upsertCode');                
              }
            });
            window.setTimeout(function(){
                $scope.createdNows = !$scope.createdNows;
                $scope.done = false;
                $scope.createdNows = true;
                },2000);
            }
    }

      $scope.createAnother = function() {
         $scope.createdNows = !$scope.createdNows;
         $scope.createdNow = !$scope.createdNow;
         //$scope.createdNow = '1';
      }

      $scope.closeDialog = function() {
         $mdDialog.hide();
         //$scope.createdNow = '1';
       }

    $scope.uploadFiles = function(file, errFiles, reqID, reqName) {         
        $scope.existing = false;
        $scope.createdNow = !$scope.createdNow;
      console.log('pasok');
      $scope.progress = 0;      
      $scope.f = file;
      $scope.errFile = errFiles && errFiles[0];
      $scope.fileHere = file.name;
      var requirementname = reqName;
      var requirementID = reqID;
      $scope.done = true;
      if (file) {
        console.info('userID', $scope.userID);
        var list = [];

        list.product_name = $scope.productName;               
        list.userID = $scope.userID;
        list.date = new Date();

        var status = Lists.insert(list);
        if (status) {
          $scope.listID = status;
          console.info('listID', $scope.listID);         
         } else {
           //do something with the id : for ex create profile
           //$scope.done = false;
           //$scope.createdNow = !$scope.createdNow;
           //$scope.existing = true;
           //window.setTimeout(function(){
           //$scope.$apply();
         //},2000);
        }
        console.log(file);
        $scope.fileCSV = file;

        var config = {
	         delimiter: "",	// auto-detect
	         newline: "",	// auto-detect
	         header: true,
	         dynamicTyping: false,
	         preview: 0,
	         encoding: "",
	         worker: false,
	         comments: false,
	         step: undefined,
	         complete: function(results, file) {
	            console.info("Parsing complete:", results);
              var length = results.data.length;
              $scope.arrayLength = length;
              console.info("Array length:", length);
              for(i=0;i<length;i++){
                var details = results.data[i];
                console.info('details from parsed CSV', details);
                $scope.createList(details, i);
              }
              var file = $scope.fileCSV;
                file.upload = Upload.upload({
                    url: '/uploads',
                    data: {file: file}
                });
                var filename = file.name;
                var path = '/uploads';
                var type = file.type;
                switch (type) {
                  case 'text':
                  //tODO Is this needed? If we're uploading content from file, yes, but if it's from an input/textarea I think not...
                  var method = 'readAsText';
                  var encoding = 'utf8';
                  break;
                  case 'binary':
                  var method = 'readAsBinaryString';
                  var encoding = 'binary';
                  break;
                  default:
                  var method = 'readAsBinaryString';
                  var encoding = 'binary';
                  break;
                }
                /*Meteor.call('uploadFileFromClient', filename, path, file, encoding, function(err) {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log('success maybe?');
                  }
                });*/


                file.upload.then(function (response) {
                    $timeout(function () {
                      console.log(response);
                        file.result = response.data;
                        $scope.Fresult = response.config.data.file;

                        var errs = 0;
                        var Fresult = $scope.Fresult;
                        console.info('$scope', Fresult);
                    });
                }, function (response) {
                    if (response.status > 0)
                        $scope.errorMsg = response.status + ': ' + response.data;
                    else {
                      console.log('else pa');
                    }
                }, function (event) {
                    file.progress = Math.min(100, parseInt(100.0 *
                                             event.loaded / event.total));
                    $scope.progress = file.progress;
                    if ($scope.progress == 100) {
                      console.log('transferred up');
                    }
                    console.log($scope.progress);
                });


            },
	         error: function(results, file) {
	            console.info("Parsing complete:", results);
            },
	         download: false,
	         skipEmptyLines: false,
	         chunk: undefined,
	         fastMode: undefined,
	         beforeFirstChunk: undefined,
	         withCredentials: undefined
         };

        Papa.parse(file, config);


        /*Papa.parse(file, config)
            .then(handleParseResult)
            .catch(handleParseError)
            .finally(parsingFinished);


          function handleParseResult(result) {
            console.info("Parsing complete1:", result);*/


            /*}

        function handleParseError(result) {
        // display error message to the user
        console.info("Parsing complete2:", result);
          }

          function parsingFinished() {
        // whatever needs to be done after the parsing has finished
        console.info("Parsing complete3:", result);
      }*/



      }
  };

}
}

app.component('createlist', {
    templateUrl: 'client/components/createlist/createlist.html',
    controllerAs: 'createlist',
    controller: CreatelistCtrl
})
