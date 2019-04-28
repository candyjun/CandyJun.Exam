using Creekdream.Domain.Entities;
using Creekdream.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace CandyJun.Exam
{
    /// <summary>
    /// 
    /// </summary>
    public class BaseEntity : Entity<int>, IHasCreationTime, IHasDeletionTime, IHasModificationTime, IHasSoftDelete
    {
        /// <summary>
        /// 创建时间
        /// </summary>
        public virtual DateTime CreationTime { get; set; }
        /// <summary>
        /// 删除时间
        /// </summary>
        public virtual DateTime? DeletionTime { get; set; }
        /// <summary>
        /// 是否删除
        /// </summary>
        public virtual bool IsDeleted { get; set; }
        /// <summary>
        /// 最近修改时间
        /// </summary>
        public virtual DateTime? LastModificationTime { get; set; }
    }
}
