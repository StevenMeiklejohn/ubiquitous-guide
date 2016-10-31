


## List artist age brackets [/api/v1/artist/age-brackets]

Lists all artist age brackets
    
### List artist age brackets [GET]

+ Request (application/json)

    + Headers
    
            Authorization: token
            
+ Response 200 (application/json)

    + Body
    
            [
              {
                "ID": 1,
                "Description": "Under 18"
              },
              {
                "ID": 2,
                "Description": "18-25"
              },{
                "ID": 3,
                "Description": "25-35"
              }
            ]       
            

+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }



## List artist types [/api/v1/artist/types]

Lists all artist types
    
### List artist types [GET]

+ Request (application/json)

    + Headers
    
            Authorization: token
            
+ Response 200 (application/json)

    + Body
    
            [
              {
                "ID": 1,
                "Type": "Emerging",
                "Description": "Emerging artist..."
              },
              {
                "ID": 2,
                "Type": "Student",
                "Description": "Student..."
              },{
                "ID": 3,
                "Type": "Recent Graduate",
                "Description": "Graduated within the last n years."
              }
            ]       
            

+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }

