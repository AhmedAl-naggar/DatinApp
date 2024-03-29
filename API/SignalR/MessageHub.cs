﻿using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace API.SignalR
{
    public class MessageHub: Hub 
    {
        private readonly IMessageRepository _messageRepository;
        private readonly IMapper _mapper;
        private readonly IUserRepository _userRepository;
        private readonly IHubContext<PresenceHub> _presenceHubContext;
        private readonly PresenceTracker _tracker;

        public MessageHub(
            IMessageRepository messageRepository, 
            IMapper mapper, 
            IUserRepository userRepository, 
            IHubContext<PresenceHub> presenceHubContext,
            PresenceTracker tracker)

        {
            _messageRepository = messageRepository;
            _mapper = mapper;
            _userRepository = userRepository; 
            _presenceHubContext = presenceHubContext;
            _tracker = tracker;
        }

        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            var otherUser = httpContext.Request.Query["user"].ToString();
            var groupName = GetGroupName(Context.User.GetUsername(), otherUser);
            await Groups.AddToGroupAsync(Context.ConnectionId,groupName);
            var group = await AddToGroup(groupName);
            await Clients.Group(groupName).SendAsync("UpdatedGroup", group);
            var messages = await _messageRepository.GetMessageThread(Context.User.GetUsername(), otherUser);

            await Clients.Caller.SendAsync("ReceiveMessageThread", messages);
        }

        public async Task SendMessage(CreateMessageDto createMessageDto)
        {
            var username = Context.User.GetUsername();
            if (username == createMessageDto.RecepientUsername.ToLower())
                throw new HubException("You cannot send a message to yourself !!! ");

            var sender = await _userRepository.GetUserByUsernameAsync(username);
            var recipient = await _userRepository.GetUserByUsernameAsync(createMessageDto.RecepientUsername);

            if (recipient == null)
                throw new HubException("The recipient user not found");

            var message = new Message
            {
                Sender = sender,
                Recepient = recipient,
                SenderUsername = sender.UserName,
                RecepientUsername = recipient.UserName,
                Content = createMessageDto.Content
            };
            var groupName = GetGroupName(sender.UserName, recipient.UserName);
            var group = await _messageRepository.GetMessageGroup(groupName);
            if (group.Connections.Any(x=>x.Username == recipient.UserName))
            {
                message.DateRead = DateTime.UtcNow;
            }
            else
            {
                var connections = await _tracker.GetConnectionsForUsre(recipient.UserName);
                if(connections != null)
                {
                    await _presenceHubContext.Clients.Clients(connections).SendAsync("NewMessageReceived",
                        new {username=sender.UserName, knownAs= sender.KnownAs});
                }
            }
            _messageRepository.AddMessage(message);
            if (await _messageRepository.SaveAllAsync()) {
                await Clients.Group(groupName).SendAsync("NewMessage",_mapper.Map<MessageDto>(message));
            }
        }

        public override async Task OnDisconnectedAsync(System.Exception exception)
        {
            var group = await RemoveFromMessageGroup(Context.ConnectionId);
            await Clients.Group(group.Name).SendAsync("UpdatedGroup", group);
            await base.OnDisconnectedAsync(exception);
        }

        private string GetGroupName(string caller, string otherUser)
        {
            return string.CompareOrdinal(caller, otherUser) < 0 ? $"{caller}-{otherUser}" : $"{otherUser}-{caller}";
        }

        private async Task<Group> AddToGroup(string groupName) {
            var group = await _messageRepository.GetMessageGroup(groupName);
            var connection = new Connection(Context.ConnectionId, Context.User.GetUsername());
            if (group ==null)
            {
                group = new Group(groupName);
                _messageRepository.AddGroup(group);
            }

            group.Connections.Add(connection);
            if (await _messageRepository.SaveAllAsync()) return group;
            throw new HubException("Failed to join group");
        }

        private async Task<Group> RemoveFromMessageGroup(string connectionId)
        {
            Group group  = await _messageRepository.GetGroupForConnection(Context.ConnectionId);
            var connection = group.Connections.FirstOrDefault(x => x.ConnectionId == Context.ConnectionId);
            _messageRepository.RemoveConnection(connection);
            if (await _messageRepository.SaveAllAsync())
                return group;
            throw new HubException("Failed to remove from group");
        }
    }
}
