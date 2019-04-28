using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace CandyJun.Exam.Paper
{
    public class Papers : BaseEntity
    {
        public const int MaxNameLength = 50;

        /// <summary>
        /// 名称
        /// </summary>
        [Required]
        [MaxLength(MaxNameLength)]
        public virtual string Name { get; set; }

        /// <summary>
        /// 描述
        /// </summary>
        [MaxLength(2000)]
        public virtual string Description { get; set; }

        /// <summary>
        /// 难度等级
        /// </summary>
        public virtual int DifficultyLevel { get; set; }
    }
}
