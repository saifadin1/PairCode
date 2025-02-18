
namespace OnlineEditor.Services
{
    public class RoomService : IRoomService
    {
        Dictionary<string, bool> _rooms = new Dictionary<string, bool>();
        public void AddRoom(string roomId)
        {
            _rooms.Add(roomId, true);
        }

        public bool DoesRoomExist(string roomId)
        {
            return _rooms.ContainsKey(roomId);
        }
    }
}
