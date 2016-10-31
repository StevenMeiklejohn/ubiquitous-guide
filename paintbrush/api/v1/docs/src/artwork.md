

## Like artwork [/api/v1/artwork/{artwork_id}/action/like]

Like an artwork...
    
### Like artwork [GET]

+ Parameters

    + artwork_id (required, number, `1`) ... ID of the artwork in form of an integer

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
    
            { "Message": "Artwork Not Found" }

+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }

    

## Record artwork view [/api/v1/artwork/{artwork_id}/action/viewed]

*DEPRECATED:* This endpoint has been replace by the <a href="#analytics-record-event">analytics endpoint</a>

Records an artwork being viewed by the current user, this increments the 'viewed' count by 1 for the specified artwork.

*NOTE:* The current user is determined from the authorisation token in the header.
    
### Record artwork view [GET]

+ Parameters

    + artwork_id (required, number, `1`) ... ID of the artwork in form of an integer

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
    
            { "Message": "Artwork Not Found" }

+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }

    
## Remove artwork [/api/v1/artwork/{artwork_id}/remove]

Removes the specified artwork from the system.

### Remove artwork [DELETE]

+ Parameters

    + artwork_id (required, number, `1`) ... ID of the artwork in form of an integer

+ Request (application/json)

    + Headers
    
            Authorization: token
            
+ Response 204 (application/json)
            
+ Response 400 (application/json)

    + Body
    
            { "Message": "Bad input description" }

+ Response 403 (application/json)

    + Body
    
            { "Message": "You do not have permission to remove this artwork" }
            
+ Response 404 (application/json)

    + Body
    
            { "Message": "Artwork Not Found" }

+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }
            
    
## View artwork [/api/v1/artwork/{artwork_id}]

View artwork details

### View artwork details [GET]

+ Parameters

    + artwork_id (required, number, `1`) ... ID of the artwork in form of an integer
    
+ Request (application/json)

    + Headers
    
            Authorization: token
            
+ Response 200 (application/json)

    + Body
    
            {
            	"ID": 1,
            	"ArtworkTypeID": 3,
				"ArtistProfileID": 4535,
				"StatusID": 1,
				"TimeSpentID": 2,
                "Name": "Artwork name",
                "ArtistName": "Artist name",
                "Description": "Artwork Description",
                "ImageURI": "/img/example.jpg",
                "ProfileImageURI": "/img/example.jpg",
                "WidthMM": 1000,
                "HeightMM": 1500,
                "DepthMM": 35,
                "LimitedEdition": true,
                "LimitedEditionDetails": "2/40",
                "Liked": false,
                "Complete": true,
                "VideoID": null,
				"TrackingRating": 4,
				"SyncRequired": false,
                "Materials": [4, 6, 31],
                "Styles": [10],
                "Subjects": [1, 23],
                "Tags": ["Apple", "Fruit"],
                "Price": 500.00, // price of artwork in GBP 
                "Shareable": true, // this image can be shared on social media sites
                "Shortlisted": 6, // total times artwork has been shortlisted by any user
                "Shortlists": [1, 8], // id of current users shortlists containing this artwork
                "Colours": [{
                    "R": 0,
                    "G": 210,
                    "B": 40,
                    "Priority": 1
                }, {
                    "R": 30,
                    "G": 172,
                    "B": 233,
                    "Priority": 2
                }],
                "VideoTranscodes":[{
                	"VideoID": 34,
                	"VideoURI":".../index.m3u8",
                	"Type":"HLS"
                },{
                	"VideoID": 34,
                	"VideoURI":".../320.mp4",
                	"Type":"MP4"
                }]
            }
                        
+ Response 400 (application/json)

    + Body
    
            { "Message": "Bad input description" }

+ Response 403 (application/json)

    + Body
    
            { "Message": "You do not have permission to view this artwork" }
            
+ Response 404 (application/json)

    + Body
    
            { "Message": "Artwork Not Found" }

+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }
        
        
## Add artwork [/api/v1/artwork/add]

