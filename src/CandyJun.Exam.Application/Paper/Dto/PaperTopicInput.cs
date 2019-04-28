using System;
using System.Collections.Generic;
using System.Text;

namespace CandyJun.Exam.Paper.Dto
{
    /// <summary>
    /// 试卷题目关联输入类
    /// </summary>
    public class PaperTopicInput
    {
        /// <summary>
        /// 试卷Id
        /// </summary>
        public int PaperId { get; set; }

        /// <summary>
        /// 题目Id
        /// </summary>
        public int TopicId { get; set; }
    }
}
