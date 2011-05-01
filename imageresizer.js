importPackage(com.google.appengine.api.images);
importPackage(com.google.appengine.api.datastore);

var imageresizer = {
    moveLeft: function(left, box) {
        box.leftX += left;
        box.rightX += left;
    },
    moveTop: function(top, box) {
        box.topY += top;
        box.bottomY += top;
    },
    resize: function(blob, width, height) {
        var imageBytes = blob.getBytes();

        var imagesService = ImagesServiceFactory.getImagesService();
        var currImage = ImagesServiceFactory.makeImage(imageBytes);

        // resize to width from parameters + 100 - just some padding
        var resize = ImagesServiceFactory.makeResize(width+100, height+100);
        currImage = imagesService.applyTransform(resize, currImage);

        var currWidth = currImage.getWidth(), 
            currHeight = currImage.getHeight();

        var wPerc = width / currWidth,
               hPerc = height / currHeight;

        var boxWidthHalph = (width/2) / currWidth;
        var boxHeightHalph = (height/2) / currHeight;

        var box = {leftX:0.0, topY:0.0, rightX:wPerc, bottomY:hPerc};
        // move it to the center
        this.moveLeft(0.50 - boxWidthHalph, box);
        this.moveTop(0.50 - boxHeightHalph, box);

        // crop might fail if values are out-of-bounds
        if(box.leftX >= 0 && box.topY >= 0 && box.rightX >= 0 && box.bottomY >= 0) {
            var crop = ImagesServiceFactory.makeCrop(box.leftX, box.topY, box.rightX, box.bottomY);
            currImage = imagesService.applyTransform(crop, currImage);
        }

        imageBytes = currImage.getImageData();

        return new Blob(imageBytes);

    }
}
