
## View video [/api/v1/video/{video_id}]

View video details

### View artwork details [GET]

+ Parameters

    + video_id (required, number, `1`) ... ID of the video in form of an integer
    
+ Request (application/json)

    + Headers
    
            Authorization: token
            
+ Response 200 (application/json)

    + Body
    
            {
                "Name": "Artwork name",
                "Description": "Artwork Description",
                "Width": 1920,
                "Height": 1080,
                "Length": 90,
                "VideoURI": ""
            }
    

## Like video [/api/v1/video/{video_id}/like]

Like a video...
    
### Like video [GET]

+ Parameters

    + video_id (required, number, `1`) ... ID of the video in form of an integer

+ Request (application/json)

    + Headers
    
            Authorization: token
            
+ Response 200 (application/json)

    + Body
    
            { }
    
    

## Add video [/api/v1/video/add]

Adds a new video to the specified artwork

### Add a new video [POST]

+ Request (application/json)

    + Headers
    
            Authorization: token
            
    + Body
    
            {
                "Name": "Artwork name",
                "Description": "Artwork Description",
                "WidthMM": 1000,
                "HeightMM": 1500,
                "DepthMM: 35
            }
            
+ Response 201 (application/json)

    + Body
    
            { "ID": 1 }
    
    
## Update video [/api/v1/video/{video_id}/update]

Update video details

### Update video details [PUT]

+ Parameters

    + video_id (required, number, `1`) ... ID of the video in form of an integer
    
+ Request (application/json)

    + Headers
    
            Authorization: token
            
    + Body
    
            {
                "Name": "Video name",
                "Description": "Video Description",
                "WidthMM": 1000,
                "HeightMM": 1500,
                "DepthMM: 35
            }
            
            
+ Response 200 (application/json)

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
    
            { "Message": "Video Not Found" }

+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }
            
    
## Upload video [/api/v1/video/{video_id}/upload]

Upload video

### Upload video [POST]

+ Parameters

    + video_id (required, number, `1`) ... ID of the video in form of an integer
    
    
+ Request (b)

    + Headers
    
            Authorization: token
            
            
+ Response 200 (application/json)

    + Body
    
            { }
            
    
## Remove video [/api/v1/video/{video_id}/remove]

Remove a video...

### Remove video [DELETE]

+ Parameters

    + video_id (required, number, `1`) ... ID of the video in form of an integer

+ Request (application/json)

    + Headers
    
            Authorization: token
    
+ Response 204 (application/json)


+ Response 403 (application/json)

    + Body
    
            { "Message": "You do not have permission to remove this item" }
            
+ Response 400 (application/json)

    + Body
    
            { "Message": "Bad input description" }

+ Response 404 (application/json)

    + Body
    
            { "Message": "Video Not Found" }

+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }
            