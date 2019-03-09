(function() {

    var map = {

        makeMap: function() {
            var loc = this.location.split(","),
                pos = new google.maps.LatLng(loc[0], loc[1]);
            var mapOptions = {
                zoom: 16,
                center: pos,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            }

            this.mapObj = new google.maps.Map(document.querySelector("#map"), mapOptions);
        },
        init: function(options) {

            if(!options.location) {
                return;
            }

            try { 
                google.maps.event.addDomListener(window, "load", this.makeMap.bind(this)); 
            }
            catch(e) {                
                return;
            }

            this.options = options;
            this.location = this.option.location;

        }
    }

    map.init({
        location: "52.406617, 16.934577",
        mapmarker: "images/map_marker.png"
    });

})();