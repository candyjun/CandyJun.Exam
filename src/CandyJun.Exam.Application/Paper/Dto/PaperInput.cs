using System;
using System.Collections.Generic;
using System.Text;

namespace CandyJun.Exam.Paper.Dto
{
    /// <summary>
    /// 试卷输入类
    /// </summary>
    public class PaperInput
    {
        /// <summary>
        /// 名称
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// 描述
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// 难度等级
        /// </summary>
        public int DifficultyLevel { get; set; }
    }
}
