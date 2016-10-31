

## List Artist Question Types [/api/v2/question/artist/types]

Returns a list of artist question types

### List Artist Question Types [GET]

+ Request (application/json)

    + Headers
    
            Authorization: token
            
+ Response 200 (application/json)

    + Body
    
            [ 
                { 
                    "ID": 1,
                    "Type": "Method/Practice"
                }, 
                { 
                    "ID": 2,
                    "Type": "Passion/Inspiration"
                }, 
                { 
                    "ID": 3,
                    "Type": "Audience"
                }
            ]

+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }
            

## List Artist Questions [/api/v2/question/artist/list/{type_id}/{max_results}/{offset_results}]

Returns a list of artist questions of the specified type (sorted by priority)

### List Artist Questions [GET]

+ Request (application/json)

    + Headers
    
            Authorization: token
            
+ Response 200 (application/json)

    + Body
    
            [ 
                { 
                    "ID": 4,
                    "Priority": 100,
                    "Question": "What is particularly unique about where you work?"
                }, 
                { 
                    "ID": 23,
                    "Priority": 95,
                    "Question": "Is there anything unusual about how you start your day?"
                }, 
                { 
                    "ID": 11,
                    "Priority": 90,
                    "Question": "What specific movements or artists have inspired your art the most?"
                }
            ]

+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }
            



## List Gallery Question Types [/api/v2/question/gallery/types]

Returns a list of gallery question types

### List Gallery Question Types [GET]

+ Request (application/json)

    + Headers
    
            Authorization: token
            
+ Response 200 (application/json)

    + Body
    
            [ 
                { 
                    "ID": 1,
                    "Type": "..."
                }
            ]

+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }
            

## List Gallery Questions [/api/v2/question/gallery/list/{type_id}/{max_results}/{offset_results}]

Returns a list of gallery questions of the specified type (sorted by priority)

### List Gallery Questions [GET]

+ Request (application/json)

    + Headers
    
            Authorization: token
            
+ Response 200 (application/json)

    + Body
    
            [ 
                { 
                    "ID": 4,
                    "Priority": 100,
                    "Question": "..."
                }, 
                { 
                    "ID": 23,
                    "Priority": 95,
                    "Question": "..."
                }, 
                { 
                    "ID": 11,
                    "Priority": 90,
                    "Question": "..."
                }
            ]

+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }
            
