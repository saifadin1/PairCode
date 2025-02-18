document.getElementById("startCall").addEventListener("click", async function () {
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    document.getElementById("localVideo").srcObject = localStream;
    peerConnection = createPeerConnection();
    localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    connection.invoke("SendOffer", JSON.stringify(offer));
});

document.getElementById("close").addEventListener("click", function () {
    localStream.getTracks().forEach(track => track.stop());
    document.getElementById("localVideo").srcObject = null;
});

document.getElementById("mute").addEventListener("click", function () {
    if (localStream) {
        const audioTracks = localStream.getAudioTracks();

        if (audioTracks.length > 0) {
            const isMuted = audioTracks[0].enabled;
            audioTracks.forEach(track => track.enabled = !isMuted);
            const muteButton = document.getElementById("mute");
            if (isMuted) {
                muteButton.textContent = "Mute";
                muteButton.classList.remove("btn-warning");
                muteButton.classList.add("btn-success");
            } else {
                muteButton.textContent = "Unmute";
                muteButton.classList.remove("btn-success");
                muteButton.classList.add("btn-warning");
            }
        } else {
            console.warn("No audio tracks available to mute/unmute.");
        }
    } else {
        console.warn("Local stream is not available.");
    }
});

function createPeerConnection() {
    const config = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
    const pc = new RTCPeerConnection(config);

    pc.onicecandidate = ({ candidate }) => {
        if (candidate) {
            connection.invoke("SendIceCandidate", JSON.stringify(candidate));
        }
    };

    pc.ontrack = (event) => {
        document.getElementById("remoteVideo").srcObject = event.streams[0];
    };

    return pc;
}

connection.on("ReceiveOffer", async (offer) => {
    peerConnection = createPeerConnection();

    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    document.getElementById("localVideo").srcObject = localStream;

    localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

    await peerConnection.setRemoteDescription(new RTCSessionDescription(JSON.parse(offer)));

    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    connection.invoke("SendAnswer", JSON.stringify(answer));
});

connection.on("ReceiveAnswer", async (answer) => {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(JSON.parse(answer)));
});

connection.on("ReceiveIceCandidate", async (candidate) => {
    await peerConnection.addIceCandidate(new RTCIceCandidate(JSON.parse(candidate)));
});