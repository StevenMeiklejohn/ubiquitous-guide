#convert *.cer (der format) to pem
openssl x509 -in cer/aps_development.cer -inform DER -out aps_development.pem -outform PEM

#convert p12 private key to pem (requires the input of a minimum 4 char password)
openssl pkcs12 -nocerts -out tmp/private_aps_key.pem -in p12/ARNCertificates.p12

# if you want remove password from the private key
openssl rsa -out tmp/private_key_noenc.pem -in tmp/private_aps_key.pem

#take the certificate and the key (with or without password) and create a PKCS#12 format file
openssl pkcs12 -export -in aps_development.pem -inkey tmp/private_key_noenc.pem -certfile req/CertificateSigningRequest.certSigningRequest -name "aps_development" -out aps_development.p12
