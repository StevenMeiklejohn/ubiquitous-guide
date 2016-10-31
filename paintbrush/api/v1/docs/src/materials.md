

## List all materials [/api/v1/materials]

Lists all the materials available for artwork.

### List all materials [GET]

+ Request (application/json)

    + Headers
    
            Authorization: token
            
            
+ Response 200 (application/json)

    + Body
    
            [{ 
                "ID": 1,
                "Name": "Material 1 Name",
                "Description": "Material 1 Description"
            }, { 
                "ID": 2,
                "Name": "Material 2 Name",
                "Description": "Material 2 Description"
            }]
            
            
+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }
            

## Add a new material [/api/v1/materials/add]

Adds a new material to the list of materials available when creating/updating artowrk.

### Add a new material [POST]

+ Request (application/json)

    + Headers
    
            Authorization: token
            
    + Body
    
            {
                "Name": "Material Name",
                "Description": "Material Description"
            }
    
+ Response 201 (application/json)

    + Body
    
            { 
                "ID": 1
                "Message": "Success"
            }
                  
+ Response 400 (application/json)

    + Body
    
            { "Message": "Bad input description" }
            
+ Response 403 (application/json)

    + Body
    
            { "Message": "You do not have permission to add this item" }
            
+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }
            
            

## Update a material [/api/v1/materials/{material_id}/update]

Update the name or description of an existing material.

### Update a material [PUT]

+ Parameters

    + material_id (required, number, `1`) ... ID of the material in form of an integer
    
+ Request (application/json)

    + Headers
    
            Authorization: token
            
    + Body
    
            {
                "Name": "Material Name",
                "Description": "Material Description"
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
    
            { "Message": "Material Not Found" }
            
+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }
            
            

## Remove a material [/api/v1/materials/{material_id}/remove]

### Remove a material [DELETE]

+ Parameters

    + material_id (required, number, `1`) ... ID of the material in form of an integer
    
+ Request (application/json)

    + Headers
    
            Authorization: token
    
+ Response 204 (application/json)
                  
+ Response 400 (application/json)

    + Body
    
            { "Message": "Bad input description" }
            
+ Response 403 (application/json)

    + Body
    
            { "Message": "You do not have permission to update this item" }
            
+ Response 404 (application/json)

    + Body
    
            { "Message": "Material Not Found" }
            
            
+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }

