


    
## Activate artwork [/api/v2/demo/activate/{artwork_id}]

Activates the specified artwork with the ActivCanvas demo video.
    
### Activate artwork [GET]

+ Parameters

    + artwork_id (required, number) ... ID of artwork to be activated

+ Request (application/json)

    + Headers
    
            Authorization: token
            
+ Response 200 (application/json)

    + Body
    
            { "Message": "Success" }
  
+ Response 403 (application/json)

    + Body
    
            { "Message": "You do not have permission to activate this artwork" }
  
+ Response 404 (application/json)

    + Body
    
            { "Message": "Artwork not found" }
  
+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }




## Get activation status [/api/v2/demo/status/{artwork_id}]

Returns the activation status of a specific artwork.
    
### Get activation status [GET]

+ Parameters

    + artwork_id (required, number) ... ID of artwork to check

+ Request (application/json)

    + Headers
    
            Authorization: token
            
+ Response 200 (application/json)

    + Body
    
            { 
                "TrackingRating": 5, 
                "SyncRequired": 1
            }
  
+ Response 404 (application/json)

    + Body
    
            { "Message": "Artwork not found" }
  
+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }
