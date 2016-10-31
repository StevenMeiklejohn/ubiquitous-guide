
## Artwork Views [/api/v1/dashboard/views/artwork]

Returns the number of views for a users artwork

### Artwork Views [GET]

+ Request (application/json)

    + Headers
    
            Authorization: token
            
+ Response 200 (application/json)

    + Body
    
            { "Count": 135 }
            
            
## Artwork Views Over Time [/api/v1/dashboard/views/artwork/{interval}/{datapoints}]

Returns the number of views for a users artwork per interval of time.

*NOTE:* Results are returned sorted oldest to newest

### Artwork Views Over Time [GET]

+ Parameters

    + interval (required, string, `month`) ... interval specified as 'day', 'week', 'month' 
    + datapoints (optional, number, `15`) ... number of datapoints to return: default = 15 max = 100
       
+ Request (application/json)

    + Headers
    
            Authorization: token
                 
+ Response 200 (application/json)

    + Body
    
            [10, 32, 21, 45, 9, 13, 37, 41]

+ Response 400 (application/json)

    + Body
    
            { "Message": "Bad input description" }
                        
+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }  
            
            
## Artwork Likes [/api/v1/dashboard/likes/artwork]

Returns the number of likes for a users artwork

### Artwork Likes [GET]

+ Request (application/json)

    + Headers
    
            Authorization: token
            
+ Response 200 (application/json)

    + Body
    
            { "Count": 135 }
            
            
## Artwork Likes Over Time [/api/v1/dashboard/likes/artwork/{interval}/{datapoints}]

Returns the number of likes for a users artwork per interval of time.

*NOTE:* Results are returned sorted oldest to newest

### Artwork Likes Over Time [GET]

+ Parameters

    + interval (required, string, `month`) ... interval specified as 'day', 'week', 'month' 
    + datapoints (optional, number, `15`) ... number of datapoints to return: default = 15 max = 100
       
+ Request (application/json)

    + Headers
    
            Authorization: token
                 
+ Response 200 (application/json)

    + Body
    
            [10, 32, 21, 45, 9, 13, 37, 41]

+ Response 400 (application/json)

    + Body
    
            { "Message": "Bad input description" }
                        
+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }  
            
            
## Artwork Shortlisted [/api/v1/dashboard/shortlisted/artwork]

Returns the number of likes for a users artwork

### Artwork Likes [GET]

+ Request (application/json)

    + Headers
    
            Authorization: token
            
+ Response 200 (application/json)

    + Body
    
            { "Count": 135 }
            
            
## Artwork Shortlisted Over Time [/api/v1/dashboard/shortlisted/artwork/{interval}/{datapoints}]

Returns the number of times a users artwork was shortlisted per interval of time.

*NOTE:* Results are returned sorted oldest to newest

### Artwork Shortlisted Over Time [GET]

+ Parameters

    + interval (required, string, `month`) ... interval specified as 'day', 'week', 'month' 
    + datapoints (optional, number, `15`) ... number of datapoints to return: default = 15 max = 100
       
+ Request (application/json)

    + Headers
    
            Authorization: token
                 
+ Response 200 (application/json)

    + Body
    
            [10, 32, 21, 45, 9, 13, 37, 41]

+ Response 400 (application/json)

    + Body
    
            { "Message": "Bad input description" }
                        
+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }            


## Follower Stats [/api/v1/dashboard/followers]

Returns the total number 
### Follower Stats [GET]

+ Request (application/json)

    + Headers
    
            Authorization: token
            
+ Response 200 (application/json)

    + Body
    
            { 
                "Count": 1323
            }
            
            
            
## Follower Stats Over Time [/api/v1/dashboard/followers/{interval}/{datapoints}]

Returns the total number of followers a user had per interval of time.

*NOTE:* Results are returned sorted oldest to newest

### Follower Stats Over Time [GET]

+ Parameters

    + interval (required, string, `month`) ... interval specified as 'day', 'week', 'month' 
    + datapoints (optional, number, `15`) ... number of datapoints to return: default = 15 max = 100
       
+ Request (application/json)

    + Headers
    
            Authorization: token
                 
+ Response 200 (application/json)

    + Body
    
            [ 10, 14, 15, 17, 29, 33, 37, 41 ]
            
+ Response 400 (application/json)

    + Body
    
            { "Message": "Bad input description" }
                        
+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }



## Profile Views [/api/v1/dashboard/views/profile]

Returns the number of views for the logged in users profile

### Artwork Views [GET]

+ Request (application/json)

    + Headers
    
            Authorization: token
            
+ Response 200 (application/json)

    + Body
    
            { "Count": 135 }
            
     
## Profile Views [/api/v1/dashboard/views/profile/details]

Returns details of all the profile that have viewed the logged in users profile

### Artwork Views [GET]

+ Request (application/json)

    + Headers
    
            Authorization: token
            
+ Response 200 (application/json)

    + Body
    
            [{ 
                "ProfileID": 1,
                "Name": "Artist 1",
                "Type": "Artist",
                "ImageURI": "/path/to/image"
            },{
                "ProfileID": 2,
                "Name": "Gallery 1",
                "Type": "Gallery",
                "ImageURI": "/path/to/image"
            }]
                   


     
## View Important Notifications [/api/v1/dashboard/notifications]

Returns a handful of unread notifications for the current profile, choosen based on priority then by date.

Notifications marked as 'sticky' will always be shown even if they have been read by the user, sticky notifications generally require the user to complete a task (e.g. complete profile) before they are hidden.

### Artwork Views [GET]

+ Request (application/json)

    + Headers
    
            Authorization: token
            
+ Response 200 (application/json)

    + Body
    
            [{ 
                "ID": 1,
                "Subject": "Complete Profile",
                "Body": "Please complete your profile...",
                "Priority": 5,
                "Sticky": true,
                "SentDate": "2015-06-14T10:30:29.000Z"
            },{
                "ID": 2,
                "Subject": "Complete Profile",
                "Body": "Please complete your profile...",
                "Priority": 1,
                "Sticky": false,
                "SentDate": "2015-06-14T10:34:11.000Z"
            }]
                   

