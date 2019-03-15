var ws = require("nodejs-websocket");

var server = ws.createServer(function(con) {

    con.on("text", function(data) {

        var dataObject = JSON.parse(data);

        if(dataObject.type == "join") {
            con.nickName = dataObject.name;

            sendToAll({
                type: "status",
                message: con.nickName + " has joined to chat."
            });
        } else if( dataObject.type == "message") {
            
            sendToAll({
                type: "message",
                name: con.nickName,
                message: dataObject.message
            });
        }
    });

    con.on("close", function() {

        if(con.nickName) {
            sendToAll({
                type: "status",
                message: con.nickName + " has left the chat."
            });
        }
    });

    con.on("error", function(e) {

        console.log("Connection has been lost.");
    });

}).listen(8000, "localhost", function() {
    console.log("Serwer aktywny");
});

function sendToAll(data) {

    var msg = JSON.stringify(data);

    server.connections.forEach(function(conn) {
        debugger;
        conn.sendText(msg);
    });
}