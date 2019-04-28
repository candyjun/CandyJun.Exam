using CandyJun.Exam.Dto;
using System;
using System.Collections.Generic;
using System.Text;

namespace CandyJun.Exam.Paper.Dto
{
    /// <summary>
    /// 试卷题目关联输出类
    /// </summary>
    public class PaperTopicOutput : BaseOutput
    {
        /// <summary>
        /// 试卷Id
        /// </summary>
        public int PaperId { get; set; }

        /// <summary>
        /// 题目Id
        /// </summary>
        public int TopicId { get; set; }

        /// <summary>
        /// 排序
        /// </summary>
        public int Sort { get; set; }

        /// <summary>
        /// 分值
        /// </summary>
        public int Score { get; set; }
    }
}
