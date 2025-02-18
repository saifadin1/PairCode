using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using OnlineEditor.Models;
using OnlineEditor.Services;

namespace OnlineEditor.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly IRoomService _roomService;

        public HomeController(ILogger<HomeController> logger, IRoomService roomService)
        {
            _logger = logger;
            _roomService = roomService;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public IActionResult CreateRoom(string userName)
        {
            string roomId = Guid.NewGuid().ToString();
            _roomService.AddRoom(roomId);
            return RedirectToAction(nameof(JoinRoom), new { id = roomId , userName});
        }
        
        public IActionResult JoinRoom(string id, string userName)
        {
            if (!_roomService.DoesRoomExist(id))
            {
                return RedirectToAction(nameof(Index));
            }
            ViewData["RoomId"] = id;
            ViewData["UserName"] = userName;
            return View();
        }

    }
}
