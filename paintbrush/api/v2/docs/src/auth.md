


## Retrieve Token [/api/v2/auth]

Handles initial authentication with the web service.

### Retrieve an authentication token [POST]

In order to authenticate against the API you must first post a valid username and 
password.  If the credentials are correct you will be assigned a bearer token that
must be passed back to the API within the header of all requests.

NOTE: If RegistrationID is set in the response the user is still in the process of completing registration, most likely just needs to complete the last couple steps of profile builder. 


+ Request (application/x-www-form-urlencoded)

	+ Headers
	
			Accept-Language: en-GB,en;q=0.5
            User-Agent: user agent string

    + Body
    
            client_id=....
			&client_secret=....
			&grant_type=password
            &password=pass1234
            &username=user@test

+ Response 200 (application/json)

    + Attributes (object)
        + access_token (string)
        + refresh_token (string)
        + expires_in (number)
        + token_type (string)
        + ProfileID (number) - The profile id of this user
        + RegistrationID (number) - If not null the user is still needs to complete registration

    + Body

            { 
                access_token: 'a13473bebd7...', 
                refresh_token: 'b8e72bf6d5...', 
                expires_in: 86400, 
                token_type: 'Bearer', 
                ProfileID: 1,
                RegistrationID: null
            }

## Refresh Token [/api/v2/auth/refresh]

### Refresh an authentication token [POST]

Bearer tokens have a limited lifetime and must be renewed on a regular basis.

If you receive a 401 Unauthorised response from the API containing the following header:

WWW-Authenticate	
Bearer realm="Users", error="invalid_token", error_description="Token expired"

And you have a valid refresh token then posting to this endpoint will generate a fresh pair of tokens for use with the API.

+ Request (application/x-www-form-urlencoded)

	+ Headers
	
			Accept-Language: en-GB,en;q=0.5
			User-Agent: user agent string

    + Body
    
            refresh_token=186sFCtCLxVZo.....
            &grant_type=refresh_token
            &client_id=....
            &client_secret=....

+ Response 200 (application/json)

    + Attributes (object)
        + access_token (string)
        + refresh_token (string)
        + expires_in (number)
        + token_type (string)
        + ProfileID (number) - The profile id of this user
        + RegistrationID (number) - If not null the user is still needs to complete registration

    + Body

            { 
                access_token: 'a13473bebd7...', 
                refresh_token: 'b8e72bf6d5...', 
                expires_in: 86400, 
                token_type: 'Bearer'
            }


## Facebook Web Login [/api/v2/auth/facebook]

Authenticates user using Facebook, this call will redirect user to Facebook to log in.

### Facebook Web Login [GET]

+ Request (application/json)

+ Response 302


## Facebook Web Login Callback [/api/v2/auth/facebook/callback?{params}]

Completes Facebook authentication, after a successful login:
                                 
  - If the Facebook account used is linked to an ARN user a bearer token will be returned.
  - If the account does not match an existing ARN user Facebook profile data will be returned.
	- If you already have a valid bearer token then it is possible to link the Facebook account to the current user.
	- Otherwise this profile data should be used to complete a registration.

### Facebook Web Login Callback [GET]

+ Parameters

    + params (required) ... Search parameters returned by Facebook after user has logged in

+ Request (application/json)

	+ Headers
	
			Accept-Language: en-GB,en;q=0.5
            User-Agent: user agent string
			
+ Response 200

    + Attributes (object)
        + access_token (string)
        + refresh_token (string)
        + token_type (string)
        + ProfileID (number) - The profile id of this user

    + Body

            { 
                access_token: '13473bebd7...', 
                refresh_token: '8e72bf6d5...', 
                expires_in: 86400, 
                token_type: 'Bearer', 
                ProfileID: 1,
                RegistrationID: null
            }
            
+ Request (application/json)
            
+ Response 200

	+ Body
	
			{
            	"message": "Could not match Facebook ID with an existing user",
            	"profile": {
            		"provider": "facebook",
            		"id": "10207727286167575",
            		"displayName": "John Smith",
            		"name": {}		
            	}
            }


## Facebook Token Login [/api/v2/auth/facebook/token/{token}]

Allows API authentication using a valid Facebook OAuth token, once authenticated you will be provided with bearer token allowing you to use the API.
                                 
  - If the Facebook account used is linked to an ARN user a bearer token will be returned.
  - If the account does not match an existing ARN user a new consumer will be created (linked to this Facebook account) before returning a bearer token.

