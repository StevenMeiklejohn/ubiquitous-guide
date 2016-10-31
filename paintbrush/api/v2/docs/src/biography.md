
## View Biography [/api/v2/biography/{profile_id}]

Returns the biography associated with the specified profile.

### View Biography [GET]

+ Parameters

    + profile_id (required, integer, `1`) ... ID of the profile

+ Request (application/json)

    + Headers
    
            Authorization: token
            
+ Response 200 (application/json)

    + Body
    
            { 
                "Description": "..."
            }
            
+ Response 400 (application/json)

    + Body
    
            { "Message": "Bad input description" }

+ Response 404 (application/json)

    + Body
    
            { "Message": "Profile Not Found" }

+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }
            

## Update Biography [/api/v2/biography/{profile_id}/update]

*NOTE*: if the biography entry for the specified profile doesn't exist it will be created

### Update Biography [PUT]

+ Parameters

    + profile_id (required, integer, `1`) ... ID of the profile

+ Request (application/json)

    + Headers
    
            Authorization: token
            
    + Body
    
            {
                "Description": "..."
            }
    
+ Response 200 (application/json)

    + Body
    
            { "Message": "Success" }  
            
+ Response 201 (application/json)

    + Body
    
            { "Message": "Success" }

+ Response 400 (application/json)

    + Body
    
            { "Message": "Bad input description" }

+ Response 403 (application/json)

    + Body
    
            { "Message": "You do not have permission to update this item" }
            
+ Response 404 (application/json)

    + Body
    
            { "Message": "Profile Not Found" }

+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }

