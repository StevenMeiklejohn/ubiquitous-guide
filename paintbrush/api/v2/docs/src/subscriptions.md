


## Create Subscription [/api/v2/subscription/create]

Creates a new subscription for the logged in user

### Create Subscription [POST]

    
+ Request

    + Headers
    
            Authorization: token
            
    + Body
    
            {
                Number: '1234123412341234',
                ExpMonth: 4,
                ExpYear: 2017,
                CVC: 123,
                PackageID: 1,
                AffiliateCodeID: 5
            }
            

+ Response 200 (application/json)

    + Body
    
            { "Message": "Success" }
     
+ Response 400 (application/json)

    + Body
    
            { "Message": "Bad input description" }

+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }
            