using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class LikesController : BaseApiController
    {
        public IUserRepository _userRepository { get; }
        public ILikesRepository _likesRepository { get; }
        public LikesController(IUserRepository userRepository, ILikesRepository likesRepository)
        {
            _userRepository = userRepository;
            _likesRepository = likesRepository;
        }

        [HttpPost("{username}")]
        public async Task<IActionResult> AddLike(string username){
            var sourceUserId = User.GetUserId(); // get the current logedIn userId
            var likedUser = await _userRepository.GetUserByUsernameAsync(username); 
            var sourceUser = await _likesRepository.GetUserWithLikes(sourceUserId);
            if(likedUser == null) return NotFound();

            if(sourceUser.UserName == username) return BadRequest("You can't like yourself");
            
            var userLike = await _likesRepository.GetUserLike(sourceUserId,likedUser.Id);
            if(userLike != null) return BadRequest("You already like this user");

            userLike = new UserLike{
                SourceUserId = sourceUserId,
                LikedUserId = likedUser.Id
            };

            sourceUser.LikedUsers.Add(userLike);
            if(await _userRepository.SaveAllAsync()) return Ok();
            return BadRequest($"Failed to like {username}.");

        }

        [HttpGet]
        public async Task<ActionResult<PageList<LikeDto>>> GetUserLikes([FromQuery]Likesparams likesParams){
            likesParams.UserId = User.GetUserId();
            var users = await _likesRepository.GetUserLikes(likesParams);
            Response.AddPaginationHeader(users.CurrentPage, users.PageSize,users.TotalCount,users.TotalPages);
            return Ok(users);
        }
    }
}