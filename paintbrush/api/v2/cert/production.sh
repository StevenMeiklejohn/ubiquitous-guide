#convert *.cer (der format) to pem
openssl x509 -in cer/aps.cer -inform DER -out aps.pem -outform PEM

#convert p12 private key to pem (requires the input of a minimum 4 char password)
openssl pkcs12 -nocerts -out tmp/private_aps_key.pem -in p12/ARNCertificates.p12

# if you want remove password from the private key
openssl rsa -out tmp/private_key_noenc.pem -in tmp/private_aps_key.pem

#take the certificate and the key (with or without password) and create a PKCS#12 format file
openssl pkcs12 -export -in aps.pem -inkey tmp/private_aps_key.pem -certfile req/CertificateSigningRequest.certSigningRequest -name "com.ARN.ios.ActivCanvas" -out aps.p12
