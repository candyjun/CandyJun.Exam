using CandyJun.Exam.Exceptions;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;
using System.Threading.Tasks;

namespace CandyJun.Exam.User
{
    /// <summary>
    /// 
    /// </summary>
    public class UserService : BaseService
    {
        private readonly IBaseRepository<Users> _repository;
        /// <summary>
        /// 
        /// </summary>
        public UserService(IBaseRepository<Users> repository)
        {
            _repository = repository;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="openId"></param>
        /// <returns></returns>
        public async Task Login(string openId)
        {
            var user = await _repository.FirstOrDefaultAsync(f => f.OpenId == openId);
            if (user == null)
            {
                throw new UserFriendlyException(ErrorCode.NotFound, $"{openId}不存在");
            }


        }
    }
}
