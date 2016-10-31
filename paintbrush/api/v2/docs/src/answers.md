
*NOTE:* Answers are used to create a profiles biography section.


## List Profile Answers [/api/v2/profile/{profile_id}/answers]

Returns all answers that have been provided by the specified profile

### List Profile Answers [GET]

+ Request (application/json)

    + Headers
    
            Authorization: token
            
    + Body
        
            [ 
                { 
                    "ArtistQuestionID": 1,
                    "Answer": "..."
                }, 
                { 
                    "ArtistQuestionID": 2,
                    "Answer": "..."
                }, 
                { 
                    "ArtistQuestionID": 3,
                    "Answer": "..."
                }
            ]
            
+ Response 200 (application/json)

    + Body
    
            { "Message": "Success" }

+ Response 400 (application/json)

    + Body
    
            { "Message": "Bad input description" }

+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }
            


## Update Profile Answers [/api/v2/profile/{profile_id}/answers/update]

Creates/updates a set of answers saved against the specified profile, a list of appropriate questions can be retrieved using the /question API.

### Update Profile Answers [POST]

+ Request (application/json)

    + Headers
    
            Authorization: token
            
    + Body
        
            [ 
                { 
                    "ArtistQuestionID": 1,
                    "Answer": "..."
                }, 
                { 
                    "ArtistQuestionID": 2,
                    "Answer": "..."
                }, 
                { 
                    "ArtistQuestionID": 3,
                    "Answer": "..."
                }
            ]
            
+ Response 200 (application/json)

    + Body
    
            { "Message": "Success" }

+ Response 400 (application/json)

    + Body
    
            { "Message": "Bad input description" }

+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }
            
