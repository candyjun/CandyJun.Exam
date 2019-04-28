using System;
using System.Collections.Generic;
using System.Text;

namespace CandyJun.Exam
{
    /// <summary>
    /// 软删除标志
    /// </summary>
    public interface IHasSoftDelete
    {
        /// <summary>
        /// 是否删除
        /// </summary>
        bool IsDeleted { get; set; }
    }
}
