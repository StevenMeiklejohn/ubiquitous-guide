
## Check code [/api/v1/check/{code}]

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

    
## Get registration code [/api/v1/register/registration-code]

Returns any affiliate code entered during registration for the current user
    
### Get registration code [GET]

+ Request (application/json)

    + Headers
    
            Authorization: token
            
+ Response 200 (application/json)

    + Body
    
            { 
                "ID": 1,
                "Code": "REF123"
            }
  
+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }

    