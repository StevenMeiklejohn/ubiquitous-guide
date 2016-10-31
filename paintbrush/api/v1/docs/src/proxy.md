
The proxy service is designed to improve performance when viewing media files.

## Image Proxy [/api/v1/proxy/image/{image_uri}/{max_width}/{max_height}]

Since most artwork uploaded will (ideally) be high resolution images but will primarily be displayed 
within relatively small containers - loading them using this proxy allows the images to be scaled down 
to the exact size required, significantly improving performance within the client.

*NOTE:* The original aspect ratio of the image will always be maintained.

### Image Proxy [GET]

+ Parameters

    + image_uri (required) ... A uri encoded url of the image
    + max_width (optional) ... Scale image down to this width if it is too wide
    + max_height (optional) ... Scale image down to this height if it is too tall

+ Request (image/*)
        
+ Response 200 (image/*)
+ Response 404 (image/*)
+ Response 500 (image/*)



