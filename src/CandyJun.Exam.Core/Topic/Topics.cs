using System;
using System.Collections.Generic;
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
        public virtual string Subject { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public virtual string Content { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public virtual EnumTopicType TopicType { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public virtual string Answer { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public virtual string Explanation { get; set; }
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
