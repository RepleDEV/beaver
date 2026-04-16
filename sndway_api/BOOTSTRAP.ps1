echo "Downloading libusb/hidapi@0.15"
curl -fsSL https://github.com/libusb/hidapi/releases/download/hidapi-0.15.0/hidapi-win.zip > hidapi-win.zip
echo "Extracting"
Expand-Archive -Path ./hidapi-win.zip
echo "Cleaning up"
rm ./hidapi-win.zip
