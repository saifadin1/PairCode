document.getElementById("sendMessage").addEventListener("click", function () {
    const message = document.getElementById("chatInput").value;
    connection.invoke("SendMessageToRoom", roomId, message, username)
        .catch(err => console.error(err.toString()));
    document.getElementById("chatInput").value = "";
});


connection.on("ReceiveMessage", (message, username) => {
    displayMessage(`${username}: ${message}`);
});