Adds a new piece of artwork to the specified profile

### Add new artwork [POST]

+ Request (application/json)

    + Headers
    
            Authorization: token

    + Body
    
            {
                "Name": "Artwork name",
                "Description": "Artwork Description",
                "PricebandID": 2,
                "ArtworkTypeID": 1,
                "StatusID": 1,
                "TimeSpentID": 3,
                "ImageURI": "/path/to/image",
                "ImageColours": [ 
                    [ r, g, b ],
                    [ r, g, b ],
                    [ r, g, b ],
                    [ r, g, b ]
                ],
                "WidthMM": 1000,
                "HeightMM": 1500,
                "DepthMM": 35,
                "DimensionUnitID": 1,
                "LimitedEdition": true,
                "LimitedEditionDetails": "2/43",
                "Complete": true,
                "Featured": false,
                "Materials": [ 1, 67 ],
                "Styles": [ 4 ],
                "Subjects": [ 13, 15 ],
                "Tags": [ "tag 1", "tag 2" ]
            }
            
+ Response 200 (application/json)

    + Body
    
            { 
                "ID": 1 
            }
            
+ Response 400 (application/json)

    + Body
    
            { "Message": "Bad input description" }

+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }
    
    
## Update artwork [/api/v1/artwork/{artwork_id}/update]

Update artwork details

### Update artwork details [PUT]

+ Parameters

    + artwork_id (required, number, `1`) ... ID of the artwork in form of an integer
    
+ Request (application/json)

    + Headers
    
            Authorization: token
            
    + Body
    
            {
                "Name": "Artwork name",
                "Description": "Artwork Description",
                "PricebandID": 2,
                "ArtworkTypeID": 1,
                "StatusID": 1,
                "TimeSpentID": 3,
                "ImageURI": "/path/to/image",
                "ImageColours": [ 
                    [ r, g, b ],
                    [ r, g, b ],
                    [ r, g, b ],
                    [ r, g, b ]
                ],
                "WidthMM": 1000,
                "HeightMM": 1500,
                "DepthMM": 35,
                "DimensionUnitID": 1,
                "LimitedEdition": true,
                "LimitedEditionDetails": "2/43",
                "Complete": true,
                "Featured": false,
                "Materials": [ 1, 67 ],
                "Styles": [ 4 ],
                "Subjects": [ 13, 15 ],
                "Tags": [ "tag 1", "tag 2" ]
            }
            
            
+ Response 200 (application/json)

    + Body
    
            { "Message": "Success" }    
            
+ Response 400 (application/json)

    + Body
    
            { "Message": "Bad input description" }

+ Response 403 (application/json)

    + Body
    
            { "Message": "You do not have permission to update this artwork" }
            
+ Response 404 (application/json)

    + Body
    
            { "Message": "Artwork Not Found" }

+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }
            
            
    
## Upload artwork [/api/v1/artwork/upload]

Upload artwork images

### Upload artwork image [POST]

+ Request (multipart/form-data)

    + Headers
    
            Authorization: token

            
+ Response 200 (application/json)

    + Body
    
            {
                "Location": "path to file on server",
                "Filename": "generated unique filename",
                "OriginalFilename": "original filename"
            }
            
            
## List pricebands [/api/v1/artwork/pricebands]

Lists all artwork pricebands

### List pricebands [GET]

+ Request (application/json)

    + Headers
    
            Authorization: token
            
+ Response 200 (application/json)

    + Body
    
            [{
                "ID": 1,
                "Min": 0, 
                "Max": 500
            }, {
                "ID": 2,
                "Min": 500, 
                "Max": 1000
            }]
    

                        
            
## List unit dimensions [/api/v1/artwork/dimension-units]

List unit dimensions

### List unit dimensions [GET]

+ Request (application/json)

    + Headers
    
            Authorization: token
            
+ Response 200 (application/json)

    + Body
    
            [{
                "ID": 1,
                "Name": "", 
                "Symbol": 500
            }, {
                "ID": 2,
                "Name": 500, 
                "Symbol": 1000
            }]
    

            
            
