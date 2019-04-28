using Creekdream.Orm.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;

namespace CandyJun.Exam
{
    /// <summary>
    /// 
    /// </summary>
    public class BaseRepository<T> : RepositoryBase<T, int>, IBaseRepository<T> where T : BaseEntity
    {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="dbContextProvider"></param>
        public BaseRepository(IDbContextProvider dbContextProvider) : base(dbContextProvider)
        {

        }

        public IQueryable<T> GetAllInclude(params Expression<Func<T, object>>[] propertySelectors)
        {
            return this.GetQueryIncluding(propertySelectors);
        }
    }
}
