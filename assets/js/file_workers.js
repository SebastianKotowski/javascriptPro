(function() {

    if(!window.FileReader) {
        return;
    }

    var fileInput= document.querySelector("#fileInput"),
        fileName = document.querySelector("#fileName"),
        fileSize = document.querySelector("#fileSize"),
        fileType = document.querySelector("#fileType"),
        fileLastModifiedDate = document.querySelector("#fileLastModifiedDate");
    
    var canvasImage = document.querySelector("#canvasImage"),
        ctxImage = canvasImage.getContext("2d"),
        img = document.createElement("img");
        filter1Button = document.querySelector("#filterBtn");
        filter2Button = document.querySelector("#filterBtn2");
       
    fileInput.onchange = function() {
        var file = this.files[0],
            reader = new FileReader();

        reader.onload = function() {
            var blobik = new Blob([this.result], {type: file.type});

            var fileUrl = window.URL.createObjectURL(blobik);
         
            img.src = fileUrl;            

            //window.URL.revokeObjectURL(fileUrl);
            
        }

        reader.readAsArrayBuffer(file);

        fileName.innerHTML = "Name: " + file.name;
        fileSize.innerHTML = "Size: " + file.size;
        fileType.innerHTML = "Type: " + file.type;
        fileLastModifiedDate.innerHTML = "Last modified: " + file.lastModifiedDate.toLocaleDateString();       
    }

    img.onload = function() {
        console.dir(img);
        canvasImage.setAttribute("width", img.width);
        canvasImage.setAttribute("height", img.height);
        canvasImage.style.height = img.height;
        
        ctxImage.drawImage(img, 0, 0);
    }

    function applayFilters() {

        var canvasData = ctxImage.getImageData(0,0, canvasImage.width, canvasImage.height),
            length = canvasData.data.length;
        
        for(var i = 0; i < length; i += 4) {

            canvasData.data[i] = 255 - canvasData.data[i];
            canvasData.data[i + 1] = 255 - canvasData.data[i + 1];
            canvasData.data[i + 2] = 255 - canvasData.data[i + 2];
            canvasData.data[i + 3] = 255;
        }

        ctxImage.putImageData(canvasData, 0, 0);
    }

    var worker = new Worker("assets/js/filter-worker.js");

    worker.addEventListener("message", function(e) {
        ctxImage.putImageData(e.data, 0, 0);
    }, false);

    function applayFilters2() {

        var canvasData = ctxImage.getImageData(0,0, canvasImage.width, canvasImage.height),
            length = canvasData.data.length;
        
        worker.postMessage(canvasData);

        /* for(var j = 0; j < 100; j++) {

            for(var i = 0; i < length; i += 4) {

                var r = 0.025 * canvasData.data[i] + 0.126 * canvasData.data[i+1] + 0.068 * canvasData.data[i+2];
                var g = 0.099 * canvasData.data[i] + 0.163 * canvasData.data[i+1] + 0.071 * canvasData.data[i+2];
                var b = 0.056 * canvasData.data[i] + 0.222 * canvasData.data[i+1] + 0.999 * canvasData.data[i+2];
    
                canvasData.data[i] = r;
                canvasData.data[i+1] = g;
                canvasData.data[i+2] = b;
            }

        }  */       

        //ctxImage.putImageData(canvasData, 0, 0);

    }

    filter1Button.onclick = applayFilters;
    filter2Button.onclick = applayFilters2;
})();