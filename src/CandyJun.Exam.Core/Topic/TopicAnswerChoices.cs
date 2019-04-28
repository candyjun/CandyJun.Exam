using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace CandyJun.Exam.Topic
{
    public class TopicAnswerChoices : BaseEntity
    {
        /// <summary>
        /// 
        /// </summary>
        [Column(Order = 1)]
        public virtual int Choice { get; set; }
    }
}
