using Creekdream.Domain.Repositories;
using System;
using System.Collections.Generic;
using System.Text;

namespace CandyJun.Exam
{
    public interface IBaseRepository<T> : IRepository<T, int> where T : BaseEntity
    {
    }
}