*NOTE:* 201 response indicates a new user was created.

### Facebook OAuth Token Login [GET]

+ Parameters

    + token (required) ... A valid Facebook OAuth token

+ Request (application/json)

	+ Headers
	
			Accept-Language: en-GB,en;q=0.5
            User-Agent: user agent string

+ Response 200

    + Attributes (object)
        + access_token (string)
        + refresh_token (string)
        + token_type (string)
        + ProfileID (number) - The profile id of this user

    + Body

            { 
                access_token: '13473bebd7...', 
                refresh_token: '8e72bf6d5...', 
                expires_in: 86400, 
                token_type: 'Bearer', 
                ProfileID: 1
            }

+ Response 201

    + Attributes (object)
        + access_token (string)
        + refresh_token (string)
        + token_type (string)
        + ProfileID (number) - The profile id of this user

    + Body

            { 
                access_token: '13473bebd7...', 
                refresh_token: '8e72bf6d5...', 
                expires_in: 86400, 
                token_type: 'Bearer', 
                ProfileID: 1
            }
            


## Google Web Login [/api/v2/auth/google]

Authenticates user using Google, this call will redirect user to Google to log in.

### Google Web Login [GET]

+ Request (application/json)

+ Response 302


## Google Web Login Callback [/api/v2/auth/google/callback?{params}]

Completes Google authentication, after a successful login:

 - If the Google account used is linked to an ARN user a bearer token will be returned.
 - If the account does not match an existing ARN user Google profile data will be returned.
   - If you already have a valid bearer token then it is possible to link the Google account to the current user.
   - Otherwise this profile data should be used to complete a registration.

### Google Web Login Callback [GET]

+ Parameters

    + params (required) ... Search parameters returned by Google after user has logged in

+ Request (application/json)

	+ Headers
	
			Accept-Language: en-GB,en;q=0.5
            User-Agent: user agent string

+ Response 200

    + Attributes (object)
        + access_token (string)
        + refresh_token (string)
        + token_type (string)
        + ProfileID (number) - The profile id of this user

    + Body

            { 
                access_token: '13473bebd7...', 
                refresh_token: '8e72bf6d5...', 
                expires_in: 86400, 
                token_type: 'Bearer', 
                ProfileID: 1,
                RegistrationID: null
            }
            
+ Request (application/json)
            
+ Response 200

	+ Body
	
			{
				"message": "Could not match Google ID with an existing user",
				"profile": {
					"provider": "google",
					"id": "939348230293920294202",
					"displayName": "John Smith",
					"name": {
						"familyName": "Smith",
						"givenName": "John"
					},
					"photos": [{
						"value": "https://lh3.googleusercontent.com/-79Cnh1IzHD0/AAAAAAAAAAI/AAAAAAAAAAA/lNIVAqCD8P8/photo.jpg?sz=50"
					}],
					"gender": "male"
				}
			}


## Link Authentication Provider [/api/v2/auth/provider/link]

Links the current user to a 3rd party authentication provider using the profile data returned form the callback endpoint after a successful login.

### Link Authentication Provider [POST]

+ Request (application/json)

    + Headers
    
            Authorization: token

    + Body

			{ 
				"GoogleID": "382319823498239042",
				"FacebookID": "9342348734897894739"
			}

+ Response 200 (application/json)

	+ Body 
	
			{
				"Message": "Success"
			}


## Current User [/api/v2/auth/current-user]

Returns some basic user details for the currently logged in user.

### Current User [GET]

+ Request (application/json)

    + Headers
        
            Authorization: token

+ Response 200 (application/json)

	+ Body
	
    	    {
    	    	"UserID": 4574,
    	    	"ProfileID": 4574,
    	    	"Auth": 
    	    	{
    	    		"Facebook": false,
    	    		"Google": false
				}
			}


## Forgot Password [/api/v2/auth/forgot]

Calling this method will send out a password reset email

### Forgot Password [POST]

+ Request (application/json)

    + Headers
        
            Authorization: token
            
	+ Body

			{ 
				"Email": "name@test"
			}

+ Response 200 (application/json)

	+ Body
	
        	{
        		"Message": "Success"
        	}


## Logout [/api/v2/auth/logout]

Calling this method will expire your current session token.

### Logout [GET]

+ Request (application/json)

    + Headers
        
            Authorization: token

+ Response 200 (application/json)

	+ Body
	
    	    {
				"Message": "Success"
			}





