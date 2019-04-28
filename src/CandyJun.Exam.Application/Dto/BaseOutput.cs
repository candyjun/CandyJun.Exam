using System;
using System.Collections.Generic;
using System.Text;

namespace CandyJun.Exam.Dto
{
    /// <summary>
    /// 输出基类
    /// </summary>
    public class BaseOutput
    {
        /// <summary>
        /// 主键Id
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// 创建时间
        /// </summary>
        public DateTime CreationTime { get; set; }

        /// <summary>
        /// 删除时间
        /// </summary>
        public DateTime? DeletionTime { get; set; }

        /// <summary>
        /// 是否删除
        /// </summary>
        public bool IsDeleted { get; set; }

        /// <summary>
        /// 最近修改时间
        /// </summary>
        public DateTime? LastModificationTime { get; set; }
    }
}
