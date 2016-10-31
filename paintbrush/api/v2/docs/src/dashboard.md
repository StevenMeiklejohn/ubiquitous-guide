 
   
## Artwork Likes [/api/v2/dashboard/{profile_id}/artwork/count/likes]

Returns the total number of artwork likes for a specific profile

### Artwork Likes [GET]

+ Parameters

    + profile_id (required, integer, `1`) ... ID of the profile

+ Request (application/json)

    + Headers
    
            Authorization: token
            
+ Response 200 (application/json)

    + Body
    
            { "Count": 135 }
            
+ Response 400 (application/json)

    + Body
    
            { "Message": "Bad input description" }
            
+ Response 403 (application/json)

    + Body
    
            { "Message": "You do not have permission to view this data" }
                        
+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }  
            

            
## Artwork Scans [/api/v2/dashboard/{profile_id}/artwork/count/scans]

Returns a profiles total number of AC scans

### Artwork Scans [GET]

+ Parameters

    + profile_id (required, integer, `1`) ... ID of the profile

+ Request (application/json)

    + Headers
    
            Authorization: token
            
+ Response 200 (application/json)

    + Body
    
            { "Count": 135 }
            
+ Response 400 (application/json)

    + Body
    
            { "Message": "Bad input description" }
            
+ Response 403 (application/json)

    + Body
    
            { "Message": "You do not have permission to view this data" }
                        
+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }  
   

 
            
## Artwork Shortlisted [/api/v2/dashboard/{profile_id}/artwork/count/shortlisted]

Returns a profiles total artworks that have been shortlisted

### Artwork Shortlisted [GET]

+ Parameters

    + profile_id (required, integer, `1`) ... ID of the profile

+ Request (application/json)

    + Headers
    
            Authorization: token
            
+ Response 200 (application/json)

    + Body
    
            { "Count": 135 }
            
+ Response 400 (application/json)

    + Body
    
            { "Message": "Bad input description" }
            
+ Response 403 (application/json)

    + Body
    
            { "Message": "You do not have permission to view this data" }
                        
+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }  
            

            
## Artwork Total [/api/v2/dashboard/{profile_id}/artwork/count/total]

Returns a profiles total number of artworks

### Artwork Total [GET]

+ Parameters

    + profile_id (required, integer, `1`) ... ID of the profile

+ Request (application/json)

    + Headers
    
            Authorization: token
            
+ Response 200 (application/json)

    + Body
    
            { "Count": 135 }
            
+ Response 400 (application/json)

    + Body
    
            { "Message": "Bad input description" }
            
+ Response 403 (application/json)

    + Body
    
            { "Message": "You do not have permission to view this data" }
                        
+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }  
          


## Artwork Views [/api/v2/dashboard/{profile_id}/artwork/count/views]

Returns the total number of artwork views for a specific profile

### Artwork Views [GET]

+ Parameters

    + profile_id (required, integer, `1`) ... ID of the profile

+ Request (application/json)

    + Headers
    
            Authorization: token
            
+ Response 200 (application/json)

    + Body
    
            { "Count": 135 }
            
+ Response 400 (application/json)

    + Body
    
            { "Message": "Bad input description" }
            
+ Response 403 (application/json)

    + Body
    
            { "Message": "You do not have permission to view this data" }
                        
+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }           
            
            
      
            
## Artwork Likes Over Time [/api/v2/dashboard/{profile_id}/artwork/interval/likes/{interval}/{datapoints}]

Returns the number of likes for a profiles artwork over a specific interval of time.

*NOTE:* Results are returned sorted oldest to newest

### Artwork Likes Over Time [GET]

+ Parameters

	+ profile_id (required, integer, `1`) ... ID of the profile
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
            
+ Response 403 (application/json)

    + Body
    
            { "Message": "You do not have permission to view this data" }
                        
+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }  
                       
            
            
## Artwork Scans Over Time [/api/v2/dashboard/{profile_id}/artwork/interval/scans/{interval}/{datapoints}]

Returns the number of AC scans for a profiles artwork over a specific interval of time.

*NOTE:* Results are returned sorted oldest to newest

### Artwork Scans Over Time [GET]

+ Parameters

	+ profile_id (required, integer, `1`) ... ID of the profile
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
            
+ Response 403 (application/json)

    + Body
    
            { "Message": "You do not have permission to view this data" }
                        
+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }  
            
    
    
   
            
