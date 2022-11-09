using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class LikesRepository : ILikesRepository
    {
        public DataContext _context { get; }
        public IMapper _mapper { get; }
        public LikesRepository(DataContext dataContext, IMapper mapper)
        {
            _mapper = mapper;
            _context = dataContext;
        }

        public async Task<UserLike> GetUserLike(int sourceUserId, int likedUserId) 
            => await _context.Likes.FindAsync(sourceUserId, likedUserId);

        public async Task<PageList<LikeDto>> GetUserLikes(Likesparams likesParams)
        {
           var users = _context.Users.OrderBy(u => u.UserName).AsQueryable();
           var likes = _context.Likes.AsQueryable();

           if (likesParams.Predicate =="liked")
                users = likes.Where(u=> u.SourceUserId == likesParams.UserId).Select(u=> u.LikedUser);

            if (likesParams.Predicate =="likedBy")
                users = likes.Where(u=> u.LikedUserId == likesParams.UserId).Select(u=> u.SourceUser);

           var likedUsers = users.Select(user => new LikeDto 
           {
                UserName = user.UserName,
                KnownAs = user.KnownAs,
                Age = user.DateOfBirth.CalculateAge(),
                PhotoUrl = user.Photos.FirstOrDefault(p => p.IsMain).Url,
                City = user.City,
                Id =  user.Id
           });
           
           return await PageList<LikeDto>.CreateAsync(likedUsers,likesParams.PageNumber, likesParams.PageSize);
        }

        public async Task<AppUser> GetUserWithLikes(int userId)
        {
            return await _context.Users
                    .Include(x=> x.LikedUsers)
                    .FirstOrDefaultAsync(x=> x.Id == userId);
        }
    }
}