using Creekdream.Domain.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;

namespace CandyJun.Exam
{
    public interface IBaseRepository<T> : IRepository<T, int> where T : BaseEntity
    {
        IQueryable<T> GetAllInclude(params Expression<Func<T, object>>[] propertySelectors);
    }
}
