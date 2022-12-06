using System.Runtime.CompilerServices;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Extensions;

namespace API.Entities
{
    public class AppUser
    {
        #region Prop
        public int Id { get; set; }
        public string UserName { get; set; }
        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSlat { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string KnownAs  { get; set; }
        public DateTime Created { get; set; } = DateTime.Now;
        public DateTime LastActive { get; set; } = DateTime.Now;
        public string Introduction { get; set; }
        public string LookingFor { get; set; }
        public string Gender { get; set; }
        public string Interests { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public ICollection<Photo> Photos { get; set; }

        public ICollection<UserLike> LikedByUsers { get; set; }
        public ICollection<UserLike> LikedUsers { get; set; }


        public ICollection<Message> MessagesSent { get; set; }
        public ICollection<Message> MessagesRecevied { get; set; }

        #endregion

        #region Methods
        public int GetAge(){
            return DateOfBirth.CalculateAge();
        }
        #endregion
    }
}
