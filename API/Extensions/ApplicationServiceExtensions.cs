using API.Data;
using API.Helpers;
using API.Interfaces;
using API.Services;
using API.SignalR;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace API.ApplicationServiceExtensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
        {
            services.AddSingleton<PresenceTracker>();
            services.Configure<CloudinarySettings>(config.GetSection("CloudinarySettings"));

            services.AddScoped<IPhotoService,PhotoService>();
            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IMessageRepository, MessageRepository>();
            services.AddScoped<LogUserActivity>();
            services.AddScoped<ILikesRepository, LikesRepository>();
            services.AddAutoMapper(typeof(AutoMapperProfiles).Assembly);
            services.AddDbContext<DataContext>(options =>
            {
                options.UseSqlite(config.GetConnectionString("DefaultConnection"));
            });

            return services;
        }
    }
}