using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Identity;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;
        public AccountController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, ITokenService tokenService, IMapper mapper)
        {
            _mapper = mapper;
            _userManager = userManager;
            _signInManager = signInManager;
            _tokenService = tokenService;
        }

        //https://localhost:5001/api/account/register
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (await UserExists(registerDto.Username.ToLower()))
            {
                return BadRequest("The Username is already exist");
            }
            else if (registerDto.Username == null)
            {
                return BadRequest("The Username is required");
            }
            else if (registerDto.Password == null)
            {
                return BadRequest("The Password is required");
            }
            
            var user = _mapper.Map<AppUser>(registerDto);
            user.UserName = registerDto.Username.ToLower();
            
            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }
            
            var roleResult = await _userManager.AddToRoleAsync(user,"Member");
            
            if (!roleResult.Succeeded) return BadRequest(roleResult.Errors);
            
            return new UserDto
            {
                Username = user.UserName,
                Token = await _tokenService.CreateToken(user),
                KnownAs = user.KnownAs,
                Gender = user.Gender
            };
        }

        //https://localhost:5001/api/account/login
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _userManager.Users
            .Include(p => p.Photos)
            .SingleOrDefaultAsync(u => u.UserName == loginDto.Username.ToLower());
            
            if (user == null) return Unauthorized("Invalid Username");

            var result = await _signInManager.CheckPasswordSignInAsync(user,loginDto.Password, false);

            if (!result.Succeeded)
            {
                return Unauthorized("Invalid Password");
            }

            return new UserDto
            {
                Username = user.UserName,
                Token = await _tokenService.CreateToken(user),
                PhotoUrl = user.Photos.FirstOrDefault(p => p.IsMain)?.Url,
                KnownAs = user.KnownAs,
                Gender = user.Gender
            };
        }
        private async Task<bool> UserExists(string username)
        {
            return await _userManager.Users.AnyAsync(u => u.UserName == username.ToLower());
        }
    }
}