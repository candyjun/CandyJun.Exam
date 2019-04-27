using System;
using System.Collections.Generic;
using System.Text;

namespace CandyJun.Exam.Paper
{
    public class PaperTopics : BaseEntity
    {
        public virtual int TopicId { get; set; }
        public virtual int Sort { get; set; }
        public virtual int Score { get; set; }
    }
}
