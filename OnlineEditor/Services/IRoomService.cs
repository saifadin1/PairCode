namespace OnlineEditor.Services
{
    public interface IRoomService
    {
        bool DoesRoomExist(string roomId);
        void AddRoom(string roomId);
    }
}
