using Creekdream.Domain.Entities;
using Creekdream.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.Text;

namespace CandyJun.Exam
{
    /// <summary>
    /// 
    /// </summary>
    public class BaseEntity : Entity<int>, IHasCreationTime, IHasDeletionTime, IHasModificationTime
    {
        /// <summary>
        /// 创建时间
        /// </summary>
        public virtual DateTime CreationTime { get; set; }
        public virtual DateTime? DeletionTime { get; set; }
        public virtual bool IsDeleted { get; set; }
        public virtual DateTime? LastModificationTime { get; set; }
    }
}
