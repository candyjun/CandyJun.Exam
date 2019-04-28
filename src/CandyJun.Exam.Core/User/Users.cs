using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
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
        [Column(Order = 1)]
        public virtual string Name { get; set; }
        /// <summary>
        /// 
        /// </summary>
        [Required]
        [MaxLength(100)]
        [Column(Order = 2)]
        public virtual string Password { get; set; }
        /// <summary>
        /// 
        /// </summary>
        [Required]
        [MaxLength(20)]
        [Column(Order = 3)]
        public virtual string Salt { get; set; }
        [MaxLength(MaxNameLength)]
        public virtual string NickName { get; set; }

        [MaxLength(100)]
        [Column(Order = 4)]
        public virtual string OpenId { get; set; }
    }
}
