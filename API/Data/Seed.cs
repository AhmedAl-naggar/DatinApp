using System.Text;
using System.Security.Cryptography;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class Seed
    {
        public static async Task SeedUsers(DataContext dataContext){
            if(await dataContext.Users.AnyAsync()) return;

            var userData = await System.IO.File.ReadAllTextAsync("Data/Migrations/UserSeedData.json");
            var users = JsonSerializer.Deserialize<List<AppUser>>(userData);
            foreach (AppUser user in users)
            {
                using var hmac = new HMACSHA512();
                user.UserName = user.UserName.ToLower();
                user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes("Pa$$w0rd"));
                user.PasswordSlat = hmac.Key;

                dataContext.Add(user);
            }
            await dataContext.SaveChangesAsync();
        }
        
    }
}