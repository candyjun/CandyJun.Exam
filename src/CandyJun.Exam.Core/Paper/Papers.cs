using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CandyJun.Exam.Paper
{
    public class Papers : BaseEntity
    {
        public const int MaxNameLength = 50;

        /// <summary>
        /// 
        /// </summary>
        [Required]
        [MaxLength(MaxNameLength)]
        public virtual string Name { get; set; }
        public virtual int DifficultyLevel { get; set; }
    }
}
