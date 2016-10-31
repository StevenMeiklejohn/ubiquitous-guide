

## List Featured Art [/api/v2/profile/{profile_id}/featured-art]

Lists all featured artwork from a specific profile

### List Featured Art [GET]

+ Parameters

    + profile_id (required, number, `1`) ... ID of the Profile in form of an integer
    
+ Request (application/json)

    + Headers
    
            Authorization: token
            
+ Response 200

    + Body
    
            [{
                "Name": "Masterpiece 5",
                "Description": "Description...",
                "ImageURI": "/img/temp/art-5.png",
                "WidthMM": 10,
                "HeightMM": 10,
                "DepthMM": 10,
                "Priceband": { 
                    "Min": 500,
                    "Max": 1000
                },
                "Type": "Painting"
            }]


