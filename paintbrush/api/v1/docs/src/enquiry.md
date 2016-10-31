


## Submit enquiry [/api/v1/enquiry/submit]

Adds a new material to the list of materials available when creating/updating artowrk.

### Submit enquiry [POST]

+ Request (application/json)

    + Headers
    
            Authorization: token
            
    + Body
    
            {
                "Enquiry": "Enquiry Text"
            }
    
+ Response 200 (application/json)

    + Body
    
            { 
                "Message": "Success"
            }
                  
+ Response 400 (application/json)

    + Body
    
            { "Message": "Bad input description" }

+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }
            
            


