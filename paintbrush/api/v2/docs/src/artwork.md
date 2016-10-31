

        
## Add artwork [/api/v2/artwork/add]

Adds a new piece of artwork to the specified profile

### Add new artwork [POST]

*NOTE:* All artwork will be automatically activated for ActivCanvas.

+ Request (application/json)

    + Headers
    
            Authorization: token

    + Body
    
            {
            	"ProfileID": 1234,
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
            
+ Response 403 (application/json)

    + Body
    
            { "Message": "You do not have permission to perform this action" }

+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }
    
    
            
            
## Bulk add artwork [/api/v2/artwork/bulk-add]

Adds multiple pieces of artwork to the specified profile

### Bulk add new artwork [POST]

*NOTE:* Only a limited number of artwork fields can be set using this method

+ Request (application/json)

    + Headers
    
            Authorization: token

    + Body
    
            {
            	"ProfileID": 1234,
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
            
+ Response 403 (application/json)

    + Body
    
            { "Message": "You do not have permission to perform this action" }

+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }
    
    

## Like artwork [/api/v2/artwork/{artwork_id}/like/{profile_id}]

Like an artwork...
    
### Like artwork [GET]

+ Parameters

    + artwork_id (required, integer, `1`) ... ID of the artwork in form of an integer
    + profile_id (optional, integer, `1`) ... Like artwork on behalf of this profile, if not specified defaults to the current users profile

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
    
            { "Message": "You do not have permission to perform this action" }
            

+ Response 404 (application/json)

    + Body
    
            { "Message": "Artwork Not Found" }

+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }

    

## Unlike artwork [/api/v2/artwork/{artwork_id}/unlike/{profile_id}]

Un-likes an artwork...
    
### Unlike artwork [GET]

+ Parameters

    + artwork_id (required, integer, `1`) ... ID of the artwork in form of an integer
    + profile_id (optional, integer, `1`) ... Un-like artwork on behalf of this profile, if not specified defaults to the current users profile

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
    
            { "Message": "You do not have permission to perform this action" }
            

+ Response 404 (application/json)

    + Body
    
            { "Message": "Artwork Not Found" }

+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }


## List price bands [/api/v2/artwork/pricebands]

Lists all artwork price bands

### List price bands [GET]

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
     
                        
## List statuses [/api/v2/artwork/statuses]

Lists all available artwork statuses

### List statuses [GET]

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
    
            
## List styles [/api/v2/artwork/styles]

Lists all available artwork styles

### List styles [GET]

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
    
    
## List subjects [/api/v2/artwork/subjects]

Lists all artwork subjects

### List subjects [GET]

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
    
        
## List time spent options [/api/v2/artwork/time-spent]

Lists all artwork time spent options

### List time spent options [GET]

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
    
    
## List types [/api/v2/artwork/types]

Lists all artwork types

### List types [GET]

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
    
                        
            
## List unit dimensions [/api/v2/artwork/dimension-units]

List unit dimensions

### List unit dimensions [GET]

+ Request (application/json)

    + Headers
    
            Authorization: token
            
+ Response 200 (application/json)

    + Body
    
            [{
            	"ID": 1,
            	"Name": "Millimetres",
            	"Symbol": "mm",
            	"Ratio_MM": 1
            }, {
            	"ID": 2,
            	"Name": "Centimetres ",
            	"Symbol": "cm",
            	"Ratio_MM": 10
            }, {
            	"ID": 3,
            	"Name": "Metres",
            	"Symbol": "m",
            	"Ratio_MM": 1000
            }, {
           		"ID": 4,
           		"Name": "Inches",
           		"Symbol": "\"",
           		"Ratio_MM": 25.4
			},{
				"ID": 5,
				"Name": "Feet",
				"Symbol": "'",
				"Ratio_MM": 304.8
			}]
       



## Record artwork view [/api/v2/artwork/{artwork_id}/viewed]

*DEPRECATED:* This method has been replace by the <a href="#analytics-record-event">analytics endpoint</a>

Records an artwork being viewed by the current user, this increments the 'viewed' count by 1 for the specified artwork.

*NOTE:* The current user is determined from the authorisation token in the header.
    
### Record artwork view [GET]

+ Parameters

    + artwork_id (required, integer, `1`) ... ID of the artwork in form of an integer

+ Request (application/json)

    + Headers
    
            Authorization: token
            
+ Response 400 (application/json)

    + Body
    
            { "Message": "Deprecated" }    
            

## Remove artwork [/api/v2/artwork/{artwork_id}/remove]

Removes the specified artwork from the system.

### Remove artwork [DELETE]

+ Parameters

    + artwork_id (required, integer, `1`) ... ID of the artwork in form of an integer

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

            

## Search Artwork [/api/v2/artwork/search]

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
             
## Tag Autocomplete [/api/v2/artwork/tag/autocomplete/{tag_text}]

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
    
      

## Update artwork [/api/v2/artwork/{artwork_id}/update]

Update artwork details

### Update artwork details [PUT]

+ Parameters

    + artwork_id (required, integer, `1`) ... ID of the artwork in form of an integer
    
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
            
            
    
## Upload artwork [/api/v2/artwork/upload]

*DEPRECATED:* This method has been replace by the <a href="#s3">S3 endpoint</a>

Upload artwork images

### Upload artwork image [POST]

+ Request (multipart/form-data)

    + Headers
    
            Authorization: token

            
+ Response 400 (application/json)

    + Body
    
            { "Message": "Deprecated" }
            
            
## View artwork [/api/v2/artwork/{artwork_id}]

View artwork details

### View artwork details [GET]

+ Parameters

    + artwork_id (required, integer, `1`) ... ID of the artwork in form of an integer
    
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
  
              
             


