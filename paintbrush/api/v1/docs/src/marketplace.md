

## Recommended Artists [/api/v1/marketplace/recommended]

Fetches recommended artists for the current user.  This is currently the top 10 shortlised artists.

### Recommended Artists [GET]
    
+ Request (application/json)

    + Headers
    
            Authorization: token
            
    
+ Response 200 (application/json)

    + Body
    
            [ {
                "ArtistID": 3,
                "ProfileID": 18,
                "Name": "Adolf MacDonald",
                "ProfileImageURI": "/img/artist-3.jpg",
                "ArtworkID": 501,
                "ArtworkTitle": "Big City",
                "ImageURI": "/img/artwork-501.jpg",
                "TotalArtwork": 17,
                "TotalViews": 2017,
                "TotalLikes": 183,
                "TotalShortlisted": 207
            }, {
                "ArtistID": 5,
                "ProfileID": 31,
                "Name": "Greg Krunch",
                "ProfileImageURI": "/img/artist-5.jpg",
                "ArtworkID": 421,
                "ArtworkTitle": "Creatures",
                "ImageURI": "/img/artwork-421.jpg",
                "TotalArtwork": 9,
                "TotalViews": 1042,
                "TotalLikes": 142,
                "TotalShortlisted": 188
            } ]
            
            
## Search Artists [/api/v1/marketplace/search]

Fetches artists with optional search parameters.

+ PageSize - optional, default = 10, min = 1, max = 100
+ PageNumber - optional, default = 0
+ Filters - all filters are optional
+ Sort - sort field and direction
+ TotalResults - this count will be returned in every response along with the actual pagination settings requested

### Search Artists [POST]

+ Request (application/json)

    + Headers
    
            Authorization: token
            
    + Body
    
            { 
                "Pagination": { "PageSize": 10, "PageNumber": 0 },
                "Filters": {
                    "Text": "text search",
                    "Style": [ 2, 4, 5 ],
                    "Material": [102, 107],
                    "Price": [401, 409],
                    "Subject": [25, 27, 28],
                    "Colour": [
                        { R: 255, G: 128, B: 0 },
                        { R: 64, G: 64, B: 200 }
                    ],
                    "Type": [ 7, 9 ]
                },
                "Sort": { "SortField": "Views", "SortOrder": 0 }
            }
            
    
+ Response 200 (application/json)

    + Body
    
            { 
                "Data": [{
                    "ArtistID": 3,
                    "ProfileID": 18,
                    "Name": "Adolf MacDonald",
                    "ImageURI": "/img/artist-3.jpg",
                    "ArtworkID": 501,
                    "ArtworkTitle": "That's MY hotdog",
                    "ArtworkURI": "/img/artwork-501.jpg",
                    "TotalArtwork": 17,
                    "TotalViews": 2017,
                    "TotalLikes": 183
                }, {
                    "ArtistID": 5,
                    "ProfileID": 31,
                    "Name": "Greg Krunch",
                    "ImageURI": "/img/artist-5.jpg",
                    "ArtworkID": 421,
                    "ArtworkTitle": "Androids",
                    "ArtworkURI": "/img/artwork-421.jpg",
                    "TotalArtwork": 9,
                    "TotalViews": 1042,
                    "TotalLikes": 142
                } ],
                "Pagination": {
                    "PageSize": 10,
                    "PageNumber": 0,
                    "TotalResults": 1234
                }
            }
            
+ Response 400 (application/json)

    + Body
    
            { "Message": "Bad input description" }
                        
+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }


## Popular Artwork by Artist [/api/v1/marketplace/popular/{ArtistID}/{PageSize}/{PageNumber}]

Fetches popular artwork by the requested artist

+ PageSize - optional, default = 10, min = 1, max = 100
+ PageNumber - optional, default = 0
+ TotalResults - this count will be returned in every response along with the actual pagination settings used for the query

### Popular Artwork by Artist [GET]

+ Parameters

    + ArtistID (required, number, `1`) ... integer
    + PageSize (optional, number, `10`) ... integer
    + PageNumber (optional, number, `0`) ... integer


+ Request (application/json)

    + Headers
    
            Authorization: token
            
    
+ Response 200 (application/json)

    + Body
    
            { 
                "Data": [{
                    "ArtworkID": 501,
                    "ArtworkTitle": "Big City",
                    "ArtworkURI": "/img/artwork-501.jpg",
                    "TotalViews": 127,
                    "TotalLikes": 98
                }, {
                    "ArtworkID": 421,
                    "ArtworkTitle": "Inner Workings",
                    "ArtworkURI": "/img/artwork-421.jpg",
                    "TotalViews": 1042,
                    "TotalLikes": 142
                } ],
                "Pagination": {
                    "PageSize": 10,
                    "PageNumber": 0,
                    "TotalResults": 17
                }
            }
            