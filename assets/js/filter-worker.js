self.addEventListener("message", function(e) {

    var canData = e.data,
        length = canData.data.length;

    for(var j = 0; j < 100; j++) {

        for(var i = 0; i < length; i += 4) {

            var r = 0.025 * canData.data[i] + 0.126 * canData.data[i+1] + 0.068 * canData.data[i+2];
            var g = 0.099 * canData.data[i] + 0.163 * canData.data[i+1] + 0.071 * canData.data[i+2];
            var b = 0.056 * canData.data[i] + 0.222 * canData.data[i+1] + 0.999 * canData.data[i+2];

            canData.data[i] = r;
            canData.data[i+1] = g;
            canData.data[i+2] = b;
        }
    }

    self.postMessage(canData);
}, false);