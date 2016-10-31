
*NOTE*: These methods can only be used by users already part of an administrator group.

## List Groups [/api/v2/groups]

### List Groups [GET]

+ Request (application/json)

    + Headers
    
            Authorization: token
    
+ Response 200 (application/json)

    + Body
    
            [{
                "ID": 1,
                "Name": "Group 1 Name",
                "Description": "Group 1 Description"
            }, {
                "ID": 2,
                "Name": "Group 2 Name",
                "Description": "Group 2 Description"
            }]


## Add Group [/api/v2/groups/add]

### Add Group [POST]

+ Request (application/json)

    + Headers
    
            Authorization: token
            
    + Body
    
            {
                "Name": "Group Name",
                "Description": "Group Description"
            }

+ Response 201 (application/json)

    + Body
    
            {
                "ID": 1
            }


## View Group Details [/api/v2/groups/{group_id}]

### View Group Details [GET]

+ Parameters

    + group_id (required, number, `1`) ... ID of the group in form of an integer
    

+ Request (application/json)

    + Headers
    
            Authorization: token

+ Response 200 (application/json)
     
    + Attributes (object)
        + Name: Group Name (string) - the name of the group
        + Description: Group Description (string) - a description of the group
        + Members: [] (array[object]) - contains basic member details
        + Members.ID: 1 (number) - User's ID
        + Members.Email: User's Email (string) - User's Email
            
    + Body
    
            {
                "Name": "Group Name",
                "Description": "Group Description",
                "Members": [{
                    "ID": 1,
                    "Email": "User's Email"
                }]
            }
            
            
## Update Group [/api/v2/groups/{group_id}/update]

### Update Group [PUT]

+ Parameters

    + group_id (required, number, `1`) ... ID of the group in form of an integer
    

+ Request (application/json)

    + Headers
    
            Authorization: token
            
    + Body
    
            {
                "Name": "Group Name",
                "Description": "Group Description"
            }

+ Response 200 (application/json)

    + Body
    
            {
                "Message": "Success"
            }

    
## Remove Group [/api/v2/groups/{group_id}/remove]

### Remove a group [DELETE]

+ Parameters

    + group_id (required, number, `1`) ... ID of the group in form of an integer
    
+ Request (application/json)

    + Headers
    
            Authorization: token
    
+ Response 204 (application/json)
    
+ Response 404 (application/json)

    + Body
    
            { "Message": "Not Found" }
            

