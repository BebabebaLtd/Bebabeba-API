#!/bin/sh 
echo “Building React Project …” 
npm start 

cd /public
echo “Copying html file …” 
cp -r build html 
echo “Connecting to AWS VM and copying file to /var/www/html/ …” sudo scp -i [./rydr-keys.ppk] -r html [ubuntu@ec2-34-233-227-2.compute-1.amazonaws.com]:/var/www 
echo “Removing html file from local directory …” 
rm -r html