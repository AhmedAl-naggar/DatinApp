using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces
{
    public interface IMessageRepository
    {
        void AddGroup(Group group);
        void RemoveConnection(Connection connection);
        Task<Connection> GetConnection(string connectionId);
        Task<Group> GetMessageGroup(string groupName);
        Task<Group> GetGroupForConnection(string connectionId);
        public void AddMessage(Message message);
        public void DeleteMessage(Message message);
        public Task<Message> GetMessage(int id);
        public Task<PageList<MessageDto>> GetMessagesForUser(MessageParams messageParams);
        public Task<IEnumerable<MessageDto>> GetMessageThread(string currentUsername, string recepientUsername);
        public Task<bool> SaveAllAsync();
    }
}