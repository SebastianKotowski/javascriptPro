(function() {

    var imageUploader = {

        addHover: function() {

            this.dropZone.classList.add("dragOver");

        },

        removeHover: function() {

            this.dropZone.classList.remove("dragOver");

        },

        cancelDefault: function(e) {

            e.preventDefault();
            return false;
            
        },

        handleDrop: function(e) {

            e.preventDefault();
            e.stopPropagation();

            var files = e.dataTransfer.files;

            [].forEach.call(files, function(file) {

                if(file.type.match("image.*")) {
                    this.generateThumbnail(file);
                    this.addToUpploadList(file);
                } 
            }.bind(this));

            this.removeHover();
        },

        addToUpploadList: function(file) {

            this.formData.append("images[]", file);
            this.files.Added++;
        },

        generateThumbnail: function(file) { 

            var fileReader = new FileReader(),
                imgDnD = new Image();

            fileReader.onload = function() {
                imgDnD.src = fileReader.result;
            }

            fileReader.readAsDataURL(file);

            this.imageContainer.appendChild(imgDnD);
            
        },

        sendFiles: function() {

            if(this.filesAdded == 0) {
                return;
            }

            this.sendButton.onclick = null;
            this.sendButton.setAttribute("disabled", disabled);

            var xmlRequest = new XMLHttpRequest();
            xmlRequest.open("POST", "assets/css/images")

        },

        init: function() {

            if(!"draggable" in document.createElement("span") || !window.FileReader) {
                return;
            }

            this.dropZone = document.querySelector("#dropZone");
            this.imageContainer = document.querySelector("#imagesContainer");
            this.sendButton = document.querySelector("#send");
            this.status = document.querySelector("#status");
            this.progressBar = document.querySelector("#progress");

            this.dropZone.ondragenter = this.addHover.bind(this);
            this.dropZone.ondragleave = this.removeHover.bind(this);
            this.dropZone.ondragover = this.cancelDefault;
            this.dropZone.ondrop = this.handleDrop.bind(this);

            this.filesAdded = 0;
            this.formData = new FormData();

            this.sendButton.onclick = this.sendFiles.bind(this);

        }

    }

    imageUploader.init();

})();