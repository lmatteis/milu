importPackage(org.apache.commons.fileupload);
importPackage(org.apache.commons.fileupload.servlet);
importPackage(org.apache.commons.io);
importPackage(com.google.appengine.api.datastore);

var fileupload = {
    getData: function(request) {
        var data = [];
		try {
		    var upload = new ServletFileUpload();
			var iter = upload.getItemIterator(request);
			while(iter.hasNext()) {
				var item = iter.next();
				var stream = item.openStream();

				if(item.isFormField()) {
                    data.push({
                        file: false,
                        fieldName: item.getFieldName(),
                        // added the "" at the end to convert it to JS string
                        fieldValue: new java.lang.String(IOUtils.toByteArray(stream), "utf-8")
                    });
					// LOG.info("Got a form field: " +fieldName+" with value: "+fieldValue);
					//if(fieldName.equals("name")) name = fieldValue;
				} else {
					//LOG.info("Got an uploaded file: " +item.getFieldName() +", name = "+item.getName());
					// assign values of image
                    data.push({
                        file: true,
                        fieldName: item.getName(),
                        fieldValue: new Blob(IOUtils.toByteArray(stream))
                    });
				}

			}
		} catch (e){
            throw new Exception(e);
		}

        return data;
    }
};
