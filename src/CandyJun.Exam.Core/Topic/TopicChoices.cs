using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace CandyJun.Exam.Topic
{
    public class TopicChoices : BaseEntity
    {
        /// <summary>
        /// 
        /// </summary>
        [Required]
        [MaxLength(500)]
        [Column(Order = 1)]
        public virtual string Content { get; set; }
        /// <summary>
        /// 
        /// </summary>
        [Column(Order = 2)]
        public virtual int PickCount { get; set; }
    }
}
