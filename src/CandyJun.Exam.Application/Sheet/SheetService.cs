using System;
using System.Collections.Generic;
using System.Text;

namespace CandyJun.Exam.Sheet
{
    /// <summary>
    /// 
    /// </summary>
    public class SheetService : BaseService
    {
        private readonly IBaseRepository<Sheets> _repository;
        /// <summary>
        /// 
        /// </summary>
        public SheetService(IBaseRepository<Sheets> repository)
        {
            _repository = repository;
        }
    }
}
