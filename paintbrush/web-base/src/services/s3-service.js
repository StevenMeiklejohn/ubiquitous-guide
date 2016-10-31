(function(){

angular.module('ARN')


.factory('s3Service', ['$q', '$http', function($q, $http){

	return {

		deleteObject: function(uri) {
			return $http.delete('/api/s3/object/' + encodeURIComponent(uri));
		},

		upload: function(destination, file){
			var deferred = $q.defer();

			// file extension
			var ext = file.name.split('.').pop();

			// first create the s3 signed URL
			$http.get('/api/s3/signed-url/' + ext + (destination ? '/' + destination : '')).then(function (response) {
				if (response.status == 200) {
					var xhr = new XMLHttpRequest();
					xhr.upload.addEventListener("load", function(){ deferred.resolve(response.data.objectUrl) }, false);
					xhr.upload.addEventListener("error", function(){ deferred.reject('Upload error') }, false);
					xhr.upload.addEventListener("abort", function(){ deferred.reject('Upload cancelled') }, false);
					xhr.upload.addEventListener("progress", function(evt){
						if(evt.lengthComputable){
							var percent = Math.round(evt.loaded / evt.total * 100);
							deferred.notify(percent)
						}
					}, false);
					xhr.open("PUT", response.data.signedUrl, true);
					xhr.setRequestHeader("Content-type", file.type);
					xhr.send(file);
				}
				else{
					deferred.reject('Failed to create signed URL');
				}
			});

			return deferred.promise;
		}

	};


}])


})();