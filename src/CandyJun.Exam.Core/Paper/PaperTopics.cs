﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace CandyJun.Exam.Paper
{
    /// <summary>
    /// 试卷题目
    /// </summary>
    public class PaperTopics : BaseEntity
    {
        /// <summary>
        /// 试卷Id
        /// </summary>
        public virtual int PaperId { get; set; }

        /// <summary>
        /// 题目Id
        /// </summary>
        public virtual int TopicId { get; set; }

        /// <summary>
        /// 排序
        /// </summary>
        public virtual int Sort { get; set; }

        /// <summary>
        /// 分值
        /// </summary>
        public virtual int Score { get; set; }
    }
}
