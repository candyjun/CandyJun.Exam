using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace CandyJun.Exam.Topic
{
    /// <summary>
    /// 题目
    /// </summary>
    public class Topics : BaseEntity
    {
        /// <summary>
        /// 
        /// </summary>
        [Required]
        [MaxLength(500)]
        [Column(Order = 1)]
        public virtual string Subject { get; set; }
        /// <summary>
        /// 
        /// </summary>
        [MaxLength(2000)]
        [Column(Order = 2)]
        public virtual string Content { get; set; }
        /// <summary>
        /// 
        /// </summary>
        [Column(Order = 3)]
        public virtual EnumTopicType TopicType { get; set; }
        /// <summary>
        /// 
        /// </summary>
        [MaxLength(2000)]
        [Column(Order = 4)]
        public virtual string Answer { get; set; }
        /// <summary>
        /// 
        /// </summary>
        [MaxLength(2000)]
        [Column(Order = 5)]
        public virtual string Explanation { get; set; }
        [Column(Order = 6)]
        public virtual int DifficultyLevel { get; set; }
    }

    public enum EnumTopicType
    {
        SingleChoice = 1,
        MultipleChoice = 2,
        Judgment = 3,
        Customize = 4,
        Other = 0
    }
}
