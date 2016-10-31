/*

 Programmatic Mocha code - This is used by a codeship
 test to both start an expressjs app, setup routes and
 run a suite of mocha tests.

 Hint: Place this in the root of the project. Call from
 test package.js or setup with > node mocha.js

 See: https://gist.github.com/d1b1/7949308
 Also see: https://gist.github.com/d1b1/7949456 (Expressjs + Swagger App)

 */

/* Dependencies */
var Mocha = require('mocha'),
  fs    = require('fs'),
  path  = require('path')

/* Call (Root Dir) Express App */
var app = require('../../../app');

/* Setup the Mocha for running the spec test. */

var mocha = new Mocha({
  reporter: 'spec'
});

if(process.argv.length > 2){
  for(i = 2; i < process.argv.length; i++) mocha.addFile(process.argv[i]);
  console.log('Loaded target tests');
}
else{
  /* Loop the test folder and load all the
   .js test files into mocha. Assumes all
   tests in the ./test folder.
   */
  var testDir = path.resolve(__dirname + '/../test');
  console.log("Loading test files from " + testDir);

  fs.readdirSync(testDir).filter(function(file) {
    // Only keep the .js files
    return file.substr(-3) === '.js'
  }).forEach(function(file){
    // Use the method "addFile" to add the file to mocha
    mocha.addFile(
      path.join(testDir, file)
    )
  });
  console.log("Loaded test files");
}

/* Start the Server on a port. once it is started, tell mocha to run. */

console.log("Starting server");
Server = app.listen(3000, function (err, result) {

  console.log("Server started");
  if (err) {
    console.log('Failed');
    process.exit(1);

  } else {

  	require('./loadModels').loadModels(function () {

    	// run migrations
        var migrateDir = path.resolve(__dirname + '/../../migrations');
        console.log("Running database migration scripts from " + migrateDir);

    	db.migrate.latest({ directory: migrateDir }).then(function () {

			// seed database
          var seedDir = path.resolve(__dirname + '/../seeds/development');
          console.log("Seeding database from " + seedDir);

          db.seed.run({ directory: seedDir }).then(function () {

    			// Now, you can run the tests.
    			console.log("Running tests");
    			mocha.run(function (failures) {
    				// Output the errors into the console for testing purposes.
    				console.log('Failures', failures);

    				// Exit the script with either 0 or the number of failures.
    				// Travis and Codeship will look for this value to determine
    				// if the tests passed.

    				process.exit(failures);
    			});
    		});
    	})
      
    });
  }
});
