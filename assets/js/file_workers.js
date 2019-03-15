(function() {

    if(!"draggable" in document.createElement("span") || !window.FileReader) {
        return;
    }

    var dropZone = document.querySelector("#dropZone");

    dropZone.ondragenter = addHover;
    dropZone.ondragleave = removeHover;
    dropZone.ondragover = cancelDefault;
    dropZone.ondrop = handleDrop;

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
        errorMessage = document.querySelector("#errorMessage");
       
    function addHover() {

        this.dropZone.classList.add("dragOver");

    }

    function removeHover() {

        this.dropZone.classList.remove("dragOver");

    }

    function cancelDefault(e) {

        e.preventDefault();
        return false;
        
    }

    function handleDrop(e) {

        e.preventDefault();
        e.stopPropagation();

        var file = e.dataTransfer.files[0];

        if(file.type.match("image.*")) {
            createImg(file);
        }
        else {
            errorMessage.innerHTML = "You should select image file";
        } 
        

        this.removeHover();
    }   

    fileInput.onchange = function() {
        var file = this.files[0];
        
        if(file.type.match("image.*")) {
            createImg(file);
        }
        else {
            errorMessage.innerHTML = "You should select image file";
        }
    }

    function createImg(file) {

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
        errorMessage.innerHTML = "";

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

    }

    filter1Button.onclick = applayFilters;
    filter2Button.onclick = applayFilters2;
})();