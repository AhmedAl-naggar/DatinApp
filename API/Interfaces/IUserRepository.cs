using System.Threading.Tasks;
using System.Collections;
using API.Entities;
using System.Collections.Generic;
using API.DTOs;

namespace API.Interfaces
{
    public interface IUserRepository
    {
         public Task<AppUser> GetUserById(int id);
         public Task<AppUser> GetUserByUsernameAsync(string name);
         public Task<IEnumerable<AppUser>> GetUsersAsync();
         public Task<bool> SaveAllAsync ();
         public void Update(AppUser user);
         public Task<IEnumerable<MemberDto>> GetMembersAsync(); 
         public Task<MemberDto> GetMemberAsync(string username); 
    }
}