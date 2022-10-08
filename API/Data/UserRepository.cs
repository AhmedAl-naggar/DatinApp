using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using API.Entities;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;
using API.DTOs;
using AutoMapper;
using System.Linq;
using AutoMapper.QueryableExtensions;
using API.Helpers;

namespace API.Data
{
    public class UserRepository : IUserRepository
    {
        public DataContext _context { get; }
        public IMapper _mapper { get; }
        public UserRepository(DataContext dataContext, IMapper mapper)
        {
            _mapper = mapper;
            _context = dataContext;
        }

        public async Task<AppUser> GetUserById(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task<AppUser> GetUserByUsernameAsync(string name)
        {
            return await _context.Users.Include(p => p.Photos).SingleOrDefaultAsync<AppUser>(x => x.UserName == name);
        }

        public async Task<IEnumerable<AppUser>> GetUsersAsync()
        {
            return await _context.Users.Include(p => p.Photos).ToListAsync<AppUser>();
        }

        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public void Update(AppUser user)
        {
            _context.Entry(user).State = EntityState.Modified;
        }

        public async Task<PageList<MemberDto>> GetMembersAsync(UserParams userParams)
        {

            var q = _context.Users.AsQueryable();
            q = q.Where(u=> u.UserName != userParams.CurrentUsername);
            q = q.Where(u=> u.Gender == userParams.Gender);

            var minDob = DateTime.Today.AddYears(-userParams.MaxAge -1);
            var maxDob = DateTime.Today.AddYears(-userParams.MinAge);
            q = q.Where(u=> u.DateOfBirth >= minDob && u.DateOfBirth <= maxDob);

            q = userParams.OrderBy switch
            {
              "created"=> q.OrderByDescending(u=>u.Created),  
              _ => q.OrderByDescending(u=>u.LastActive)
            };

            var qury = q
            .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
            .AsNoTracking();
              
            return await PageList<MemberDto>.CreateAsync(qury,userParams.PageNumber,userParams.PageSize);
        }

        public async Task<MemberDto> GetMemberAsync(string username)
        {
            return await _context.Users
            .Where(x=> x.UserName == username)
            .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
            .SingleOrDefaultAsync();
        }
    }
}