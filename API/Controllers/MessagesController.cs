using System.Collections.Generic;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class MessagesController : BaseApiController
    {
        public IUserRepository _userRepository { get; }
        public IMessageRepository _messageRepository { get; }
        public IMapper _mapper { get; }

        public MessagesController(IUserRepository userRepository, 
                                  IMessageRepository messageRepository,
                                  IMapper mapper)
        {
            _userRepository = userRepository;
            _messageRepository = messageRepository;
            _mapper = mapper;
        }

        [HttpPost]
        public async Task<ActionResult<MessageDto>> CreateMessage(CreateMessageDto createMessageDto){
            var username = User.GetUsername();
            if (username == createMessageDto.RecepientUsername.ToLower())
                return BadRequest("You cannot send a message to yourself !!! ");

            var sender = await _userRepository.GetUserByUsernameAsync(username);
            var recipient = await _userRepository.GetUserByUsernameAsync(createMessageDto.RecepientUsername);

            if (recipient == null)
                return NotFound("The recipient user not found");

            var message = new Message {
                Sender = sender,
                Recepient = recipient,
                SenderUsername = sender.UserName,
                RecepientUsername = recipient.UserName,
                Content = createMessageDto.Content
            };

            _messageRepository.AddMessage(message);
            if ( await _messageRepository.SaveAllAsync()) return Ok(_mapper.Map<MessageDto>(message));
            return BadRequest("Failed to create a new message !!!");
           
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MessageDto>>> GetMessagesForUser([FromQuery] MessageParams messageParams){
            messageParams.Username = User.GetUsername();
            var messages = await _messageRepository.GetMessagesForUser(messageParams);
            Response.AddPaginationHeader(messages.CurrentPage,messages.PageSize,messages.TotalCount,messages.TotalPages);
            return Ok(messages);
        }

        [HttpGet("thread/{username}")]
        public async Task<ActionResult<IEnumerable<MessageDto>>> GetMessageThread(string username){
            var currentUsername = User.GetUsername();
            return Ok(await _messageRepository.GetMessageThread(currentUsername,username));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteMessage(int id){
            var username = User.GetUsername();
            var message = await _messageRepository.GetMessage(id);
            if (message.Sender.UserName == username && message.Recepient.UserName == username) 
                return Unauthorized();
            
            if (message.Sender.UserName == username ) 
                message.SenderDeleted = true;
            
            if (message.Recepient.UserName == username) 
                message.RecepientDeleted = true;
            
            if (message.Sender.UserName == username && message.Recepient.UserName == username) 
            _messageRepository.DeleteMessage(message);

            if (await _messageRepository.SaveAllAsync())
                return Ok();
            return BadRequest("Promblem deleting the message");
        }   

    }
}