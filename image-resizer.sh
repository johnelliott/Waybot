# convert comes form graphicsmagick
# https://www.smashingmagazine.com/2015/06/efficient-image-resizing-with-imagemagick/
# http://www.cyberciti.biz/faq/linux-unix-bsd-xargs-construct-argument-lists-utility/
echo 144 192 256 384 512 |xargs -n1 -I% convert ../wb-logo-base.png -resize % public/images/icon-%x%.png

# favicon
convert ../wb-logo-base.png -resize 16 public/images/favicon.ico
# apple things
#<link rel="apple-touch-icon" href="touch-icon-iphone.png">
#<link rel="apple-touch-icon" sizes="76x76" href="touch-icon-ipad.png">
#<link rel="apple-touch-icon" sizes="120x120" href="touch-icon-iphone-retina.png">
#<link rel="apple-touch-icon" sizes="152x152" href="touch-icon-ipad-retina.png">
convert ../wb-logo-base.png -resize 60 public/images/touch-icon-iphone.png
convert ../wb-logo-base.png -resize 76 public/images/touch-icon-ipad.png
convert ../wb-logo-base.png -resize 120 public/images/touch-icon-iphone-retina.png
convert ../wb-logo-base.png -resize 152 public/images/touch-icon-ipad-retina.png

# next up?
# https://developer.apple.com/library/ios/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html
#<link rel="apple-touch-startup-image" href="/startup.png">

convert ../wb-logo-base.png -resize 16 public/images/favicon.ico

## downscale images
convert ../1-counter.jpg -resize 385 public/images/1-counter.jpg
convert ../pi.jpg -resize 385 public/images/pi.jpg

