using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CandyJun.Exam.Paper
{
    /// <summary>
    /// 
    /// </summary>
    public class PaperService : BaseService
    {
        private readonly IBaseRepository<Papers> _repository;
        /// <summary>
        /// 
        /// </summary>
        public PaperService(IBaseRepository<Papers> repository)
        {
            _repository = repository;
        }
    }
}
