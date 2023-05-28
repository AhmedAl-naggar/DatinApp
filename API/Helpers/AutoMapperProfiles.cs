using System;
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

            CreateMap<Message,MessageDto>()
                .ForMember(dest => dest.SenderPhotoUrl, 
                                   opt => opt.MapFrom(
                                   src => src.Sender.Photos.FirstOrDefault(x => x.IsMain).Url))
                .ForMember(dest => dest.RecepientPhotoUrl, 
                                   opt => opt.MapFrom(
                                   src => src.Recepient.Photos.FirstOrDefault(x => x.IsMain).Url));
            CreateMap<DateTime, DateTime>().ConvertUsing(d => DateTime.SpecifyKind(d, DateTimeKind.Utc));
        }
    }
}