using System.Security.Claims;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using System.Linq;
using API.Interfaces;
using AutoMapper;
using API.DTOs;

namespace API.Controllers
{
    [Authorize]
    public class UsersController : BaseApiController
    {
        public IUserRepository _userRepository { get; }
        public IMapper _mapper { get; }

        public UsersController(IUserRepository userRepository, IMapper mapper)
        {
            _mapper = mapper;
            _userRepository = userRepository;

        }

        //https://localhost:5001/api/users
        //GetAllUsers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers()
        {
            return Ok(await _userRepository.GetMembersAsync());
        }

        //GetUserByName
        [HttpGet("{username}")]
        public async Task<ActionResult<MemberDto>> GetUser(string username)
        {
            return Ok(await _userRepository.GetMemberAsync(username));
        }

        [HttpPut]
        public async Task<ActionResult> UpdateUser(UpdateMemberDto updateMemberDto)
        {
            var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var user = await _userRepository.GetUserByUsernameAsync(username);
            _mapper.Map(updateMemberDto, user);
            _userRepository.Update(user);
            if (await _userRepository.SaveAllAsync()) return NoContent();
            return BadRequest("Failed to update user");
        }
    }
}
