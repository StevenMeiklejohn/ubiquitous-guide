

## Total Unread Notifications [/api/v1/notifications/unread]

Fetches the unread notification total for the current user.

### Unread Notifications [GET]

+ Request (application/json)

    + Headers
    
            Authorization: token

+ Response 200 (application/json)

    + Body
    
            { "Unread": 3 }

+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }
            
            
## Search Notifications [/api/v1/notifications/search]

### Search Notifications [POST]

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
                "Filters": { }
            }
            
    
+ Response 200 (application/json)

    + Body
    
            {
                "Data":[
                    {
                        "ID":2,
                        "Subject":"Pending Connection",
                        "Body":"John Smith has requested to connect with you...",
                        "SentDate":"30/07/2015",
                        "ReadDate":null
                    },
                    {
                        "ID":1,
                        "Subject":"Complete Profile",
                        "Body":"Please complete your profile....",
                        "SentDate":"30/07/2015",
                        "ReadDate":null
                    }
                ],
                "Pagination":{
                    "PageSize": 30,
                    "PageNumber": 0,
                    "TotalResults": 2
                }
            }
            

## View Notification [/api/v1/notifications/{notification_id}]

Returns the specified notification

### View Notification [GET]

+ Parameters

    + notification_id (required, number, `1`) ... ID of the notification in form of an integer
    
+ Request (application/json)

    + Headers
    
            Authorization: token

+ Response 200 (application/json)

    + Body
    
            {
            	"ID":468,
            	"ProfileID":4571,
            	"PriorityID":4,
            	"TypeID":3,
            	"ConnectionID":null,
            	"Subject":"Enquiry To Buy 3a",
            	"Body":"<p>You have received a new message from John Smith</p>",
            	"SentDate":"2016-01-25T16:06:12.000Z",
            	"ReadDate":"2016-01-25T16:09:55.000Z",
            	"Sticky":0,
            	"Deleted":0,
            	"TaskGroupID":null,
            	"MessageID":14,
            	"Type":"Message",
            	"Messages":[
            		{
            			"ID":14,
            			"Body":"...",
            			"Subject":"Enquiry To Buy 3a",
            			"SentDate":"2016-01-25T16:06:12.000Z",
            			"SenderProfileID":4560,
            			"SenderProfileName":"John Smith",
            			"SenderProfileImageURI":"...",
            			"PreviousMessageID":12
            		},{
            			"ID":12,
            			"Body":"...",
            			"Subject":"Enquiry To Buy 3a",
            			"SentDate":"2016-01-25T16:04:05.000Z",
            			"SenderProfileID":4571,
            			"SenderProfileName":"Kris McKernan",
            			"SenderProfileImageURI":"...",
            			"PreviousMessageID":11
            		},{
            			"ID":11,
            			"Body":"...",
            			"Subject":"Enquiry To Buy 3a",
            			"SentDate":"2016-01-25T16:00:35.000Z",
            			"SenderProfileID":4560,
            			"SenderProfileName":"John Smith",
            			"SenderProfileImageURI":"...",
            			"PreviousMessageID":null
            		}
            	]
            }
            
+ Response 400 (application/json)

    + Body
    
            { "Message": "Bad input description" }
            
+ Response 403 (application/json)

    + Body
    
            { "Message": "You do not have permission to update this item" }
            
+ Response 404 (application/json)

    + Body
    
            { "Message": "Notification Not Found" }
            
            
+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }            
            
            
            

## Read Notification [/api/v1/notifications/{notification_id}/read]

Marks the specified notification as read

### Read Notification [GET]

+ Parameters

    + notification_id (required, number, `1`) ... ID of the notification in form of an integer
    
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
    
            { "Message": "Notification Not Found" }
            
            
+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }            
            
            
            
## Hide Notification [/api/v1/notifications/{notification_id}/hide]

Marks the specified notification as hidden from the user.

### Hide Notification [GET]

+ Parameters

    + notification_id (required, number, `1`) ... ID of the notification in form of an integer
    
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
    
            { "Message": "Notification Not Found" }
            
            
+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }
            
            