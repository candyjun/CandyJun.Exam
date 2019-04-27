using Creekdream.Domain.Entities;
using Creekdream.Domain.Entities.Auditing;
using System;
using System.ComponentModel.DataAnnotations;

namespace CandyJun.Exam.Books
{
    /// <summary>
    /// 书信息
    /// </summary>
    public class Book : BaseEntity
    {
        public const int MaxNameLength = 50;

        /// <summary>
        /// 书名
        /// </summary>
        [Required]
        [MaxLength(MaxNameLength)]
        public virtual string Name { get; set; }
    }
}

