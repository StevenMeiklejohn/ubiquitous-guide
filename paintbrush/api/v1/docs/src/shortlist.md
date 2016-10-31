
## Add a new shortlist [/api/v1/shortlist/add]

Creates a new shortlist for the current profile.

*NOTE*: Call /api/shortlist/types for a full list of shortlist types

### Add a new shortlist [POST]

+ Request (application/json)

    + Headers
    
            Authorization: token
            
    + Body
    
            {
                "TypeID": 1,
                "Name": "Shortlist Name",
                "Description": "Shortlist Description"
            }
    
+ Response 201 (application/json)

    + Body
    
            { 
                "ID": 1,
                "Message": "Success"
            }
                  
+ Response 400 (application/json)

    + Body
    
            { "Message": "Bad input description" }

+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }



## Update a shortlist [/api/v1/shortlist/{shortlist_id}/update]

Updates an existing shortlist.

### Update a shortlist [PUT]

+ Request (application/json)

    + Headers
    
            Authorization: token
            
    + Body
    
			{
				"Name": "Shortlist Name",
				"Description": "Shortlist Description",
				"Target": 100
			}
    
+ Response 200 (application/json)

    + Body
    
            { 
                "Message": "Success"
            }
                  
+ Response 400 (application/json)

    + Body
    
            { "Message": "Bad input description" }
            
                  
+ Response 403 (application/json)

    + Body
    
            { "Message": "You do not have permission to update this shortlist" }

+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }



## View a shortlist [/api/v1/shortlist/{shortlist_id}/view]

Views a shortlist and it's items.

### View a shortlist [GET]

+ Parameters

    + shortlist_id (required, number, `1`) ... ID of the shortlist in form of an integer
    
+ Request (application/json)

    + Headers
    
            Authorization: token
            
+ Response 200 (application/json)

    + Body
    
            {
                "ID": 1,
                "TypeID": 2,
                "Name": "Artwork Shortlist",
                "Description": "Artwork Shortlist Example",
                "Items": [{
					"ID": 5593,
					"Name": "Artwork 1",
					"Description": "Artwork 1...",
					"ImageURI": "...",
					"ImageHeight": 900,
					"ImageWidth": 600,
					"ProfileImageURI":"...",
					"ArtistName":"Artist 1",
					"Colours":[
						{
							"R": 140, "G": 148, "B": 11, "Priority": 1
						},{
							"R":52, "G":18, "B":35, "Priority": 2
						},{
							"R": 74, "G": 34, "B": 64, "Priority": 3
						},{
							"R": 97, "G": 115, "B": 132, "Priority": 4
						},{
							"R": 212, "G": 187, "B": 19, "Priority": 5
						},{
							"R": 191, "G": 196, "B": 41, "Priority": 6
						}
					]},
					{
						"ID":5594,
						"Name":"Artwork 2",
						"Description":"Artwork 2...",
						"ImageURI":"...",
						"ImageHeight":1421,
						"ImageWidth":1417,
						"ProfileImageURI":"...",
						"ArtistName":"Artist 2",
						"Colours":[]
					}
				]
            }
            
+ Request (application/json)

	+ Headers
	
			Authorization: token
			
+ Response 200 (application/json)

	+ Body
	
			{
				"ID": 1,
				"TypeID": 1,
				"Name": "Artist Shortlist",
				"Description": "Artist Shortlist Example",
				"Items": [
					{
						"ID": 1,
						"ArtistID": 126
					},{
						"ID": 2,
						"ArtistID": 127
					},{
						"ID": 3,
						"ArtistID": 128
					}
				]
			}
                  
+ Response 400 (application/json)

    + Body
    
            { "Message": "Bad input description" }

+ Response 404 (application/json)

    + Body
    
            { "Message": "Shortlist Not Found" }
            
+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }
            

## Archive a shortlist [/api/v1/shortlist/{shortlist_id}/archive]

Marks a shortlist as complete making it readonly.

### Archive a shortlist [PUT]

+ Parameters

    + shortlist_id (required, number, `1`) ... ID of the shortlist in form of an integer
    
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
    
            { "Message": "You do not have permission to update this item" }
            
+ Response 404 (application/json)

    + Body
    
            { "Message": "Shortlist Not Found" }
            
+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }
            

## Add Items [/api/v1/shortlist/{shortlist_id}/add]

Adds a collection of items to an existing shortlist.

### Add items [POST]

*NOTE:* You can only pass up either an array of Artist ID's or an array of Artwork ID's depending on the type of shortlist 

+ Parameters

    + shortlist_id (required, number, `1`) ... ID of the shortlist in form of an integer
    
+ Request (application/json)

    + Headers
    
            Authorization: token
            
    
    + Body
    
            {
                "Artists": [6],
                "Artworks": [1, 3, 87, 4, 953]
            }
            
            
    
+ Response 200 (application/json)

    + Body
    
            {
                "Artists": 0,
                "Artworks": 5,
                "Message": "Success"
            }
                  
+ Response 400 (application/json)

    + Body
    
            { "Message": "Bad input description" }

+ Response 403 (application/json)

    + Body
    
            { "Message": "You do not have permission to update this item" }
            
+ Response 404 (application/json)

    + Body
    
            { "Message": "Shortlist Not Found" }
            
+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }
            

## List all active shortlists [/api/v1/shortlist]

Lists the current profiles active shortlists.

### List all active shortlists [GET]

+ Request (application/json)

    + Headers
    
            Authorization: token
            
            
+ Response 200 (application/json)

    + Body
    
            [{ 
                "ID": 1,
                "TypeID": 1,
                "Type": "Artist",
                "Name": "Artist Shortlist",
                "Description": "Shortlist Description"
            }, { 
                "ID": 2,
                "TypeID": 2,
                "Type": "Artwork",
                "Name": "Artwork Shortlist",
                "Description": "Shortlist Description"
            }]

+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }

## List all shortlist types [/api/v1/shortlist/types]

Lists all types of shortlist.

### List all shortlist types [GET]

+ Request (application/json)

    + Headers
    
            Authorization: token
            
            
+ Response 200 (application/json)

    + Body
    
            [{ 
                "ID": 1,
                "Type": "Artist"
            }, { 
                "ID": 2,
                "Type": "Artwork"
            }]
            
+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }
       
       

       
## Remove shortlist artwork [/api/v1/shortlist/{shortlist_id}/artwork/{artwork_id}/remove]

Permanently deletes artwork from a shortlist.

### Remove shortlist artwork  [DELETE]

+ Parameters

    + shortlist_id (required, number, `1`) ... ID of the shortlist in form of an integer
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
    
            { "Message": "You do not have permission to remove this item" }
            
+ Response 404 (application/json)

    + Body
    
            { "Message": "Shortlist not found" }
            
+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }
                  
       
       
## Remove a shortlist [/api/v1/shortlist/{shortlist_id}/remove]

Permanently deletes a shortlist.

### Remove a shortlist [DELETE]

+ Parameters

    + shortlist_id (required, number, `1`) ... ID of the shortlist in form of an integer
    
+ Request (application/json)

    + Headers
    
            Authorization: token
            
+ Response 204 (application/json)

+ Response 400 (application/json)

    + Body
    
            { "Message": "Bad input description" }

+ Response 403 (application/json)

    + Body
    
            { "Message": "You do not have permission to remove this item" }
            
+ Response 404 (application/json)

    + Body
    
            { "Message": "Shortlist Not Found" }
            
+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }
            



