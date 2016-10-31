




## Check Status [/api/v2/register/check-status]

Returns the current registration status for a specific email address.

### Check Status [POST]

+ Request (application/json)

    + Headers
    
            Authorization: token
            
    + Body
        
            {
                Email: "unknown-user@test"
            }

+ Response 200 (application/json)

    + Body
    
            { 
                "Exists": 0 
            }


+ Request (application/json)

    + Headers
    
            Authorization: token
            
    + Body
        
            {
                Email: "user@test"
            }


+ Response 200 (application/json)

    + Body
    
            { 
                "Exists": 1,
                "UserID": 123,
                "RegistrationID": 456,
                "Step": 2,
                "Type": "artist",
                "TotalSteps": 6,
                "CompletedSteps": 2 
            }

+ Response 400 (application/json)

    + Body
    
            { "Message": "Bad input description" }

+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }
            


## Create User [/api/v2/register/create-user]

Creates a new user account and registration record starting the registration process for artists and galleries.

An optional affiliate/referral code can be specified at this point and will be used later if the user purchases any ActivCanvas package.

### Create User [POST]

+ Request (application/json)

    + Headers
    
            Authorization: token
            
    + Body
        
            { 
                "Email": "user@test",
                "Password": "dkS023F^wid#Q7=",
                "AffiliateCodeID": 1
            }

+ Response 200 (application/json)

    + Body
    
            { 
                "UserID": 123,
                "RegistrationID": 456,
                "Message": "Success" 
            }

+ Response 400 (application/json)

    + Body
    
            { "Message": "Bad input description" }

+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }
            


## Update Status [/api/v2/register/update-status]

Updates the current status of a specific user registration.

This call is used to allow registrations to be resumed but is optional, registrations can be completed without using it. 

*NOTE*: UserID and RegistrationID must match an existing registration record.

### Update Status [POST]

+ Request (application/json)

    + Headers
    
            Authorization: token
            
    + Body
        
            { 
                "UserID": 123,
                "RegistrationID": 456,
                "Step": 2,
                "Type": "artist",
                "TotalSteps": 6,
                "CompletedSteps": 2 
            }

+ Response 200 (application/json)

    + Body
    
            { 
                "Message": "Success" 
            }

+ Response 400 (application/json)

    + Body
    
            { "Message": "Bad input description" }

+ Response 404 (application/json)

    + Body
    
            { "Message": "Registration record not found or does not belong to the specified user" }

+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }
            



## Create Profile [/api/v2/register/create-profile]

Creates a new profile and any account type (artist/gallery) specific records.

*NOTE*: Location is only required when creating an artist account.

### Create Profile [POST]

+ Request (application/json)

    + Headers
    
            Authorization: token
            
    + Body
        
            { 
                "UserID": 123,
                "RegistrationID": 456,
                "Name": "User's name",
                "ImageURI": "Path to image",
                "Artist": true,
                "Location": "Artist location",
                "Gallery": false
            }

+ Response 200 (application/json)

    + Body
    
            { 
                "ProfileID": 789
            }

+ Response 400 (application/json)

    + Body
    
            { "Message": "Bad input description" }

+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }
            


## Complete Registration [/api/v2/register/complete]

Once a user and profile has been created this call marks the registration as complete allowing the user to start using the platform.

*NOTE*: UserID and RegistrationID must match an existing registration record.

### Complete Registration [POST]

+ Request (application/json)

    + Headers
    
            Authorization: token
            
    + Body
        
            { 
                "UserID": 123,
                "RegistrationID": 456
            }

+ Response 200 (application/json)

    + Body
    
            { 
                "Message": "Success" 
            }

+ Response 400 (application/json)

    + Body
    
            { "Message": "Bad input description" }

+ Response 404 (application/json)

    + Body
    
            { "Message": "Registration record not found or does not belong to the specified user" }

+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }
            



## Create Consumer [/api/v2/register/create-consumer]

Creates a new consumer user account, using this call side steps the usual registration process and there is no need to call [Complete Registration](#register-complete-registration).

An optional affiliate/referral code can be specified at this point and will be used later if the user purchases any ActivCanvas package.

### Create Consumer [POST]

+ Request (application/json)

    + Headers
    
            Authorization: token
            
    + Body
        
            { 
                "Email": "user@test",
                "Password": "dkS023F^wid#Q7=",
                "AffiliateCodeID": 1
            }

+ Response 200 (application/json)

    + Body
    
            { 
                "UserID": 123,
                "ProfileID": 456,
                "Message": "Success" 
            }

+ Response 400 (application/json)

    + Body
    
            { "Message": "Bad input description" }

+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }
            
