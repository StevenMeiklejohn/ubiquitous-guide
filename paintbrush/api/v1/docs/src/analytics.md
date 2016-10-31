


## List event types [/api/v1/analytics/event/list]

Lists all events that are not automatically recorded by this API.

Each event object details any additional fields that must be passed back when recording the event.
    
### List event types [GET]

+ Request (application/json)

    + Headers
    
            Authorization: token
            
+ Response 200 (application/json)

    + Body
                          
			[
				{
					"ID": 1,
					"Description": "Initialised Scan",
					"ArtworkID": false,
					"ArtistID": false,
					"ShortlistID": false,
					"VideoID": false
				},{
					"ID": 2,
					"Description": "Scanned Artwork",
					"ArtworkID": true,
					"ArtistID": false,
					"ShortlistID": false,
					"VideoID": false
            	},{
            		"ID": 3,
            		"Description": "Played Video",
            		"ArtworkID": true,
            		"ArtistID": false,
            		"ShortlistID": false,
            		"VideoID":true
            	},{
            		"ID": 4,
            		"Description": "Skipped Video",
            		"ArtworkID": true,
            		"ArtistID": false,
            		"ShortlistID": false,
            		"VideoID":true
            	},{
            		"ID": 5,
            		"Description": "Finished Video",
            		"ArtworkID": true,
            		"ArtistID": false,
            		"ShortlistID": false,
            		"VideoID":true
            	},{
            		"ID": 6,
            		"Description": "Shared Artwork",
            		"ArtworkID": true,
            		"ArtistID": false,
            		"ShortlistID": false,
            		"VideoID": false
            	},{
            		"ID": 7,
            		"Description": "Viewed Artwork Information",
            		"ArtworkID": true,
            		"ArtistID": false,
            		"ShortlistID": false,
            		"VideoID": false
            	},{
            		"ID": 8,
            		"Description": "Viewed Artist Information",
            		"ArtworkID": false,
            		"ArtistID": true,
            		"ShortlistID": false,
            		"VideoID": false
            	},{
            		"ID": 9,
            		"Description": "Dirty Buy",
            		"ArtworkID": true,
            		"ArtistID": false,
            		"ShortlistID": false,
            		"VideoID": false
            	},{
            		"ID": 10,
            		"Description": "Enquire to Buy",
            		"ArtworkID": true,
            		"ArtistID": false,
            		"ShortlistID": false,
            		"VideoID": false
            	}
            ]
            

+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }



## Record event [/api/v1/analytics/event/]

Records a new analytics event.
    
### Record event [POST]

+ Request (application/json)

    + Headers
    
            Authorization: token
            
	+ Body
	
			{
				"EventID": 1,
				"ArtworkID": 123
			}
            
+ Response 200 (application/json)

    + Body
    
            { "Message": "Success" }  

+ Request (application/json)

    + Headers
    
            Authorization: token
            
	+ Body
	
			{
				"EventID": 2,
				"ArtworkID": 123,
				"VideoID": 61
			}
            
+ Response 200 (application/json)

    + Body
    
            { "Message": "Success" }       
            

+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }

