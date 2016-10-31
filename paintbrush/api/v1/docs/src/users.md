



*NOTE*: These methods can only be used by users who are part of an administrator group.

## Add User [/api/v1/users/add]

Adds a new user to the system.

### Add User [POST]

+ Request (application/json)

    + Headers
    
            Authorization: token
            
    +   Body
    
            { 
                "Email": "user@test",
                "Password": "something secure..."
            }
            
+ Response 200 (application/json)

    + Body
        
            {
                "UserID": 12345
            }
            

## Search Users [/api/v1/users/search]

Allows an administrator to search through all users in the system.

### Search Users [POST]

+ PageSize - optional, default = 10, min = 1, max = 100
+ PageNumber - optional, default = 0
+ Filters - all filters are optional and without default values, therefore they will not be applied if left unspecified.
+ TotalResults - this count will be returned in every response along with the actual pagination settings used for the query

+ Request (application/json)

    + Headers
    
            Authorization: token
            
    +   Body
    
            { 
                "Pagination": { "PageSize": 10, "PageNumber": 0 },
                "Filters": {
                    "Email": "partial or full email",
                    "Groups": [ 2 ],
                    "IsArtist": true,
                    "IsGallery": false,
                    "IsDeleted": false,
                    "IsAuthorised": true
                }
            }
            
    
+ Response 200 (application/json)

    + Body
    
            { 
                "Data": [{
                    "ID": 1,
                    "ProfileID": 1,
                    "Email": "user1@test",
                    "Deleted": false,
                    "Authorised": true,
                    "ArtistID": 1,
                    "GalleryID": null,
                    "Groups": [{
                        "ID": 1,
                        "Name": "Registered Users"
                    }]
                }, {
                    "ID": 2,
                    "ProfileID": null,
                    "Email": "admin1@test",
                    "Deleted": false,
                    "Authorised": true,
                    "ArtistID": null,
                    "GalleryID": null,
                    "Groups": [{
                        "ID": 1,
                        "Name": "Registered Users"
                    }, {
                        "ID": 2,
                        "Name": "Administrators"
                    }]
                }, {
                    "ID": 3,
                    "ProfileID": 2,
                    "Email": "user2@test",
                    "Deleted": false,
                    "Authorised": true,
                    "ArtistID": null,
                    "GalleryID": 1,
                    "Groups": [{
                        "ID": 1,
                        "Name": "Registered Users"
                    }]
                }],
                "Pagination": {
                    "PageSize": 10,
                    "PageNumber": 0,
                    "TotalResults": 1234
                }
            }
            

## View User [/api/v1/users/{user_id}]

Returns the specified user record.

### View User Details [GET]

+ Parameters

    + user_id (required, number, `1`) ... ID of the user in form of an integer
    

+ Request (application/json)

    + Headers
    
            Authorization: token

+ Response 200 (application/json)
     
    + Attributes (object)
        + Email: user@test (string) - the users email address
        + CreatedAt: 2015 05 14T14:20:19.255Z (string) - timestamp 
        + Authorised: true (boolean) - this user is currently authorised to log into the syustem
        + Groups: [] (array[object]) - contains basic group details
        + Groups.ID: 1 (number) - the groups unique id
        + Groups.Name: Group 1 Name (string) - the groups name
            
    + Body
    
            {
                "Email": "user@test",
                "CreatedAt": "2015-05-14T14:20:19.255Z",
                "UpdatedAt": "2015-05-15T09:42:45.788Z",
                "Authorised": true,
                "Groups": [{
                    "ID": 1,
                    "Name": "Group 1 Name"
                }]
            }


## Add to group [/api/v1/users/{user_id}/groups/add]

Adds a user to the specified group(s).

### Add to group [POST]

+ Parameters

    + user_id (required, number, `1`) ... ID of the user in form of an integer
    
+ Request (application/json)

    + Headers
    
            Authorization: token
            
    +   Body
    
            { "Groups": [1, 2, 5] }
            
    
+ Response 201 (application/json)

    + Body
    
            { "Message": "Success" }
    
+ Response 404 (application/json)

    + Body
    
            { "Message": "User Not Found" }
            

## Remove from group [/api/v1/users/{user_id}/groups/remove]

Removes a user from the specified group(s).

### Remove from group [POST]

+ Parameters

    + user_id (required, number, `1`) ... ID of the user in form of an integer
    
+ Request (application/json)

    + Headers
    
            Authorization: token
            
    +   Body
    
            { "Groups": [1, 2, 5] }
            
    
+ Response 200 (application/json)

    + Body
    
            { "Message": "Success" }
    
+ Response 404 (application/json)

    + Body
    
            { "Message": "User Not Found" }



## Authorise User [/api/v1/users/{user_id}/enable]

Re-enables a users ability to log in to the system

### Authorise User [PUT]

+ Parameters

    + user_id (required, number, `1`) ... ID of the user in form of an integer
    

+ Request (application/json)

    + Headers
    
            Authorization: token

+ Response 200 (application/json)

    + Body
    
            {
                "Message": "Success"
            }


## De-Authorise User [/api/v1/users/{user_id}/disable]

Prevents a user from logging in to the system

### De-Authorise User [PUT]

+ Parameters

    + user_id (required, number, `1`) ... ID of the user in form of an integer
    

+ Request (application/json)

    + Headers
    
            Authorization: token

+ Response 200 (application/json)

    + Body
    
            {
                "Message": "Success"
            }
            

## Remove User [/api/v1/users/{user_id}/remove]

### Remove a user [DELETE]

+ Parameters

    + user_id (required, number, `1`) ... ID of the user in form of an integer
    
+ Request (application/json)

    + Headers
    
            Authorization: token
    
+ Response 204 (application/json)
    
+ Response 404 (application/json)

    + Body
    
            { "Message": "Not Found" }
            
            