## Artwork Shortlisted Over Time [/api/v2/dashboard/{profile_id}/artwork/interval/shortlisted/{interval}/{datapoints}]

Returns the number of times a profiles artwork was shortlisted per interval of time.

*NOTE:* Results are returned sorted oldest to newest

### Artwork Shortlisted Over Time [GET]

+ Parameters

	+ profile_id (required, integer, `1`) ... ID of the profile
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
            
+ Response 403 (application/json)

    + Body
    
            { "Message": "You do not have permission to view this data" }
                        
+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }            




     
            
## Artwork Total Over Time [/api/v2/dashboard/{profile_id}/artwork/interval/total/{interval}/{datapoints}]

Returns a profiles total number artworks over a specific interval of time.

*NOTE:* Results are returned sorted oldest to newest

### Artwork Total Over Time [GET]

+ Parameters

	+ profile_id (required, integer, `1`) ... ID of the profile
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
            
+ Response 403 (application/json)

    + Body
    
            { "Message": "You do not have permission to view this data" }
                        
+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }  
            
    
    
            
## Artwork Views Over Time [/api/v2/dashboard/{profile_id}/artwork/interval/views/{interval}/{datapoints}]

Returns the number of views for a users artwork per interval of time.

*NOTE:* Results are returned sorted oldest to newest

### Artwork Views Over Time [GET]

+ Parameters

	+ profile_id (required, integer, `1`) ... ID of the profile
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
            
+ Response 403 (application/json)

    + Body
    
            { "Message": "You do not have permission to view this data" }
                        
+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }  
            
    
    




## Profile Views [/api/v2/dashboard/{profile_id}/profile/count/views]

Returns the number of views for the logged in users profile

### Profile Views [GET]

+ Parameters

	+ profile_id (required, integer, `1`) ... ID of the profile
	
+ Request (application/json)

    + Headers
    
            Authorization: token
            
+ Response 200 (application/json)

    + Body
    
            { "Count": 135 }

+ Response 400 (application/json)

    + Body
    
            { "Message": "Bad input description" }
            
+ Response 403 (application/json)

    + Body
    
            { "Message": "You do not have permission to view this data" }
                        
+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }
            
     
## Profile Viewed Details [/api/v2/dashboard/{profile_id}/profile/viewed/details]

Returns details of all the profile that have viewed the a specific profile

### Profile Viewed Details [GET]

+ Parameters

	+ profile_id (required, integer, `1`) ... ID of the profile
	
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

+ Response 400 (application/json)

    + Body
    
            { "Message": "Bad input description" }
            
+ Response 403 (application/json)

    + Body
    
            { "Message": "You do not have permission to view this data" }
                        
+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }
                   






## Follower Stats [/api/v2/dashboard/{profile_id}/social/count/followers]

Returns the total number people following a profile

### Follower Stats [GET]

+ Parameters

	+ profile_id (required, integer, `1`) ... ID of the profile
	
+ Request (application/json)

    + Headers
    
            Authorization: token
            
+ Response 200 (application/json)

    + Body
    
            { 
                "Count": 1323
            }

+ Response 400 (application/json)

    + Body
    
            { "Message": "Bad input description" }
            
+ Response 403 (application/json)

    + Body
    
            { "Message": "You do not have permission to view this data" }
                        
+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }
            
            
            
## Follower Stats Over Time [/api/v2/dashboard/{profile_id}/social/interval/followers/{interval}/{datapoints}]

Returns the total number of followers a profile had over a specific interval of time.

*NOTE:* Results are returned sorted oldest to newest

### Follower Stats Over Time [GET]

+ Parameters

	+ profile_id (required, integer, `1`) ... ID of the profile
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
            
+ Response 403 (application/json)

    + Body
    
            { "Message": "You do not have permission to view this data" }
                        
+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }


     
## Important Notifications [/api/v2/dashboard/{profile_id}/notifications]

Returns a handful of unread notifications for the current profile, chosen based on priority then by date.

Notifications marked as 'sticky' will always be shown even if they have been read by the user, sticky notifications generally require the user to complete a task (e.g. complete profile) before they are hidden.

### Important Notifications [GET]

+ Parameters

	+ profile_id (required, integer, `1`) ... ID of the profile
	
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

+ Response 400 (application/json)

    + Body
    
            { "Message": "Bad input description" }
            
+ Response 403 (application/json)

    + Body
    
            { "Message": "You do not have permission to view this data" }
                        
+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }
                   

