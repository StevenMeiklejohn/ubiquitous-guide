Users can only make a limited number of connection requests per week/month.

Additional time constraint might be required before additional requests can be made to the same user.

For example:  User A requests to connect to User B, User B rejects/ignores request, User A cannot send 
another request to User B until n weeks/months have passed but can send requests to other users within this time period.


## Request Connection [/api/v2/connections/connect]

Requests a connection from the current profile.

### Request a connection [POST]

+ Request (application/json)

    + Headers
    
            Authorization: token
            
    + Body
    
            {
                "ProfileID": 1,
                "Message": "It's me - Greg! I'd like to connect"
            }
    
+ Response 201 (application/json)

    + Body
    
            { 
                "Message": "Success"
            }
                  
+ Response 400 (application/json)

    + Body
    
            { "Message": "Bad input description" }
            
+ Response 403 (application/json)

    + Body
    
            { "Message": "Details of when the next request is allowed to the ProfileID" }

+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }
            
            
## Accept Connection Request [/api/v2/connections/accept/{request_id}]

Accepts a connection request for the current profile.

### Accept Connection Request [GET]

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
    
            { "Message": "Connection Request Not Found" }

+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }
            
     
## Reject Connection Request [/api/v2/connections/reject/{request_id}]

Rejects a connection request for the current profile.

### Reject Connection Request [GET]

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
    
            { "Message": "Connection Request Not Found" }

+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }
            

## List Pending Requests [/api/v2/connections/pending]

Lists pending connection requests for the current profile.

### List Pending Requests [GET]

+ Request (application/json)

    + Headers
    
            Authorization: token
            
+ Response 200 (application/json)

    + Body
    
            [
                { "ID": 101 },
                { "ID": 102 }
            ]

+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }
            
            
## List Accepted Requests [/api/v2/connections/accepted]

Lists accepted connection requests for the current profile.

### List Accepted Requests [GET]

+ Request (application/json)

    + Headers
    
            Authorization: token
            
+ Response 200 (application/json)

    + Body
    
            [
                { "ID": 201 },
                { "ID": 302 }
            ]

+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }
            
            
## List Rejected Requests [/api/v2/connections/rejected]

Lists rejected connection requests for the current profile.

### List Rejected Requests [GET]

+ Request (application/json)

    + Headers
    
            Authorization: token
            
+ Response 200 (application/json)

    + Body
    
            [
                { "ID": 441 },
                { "ID": 482 }
            ]

+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }
            
            
## Search Connections [/api/v2/connections/search]

Searches the current profiles connections

+ PageSize - optional, default = 10, min = 1, max = 100
+ PageNumber - optional, default = 0
+ Filters - all filters are optional
+ Sort - sort field and direction
+ TotalResults - this count will be returned in every response along with the actual pagination settings requested

### Search Connections [POST]

+ Request (application/json)

    + Headers
    
            Authorization: token
            
    + Body
    
            { 
                "Pagination": { "PageSize": 10, "PageNumber": 0 },
                "Filters": {
                   // TBC
                },
                "Sort": { "SortField": "Name", "SortOrder": 0 }
            }
            
    
+ Response 200 (application/json)

    + Body
    
            { 
                "Data": [{
                    "ProfileID": 18,
                    "Name": "Adolf MacDonald",
                    "ImageURI": "/img/artist-3.jpg"
                    // additional fields...
                }, {
                    "ProfileID": 31,
                    "Name": "Greg Krunch",
                    "ImageURI": "/img/artist-5.jpg"
                    // additional fields...
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
            
