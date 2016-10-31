
## View Profile [/api/v1/profile/{profile_id}]

A Profile object has the following attributes:

+ ID
+ Name
+ ImageURI
+ Contact
+ Gallery - only returned if the profile belongs to a gallery
+ Artist - only returned if the profile belongs to an artist

### View Profile [GET]

+ Parameters

    + profile_id (required, number, `3`) ... ID of the Profile in form of an integer

+ Request (application/json)

    + Headers
        
            Authorization: token
            
+ Response 200 (application/json)

            {
                "ID": 3,
                "Name": "Artist 3",
                "ImageURI": "/img/temp/art-4.png",
                "Contact": {
                    "Address1": "address1",
                    "Address2": "address2",
                    "Address3": "address3",
                    "Town": "town",
                    "Postcode": "postcode",
                    "Website": "http://www.artretailnetwork.com",
                    "Landline": "0141 000 111",
                    "Mobile": "071234567890"
                },
                "Gallery": null,
                "Artist": {
                    "ID": 3,
                    "Materials": [{
                        "Name": "Eraser",
                        "Description": "Eraser"
                    }, {
                        "Name": "Acrylic paint",
                        "Description": "Acrylic paint"
                    }]
                }
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
            

## Update Profile [/api/v1/profile/{profile_id}/update]

Updates basic information stored against the specified profile

### Update a Profile [PUT]
            
+ Parameters

    + profile_id (required, number, `1`) ... ID of the Profile in form of an integer
    
+ Request (application/json)

    + Headers
        
            Authorization: token
            
    + Body
    
            { 
                "Name": "Artist Name",
                "ImageURI": "/img/temp/art-4.png",
                "Contact": {
                    "Address1": "address1",
                    "Address2": "address2",
                    "Address3": "address3",
                    "Town": "town",
                    "Postcode": "postcode",
                    "Website": "http://www.artretailnetwork.com",
                    "Landline": "0141 000 111",
                    "Mobile": "071234567890"
                }
            }    
        
+ Response 200 (application/json)

    + Body
    
            { "Message": "Success" }    
            
+ Response 400 (application/json)

    + Body
    
            { "Message": "Bad input description" }

+ Response 403 (application/json)

    + Body
    
            { "Message": "You do not have permission to update this profile" }
            
+ Response 404 (application/json)

    + Body
    
            { "Message": "Profile Not Found" }

+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }



## Follow Profile [/api/v1/profile/{profile_id}/action/follow]

Start following this profile.

### Follow Profile [GET]

+ Parameters

    + profile_id (required, number, `3`) ... ID of the Profile in form of an integer

+ Request (application/json)

    + Headers
        
            Authorization: token
            
+ Response 200 (application/json)

    + Body
    
            { "Message": "Success" }    
            
+ Response 400 (application/json)

    + Body
    
            { "Message": "Bad input description" }

+ Response 404 (application/json)

    + Body
    
            { "Message": "Profile Not Found" }

+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }



## Unfollow Profile [/api/v1/profile/{profile_id}/action/unfollow]

Stop following this profile.

### Unfollow Profile [GET]

+ Parameters

    + profile_id (required, number, `3`) ... ID of the Profile in form of an integer

+ Request (application/json)

    + Headers
        
            Authorization: token
            
+ Response 200 (application/json)

    + Body
    
            { "Message": "Success" }    
            
+ Response 400 (application/json)

    + Body
    
            { "Message": "Bad input description" }
            
+ Response 404 (application/json)

    + Body
    
            { "Message": "Profile Not Found" }

+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }





## Connect to Profile [/api/v1/profile/{profile_id}/action/connect]

Sends a connection request to the target profile, this request must be accepted by the target to actually connect to them.

There may also be a limit to the number of requests that can be made within a certain timeframe.

*NOTE:* This action should generate a notification for the target profile.

### Connect to Profile [GET]

+ Parameters

    + profile_id (required, number, `3`) ... ID of the Profile in form of an integer

+ Request (application/json)

    + Headers
        
            Authorization: token
            
+ Response 200 (application/json)

    + Body
    
            { "Message": "Success" }    
            
+ Response 400 (application/json)

    + Body
    
            { "Message": "Bad input description" }

+ Response 403 (application/json)

    + Body
    
              { "Message": "You do not have permission to connect to this profile" }
            
+ Response 404 (application/json)

    + Body
    
            { "Message": "Profile Not Found" }

+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }

