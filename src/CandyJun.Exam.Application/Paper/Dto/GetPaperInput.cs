using CandyJun.Exam.Dto;
using System;
using System.Collections.Generic;
using System.Text;

namespace CandyJun.Exam.Paper.Dto
{
    /// <summary>
    /// 查询试卷输入类
    /// </summary>
    public class GetPaperInput : GetInput
    {
        /// <summary>
        /// 名称
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// 难度等级
        /// </summary>
        public int? DifficultyLevel { get; set; }
    }
}
