
## Check code [/api/v2/check/{code}]

Checks if an affiliate code is valid
    
### Check code [GET]

+ Parameters

    + code (required, string, `REF123`) ... Affiliate/Referral code

+ Request (application/json)
            
+ Response 200 (application/json)

    + Body
    
            { 
                "ID": 1,
                "ProfileID": null,
                "SubscriptionPackageID": null,
                "Code": "REF123",
                "Discount": 50,
                "DiscountDuration": null,
                "Commission": 0,
                "TrialPeriod": 0,
                "ExpiryDate": null
            }

+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }

    
## Get registration code [/api/v2/register/registration-code/{profile_id}]

Returns any affiliate code entered during registration for the current user
    
### Get registration code [GET]

+ Parameters

    + profile_id (optional, integer, `1234`) ... Check code used by this profile, if not specified value defaults to the current users profile

+ Request (application/json)

    + Headers
    
            Authorization: token
            
+ Response 200 (application/json)

    + Body
    
            { 
                "ID": 1,
                "Code": "REF123"
            }
  
+ Response 403 (application/json)

    + Body
    
            { "Message": "You do not have permission view registration data associated with this profile" }
  
+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }

    