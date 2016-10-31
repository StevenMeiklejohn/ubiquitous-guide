
*IMPORTANT:* Device recognition is done automatically when authenticating with the API using the user agent string within the request header.
    
## Current device [/api/v2/device/current]

Returns details of the current device identified by the API.

Use this call to retrieve your current device ID in order to update the device (e.g. set the push token) 
    
### Get Current device [POST]

+ Request (application/json)

    + Headers
    
            Authorization: token          
            
+ Response 200 (application/json)
  
    + Body
    
            {
				"ID": 17,
				"UserID": 4574,
				"OS": "Linux",
				"Model": "Other",
				"OSVersion": "Ubuntu",
				"Locale": "en-GB",
				"TimeZone": null,
				"Enabled": 1,
				"DeviceModel": null,
				"PushToken": null,
				"TypeID": 1,
				"BrowserID": 20,
				"BrowserName": "Firefox",
				"BrowserVersion": "40.0.0"
		    }
            
+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }





    
## Update current device [/api/v2/device/update]

Updates the current device.

*NOTE:* All fields are optional.
    
### Update current device [PUT]

+ Request (application/json)

    + Headers
    
            Authorization: token

    + Body
    
            {
            	"TypeID": 2,
            	"Locale": "en-GB",
            	"TimeZone": "...",
            	"Enabled": true,            	
				"PushToken": "...",            	
				"DeviceModel": "..."
            }
            
+ Response 200 (application/json)
  
    + Body
    
            { "Message": "Success" }
                        
+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }




    

    
## Update device [/api/v2/device/update/{device_id}]

Updates an existing device belonging to the current user.

*NOTE:* All fields are optional.
    
### Update device [PUT]

+ Parameters

    + device_id (required, number) ... ID of device to be updated
    
+ Request (application/json)

    + Headers
    
            Authorization: token

    + Body
    
            {
            	"TypeID": 2,
            	"Locale": "en-GB",
            	"TimeZone": "...",
            	"Enabled": true,            	
            	"PushToken": "...",            	
				"DeviceModel": "..."
            }
            
+ Response 200 (application/json)
  
    + Body
    
            { "Message": "Success" }
            
+ Response 403 (application/json)
  
    + Body
    
            { "Message": "You do not have permission to update this device" }
            
+ Response 404 (application/json)
  
    + Body
    
            { "Message": "Device not found" }
            
+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }




    
## Remove device [/api/v2/device/remove/{device_id}]

Removes an existing device belonging to the current user.
    
### Remove device [DELETE]

+ Parameters

    + device_id (required, number) ... ID of device to be removed
    
+ Request (application/json)

    + Headers
    
            Authorization: token
            
+ Response 204 (application/json)
            
+ Response 403 (application/json)
  
    + Body
    
            { "Message": "You do not have permission to remove this device" }
            
+ Response 404 (application/json)
  
    + Body
    
            { "Message": "Device not found" }
            
+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }





    
## List devices [/api/v2/device/list]

Lists all devices belonging to the current user.
    
### List devices [GET]

+ Request (application/json)

    + Headers
    
            Authorization: token
            
