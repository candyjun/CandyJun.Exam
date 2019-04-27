using System;
using System.Collections.Generic;
using System.Text;

namespace CandyJun.Exam.Topic
{
    public class TopicChoices : BaseEntity
    {
        /// <summary>
        /// 
        /// </summary>
        public virtual string Content { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public virtual int PickCount { get; set; }
    }
}
