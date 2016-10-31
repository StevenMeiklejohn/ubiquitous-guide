

## List all workspaces [/api/v2/workspaces]

Lists all artist workspaces.

### List all workspaces [GET]

+ Request (application/json)

    + Headers
    
            Authorization: token
            
            
+ Response 200 (application/json)

    + Body
    
            [{ 
                "ID": 1,
                "Description": "Commercial galleries"
            }, { 
                "ID": 2,
                "Description": "Commercial offices/spaces"
            }]
            
            
+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }
            


