document.getElementById("sendMessage").addEventListener("click", function () {
    const message = document.getElementById("chatInput").value;
    connection.invoke("SendMessageToRoom", roomId, message, username)
        .catch(err => console.error(err.toString()));
    document.getElementById("chatInput").value = "";
});

document.getElementById("chatInput").addEventListener("keydown", function (event) {
    if (event.key === 'Enter') { 
        event.preventDefault();
        document.getElementById("sendMessage").click();
    }
});

connection.on("ReceiveMessage", (message, username) => {
    displayMessage(`${username}: ${message}`);
});