+ Response 200 (application/json)

    + Body
    
            [
            	{
            		"ID": 17,
            		"OS": "Linux",
            		"OSVersion": "Ubuntu",
            		"Locale": "en-GB",
            		"TimeZone": null,
            		"Enabled": 1,
            		"DeviceModel": null,
            		"PushToken": null,
            		"TypeID": 1,
            		"Type": "Computer",
            		"LastLogin": "2015-12-09T15:12:56.000Z",
            		"LastAccess": "2015-12-09T15:13:13.000Z",
            		"Browsers": [
            			{
            				"ID": 20,
            				"Name": "Firefox",
            				"Version": "40.0.0",
            				"Enabled": 1,
            				"LastLogin": "2015-12-09T15:12:56.000Z",
            				"LastAccess": "2015-12-09T15:13:13.000Z",
            				"History": [
            					{
            						"ID": 49,
            						"LoginDate": "2015-12-09T15:12:56.000Z",
            						"LastAccess": "2015-12-09T15:13:13.000Z",
            						"Location": "Glasgow",
            						"Country": "UK"
            					}, {
            						"ID": 47,
            						"LoginDate": "2015-12-09T14:00:40.000Z",
            						"LastAccess": "2015-12-09T14:36:56.000Z",
            						"Location": "Glasgow",
            						"Country": "UK"
            					}, {
            						"ID": 46,
            						"LoginDate": "2015-12-09T13:54:24.000Z",
            						"LastAccess": "2015-12-09T13:54:24.000Z",
            						"Location": "Glasgow",
            						"Country": "UK"
            					}
            				]
            			}, {
            				"ID": 29,
            				"Name": "Chromium",
            				"Version": "44.0.2403",
            				"Enabled": 1,
            				"LastLogin": "2015-12-09T12:54:57.000Z",
            				"LastAccess": "2015-12-09T12:54:57.000Z",
            				"History": [
            					{
            						"ID": 39,
            						"LoginDate": "2015-12-09T12:54:57.000Z",
            						"LastAccess": "2015-12-09T12:54:57.000Z",
            						"Location": "Glasgow",
            						"Country": "UK"
            					}
            				]
            	
            			}
            		]
            	},
            	{
            		"ID": 18,
            		"OS": "Windows",
            		"OSVersion": "Windows 8.1",
            		"Locale": "en-US",
            		"TimeZone": null,
            		"Enabled": 1,
            		"DeviceModel": null,
            		"PushToken": null,
            		"TypeID": 1,
            		"Type": "Computer",
            		"LastLogin": "2015-12-09T13:29:49.000Z",
            		"LastAccess": "2015-12-09T15:12:18.000Z",
            		"Browsers": [
            			{
            				"ID": 21,
            				"Name": "Chrome",
            				"Version": "47.0.2526",
            				"Enabled": 1,
            				"LastLogin": "2015-12-09T10:36:13.000Z",
            				"LastAccess": "2015-12-09T15:12:18.000Z",
            				"History": [{
            					"ID": 29,
            					"LoginDate": "2015-12-09T10:36:13.000Z",
            					"LastAccess": "2015-12-09T15:12:18.000Z",
            					"Location": "Glasgow",
            					"Country": "UK"
            				}]
            			},
            			{
            				"ID": 31,
            				"Name": "Firefox",
            				"Version": "42.0.0",
            				"Enabled": 1,
            				"LastLogin": "2015-12-09T13:13:07.000Z",
            				"LastAccess": "2015-12-09T15:08:01.000Z",
            				"History": [{
            					"ID": 42,
            					"LoginDate": "2015-12-09T13:13:07.000Z",
            					"LastAccess": "2015-12-09T15:08:01.000Z",
            					"Location": "Glasgow",
            					"Country": "UK"
            				}]
            			},
            			{
            				"ID": 25,
            				"Name": "IE",
            				"Version": "11.0.0",
            				"Enabled": 1,
            				"LastLogin": "2015-12-09T13:29:49.000Z",
            				"LastAccess": "2015-12-09T13:29:49.000Z",
            				"History": [
            					{
            						"ID": 44,
            						"LoginDate": "2015-12-09T13:29:49.000Z",
            						"LastAccess": "2015-12-09T13:29:49.000Z",
            						"Location": "Glasgow",
            						"Country": "UK"
            					}, {
            						"ID": 43,
            						"LoginDate": "2015-12-09T13:29:26.000Z",
            						"LastAccess": "2015-12-09T13:29:26.000Z",
            						"Location": "Glasgow",
            						"Country": "UK"
            					}, {
            						"ID": 33,
            						"LoginDate": "2015-12-09T10:40:18.000Z",
            						"LastAccess": "2015-12-09T10:40:18.000Z",
            						"Location": "Glasgow",
            						"Country": "UK"
            					}
            				]
            			},
            			{
            				"ID": 30,
            				"Name": "Opera",
            				"Version": "34.0.2036",
            				"Enabled": 1,
            				"LastLogin": "2015-12-09T13:12:49.000Z",
            				"LastAccess": "2015-12-09T13:12:49.000Z",
            				"History": [
            					{
            						"ID": 41,
            						"LoginDate": "2015-12-09T13:12:49.000Z",
            						"LastAccess": "2015-12-09T13:12:49.000Z",
            						"Location": "Glasgow",
            						"Country": "UK"
            					}, {
            						"ID": 40,
            						"LoginDate": "2015-12-09T13:12:26.000Z",
            						"LastAccess": "2015-12-09T13:12:26.000Z",
            						"Location": "Glasgow",
            						"Country": "UK"
            					}
            				]
            			}
            		]
            	}
            ]
            
+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }


    
## List device types [/api/v2/device/types]

Lists all device types.
    
### List device types [GET]

+ Request (application/json)

    + Headers
    
            Authorization: token
            
+ Response 200 (application/json)

    + Body
    
            [{
				"ID": 1,
				"Type": "Computer"
			},{
				"ID": 2,
				"Type": "Mobile"
		  	},{
				"ID": 3,
				"Type": "Tablet"
			},{
				"ID": 4,
				"Type": "TV"
			}]

+ Response 500 (application/json)

    + Body
    
            { "Message": "Error description" }

