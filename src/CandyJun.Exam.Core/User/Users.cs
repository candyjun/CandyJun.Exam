using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CandyJun.Exam.User
{
    /// <summary>
    /// 
    /// </summary>
    public class Users : BaseEntity
    {
        public const int MaxNameLength = 50;

        /// <summary>
        /// 
        /// </summary>
        [Required]
        [MaxLength(MaxNameLength)]
        public virtual string Name { get; set; }
        /// <summary>
        /// 
        /// </summary>
        [Required]
        public virtual string Password { get; set; }
        [MaxLength(MaxNameLength)]
        public virtual string NickName { get; set; }

        public virtual string OpenId { get; set; }
    }
}
