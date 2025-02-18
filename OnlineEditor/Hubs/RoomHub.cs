using Microsoft.AspNetCore.SignalR;
using System.Text.RegularExpressions;

namespace OnlineEditor.Hubs
{
    public class RoomHub : Hub
    {
        public async Task SendMessageToRoom(string roomId, string message, string userName)
        {
            await Clients.Group(roomId).SendAsync("ReceiveMessage", message, userName);
        }

        public async Task StartVideoCall(string roomId)
        {
            await Clients.Group(roomId).SendAsync("StartVideoCall");
        }

        public async Task EndVideoCall(string roomId)
        {
            await Clients.Group(roomId).SendAsync("EndVideoCall");
        }

        public async Task SyncCodeEditor(string roomId, string code)
        {
            await Clients.OthersInGroup(roomId).SendAsync("SyncEditor", code);
        }

        public async Task JoinRoom(string roomId, string userName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, roomId);
            await Clients.Group(roomId).SendAsync("UserJoined", userName);
        }

        public async Task LeaveRoom(string roomId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, roomId);
        }


        public async Task SendOffer(string offer)
        {
            await Clients.Others.SendAsync("ReceiveOffer", offer);
        }

        public async Task SendAnswer(string answer)
        {
            await Clients.Others.SendAsync("ReceiveAnswer", answer);
        }

        public async Task SendIceCandidate(string candidate)
        {
            await Clients.Others.SendAsync("ReceiveIceCandidate", candidate);
        }
    }
}
