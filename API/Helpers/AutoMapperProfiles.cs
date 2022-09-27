using System.Linq;
using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<AppUser, MemberDto>()
                .ForMember(dest => dest.PhotoUrl,
                           option => option.MapFrom(
                                src => src.Photos.FirstOrDefault(
                                                        p => p.IsMain
                                                  ).Url
                            )
                          );
            CreateMap<Photo, PhotoDto>();

            CreateMap<UpdateMemberDto, AppUser>();
            CreateMap<RegisterDto, AppUser>();
        }
    }
}