## Tag Autocomplete [/api/v1/artwork/tag/autocomplete/{tag_text}]

Returns a list of existing tags that match the specified text snippet.

*NOTE:* This call will only return the first 20 matches.

### Tag Autocomplete [GET]

+ Request (application/json)

    + Headers
    
            Authorization: token
            
+ Response 200 (application/json)

    + Body
    
            [
                "Tag 1",
                "Tag 2",
                "Tag 3"
            ]
    

            
## List artwork statuses [/api/v1/artwork/statuses]

Lists all available artwork statuses

### List artwork statuses [GET]

+ Request (application/json)

    + Headers
    
            Authorization: token
            
+ Response 200 (application/json)

    + Body
    
            [{
                "ID": 1,
                "Style": "Currently available"
            },{
                "ID": 2,
                "Style": "Currently in an exhibition"
            },{
                "ID": 3,
                "Style": "Sold"
            }]
    
            
## List artwork styles [/api/v1/artwork/styles]

Lists all available artwork styles

### List artwork styles [GET]

+ Request (application/json)

    + Headers
    
            Authorization: token
            
+ Response 200 (application/json)

    + Body
    
            [{
                "ID": 1,
                "Style": "Abstract"
            },{
                "ID": 2,
                "Style": "Graffiti"
            }]
    
    
## List artwork subjects [/api/v1/artwork/subjects]

Lists all artwork subjects

### List artwork subjects [GET]

+ Request (application/json)

    + Headers
    
            Authorization: token
            
+ Response 200 (application/json)

    + Body
    
            [{
                "ID": 1,
                "Subject": "Nude"
            }, {
                "ID": 2,
                "Subject": "Portrait and People"
            }, {
                "ID": 3,
                "Subject": "Cityscape"
            }]
    
        
## List artwork time spent options [/api/v1/artwork/time-spent]

Lists all artwork time spent options

### List artwork time spent optoins [GET]

+ Request (application/json)

    + Headers
    
            Authorization: token
            
+ Response 200 (application/json)

    + Body
    
            [{
                "ID": 1,
                "Subject": "Under 24 hours"
            }, {
                "ID": 2,
                "Subject": "24 - 50 hours"
            }, {
                "ID": 3,
                "Subject": "50 - 150 hours"
            }]
    
    
## List artwork types [/api/v1/artwork/types]

Lists all artwork types

### List artwork types [GET]

+ Request (application/json)

    + Headers
    
            Authorization: token
            
+ Response 200 (application/json)

    + Body
    
            [{
                "ID": 1,
                "Type": "Digital Art", 
                "Description": "Digital Art"
            }, {
                "ID": 2,
                "Type": "Fiber Art", 
                "Description": "Fiber Art"
            }, {
                "ID": 3,
                "Type": "Glass", 
                "Description": "Glass"
            }]
    




## Search Artwork [/api/v1/artwork/search]

Searches through artwork associated with a single profile, or all artwork belonging to connected profiles

### Search Artwork [POST]

+ PageSize - optional, default = 10, min = 1, max = 100
+ PageNumber - optional, default = 0
+ Filters - all filters are optional and without default values, therefore they will not be applied if left unspecified.
+ TotalResults - this count will be returned in every response along with the actual pagination settings used for the query

+ Request (application/json)

    + Headers
    
            Authorization: token
            
    +   Body
    
            { 
                "Pagination": { "PageSize": 10, "PageNumber": 0 },
                "Filters": {
                    "ArtistProfileID": 1,
                    "OwnerProfileID": 1,
                    "ConnectedProfileID": 1,
                    "Colour": [
                        { R: 255, G: 128, B: 0 },
                        { R: 64, G: 64, B: 200 }
                    ],
                }
            }
            
    
+ Response 200 (application/json)

    + Body
    
            { 
                "Data": [ ... ],
                "Pagination": {
                    "PageSize": 10,
                    "PageNumber": 0,
                    "TotalResults": 1234
                }
            }
            


