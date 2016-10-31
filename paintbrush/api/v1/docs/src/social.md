

## List Social Media Services [/api/v1/social/services]

Lists all currently defined social media services.

### List social media services [GET]

+ Request (application/json)

    + Headers
    
            Authorization: token
            
    
+ Response 200 (application/json)

    + Body
    
			[{ 
				"ID": 1,
				"Name": "Facebook",
				"URL": "https://www.facebook.com",
				"ImageURI": "/img/auth/facebook-128.png"
			}, { 
				"ID": 2,
				"Name": "Google+",
				"URL": "https://plus.google.com",
				"ImageURI": "/img/auth/google-128.png"
			}, { 
				"ID": 3,
				"Name": "Twitter",
				"URL": "https://twitter.com",
				"ImageURI": "/img/auth/twitter-128.png"
			}]
            
            
+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }




## List Followers [/api/v1/social/{profile_id}/followers]

Lists all current followers of the specified profile.

### List Followers [GET]

+ Request (application/json)

    + Headers
    
            Authorization: token
            
    
+ Response 200 (application/json)

    + Body
    
            [{ 
                "ProfileID": 1,
                "Name": "Artist 1",
                "ImageURI": "/img/artist-1.jpg"
            }, { 
                "ProfileID": 6,
                "Name": "Gallery 1",
                "ImageURI": "/img/gallery-1.jpg"
            }]
            
+ Response 400 (application/json)

    + Body
    
            { "Message": "Bad input description" }
                    
+ Response 403 (application/json)

    + Body
    
            { "Message": "You do not have permission to view this item" }
            
+ Response 404 (application/json)

    + Body
    
            { "Message": "Profile Not Found" }
            
+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }


## List Following [/api/v1/social/{profile_id}/following]

Lists all profiles being followed by the specified profile.

### List Following [GET]

+ Request (application/json)

    + Headers
    
            Authorization: token
            
    
+ Response 200 (application/json)

    + Body
    
            [{ 
                "ProfileID": 1,
                "Name": "Artist 1",
                "ImageURI": "/img/artist-1.jpg"
            }, { 
                "ProfileID": 6,
                "Name": "Gallery 1",
                "ImageURI": "/img/gallery-1.jpg"
            }]

                  
+ Response 400 (application/json)

    + Body
    
            { "Message": "Bad input description" }


+ Response 403 (application/json)

    + Body
    
            { "Message": "You do not have permission to view this item" }
            
+ Response 404 (application/json)

    + Body
    
            { "Message": "Profile Not Found" }
            
+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }