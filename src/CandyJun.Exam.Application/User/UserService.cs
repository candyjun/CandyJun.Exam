using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

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
    }
}
