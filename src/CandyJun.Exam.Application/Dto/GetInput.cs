using Creekdream.Application.Service.Dto;
using System;
using System.Collections.Generic;
using System.Text;

namespace CandyJun.Exam.Dto
{
    /// <summary>
    /// 查询输入类
    /// </summary>
    public class GetInput : PagedAndSortedResultInput
    {
        /// <summary>
        /// 开始创建时间
        /// </summary>
        public DateTime? CreationTimeBegin { get; set; }

        /// <summary>
        /// 结束创建时间
        /// </summary>
        public DateTime? CreationTimeEnd { get; set; }

        /// <summary>
        /// 开始最近修改时间
        /// </summary>
        public DateTime? LastModificationTimeBegin { get; set; }

        /// <summary>
        /// 结束最近修改时间
        /// </summary>
        public DateTime? LastModificationTimeEnd { get; set; }
    }
}
