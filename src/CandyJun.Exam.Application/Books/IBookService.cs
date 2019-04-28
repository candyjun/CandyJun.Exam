using CandyJun.Exam.Books.Dto;
using Creekdream.Application.Service;
using Creekdream.Application.Service.Dto;
using System;
using System.Threading.Tasks;

namespace CandyJun.Exam.Books
{
    /// <summary>
    /// 书信息服务
    /// </summary>
    public interface IBookService : IApplicationService
    {
        /// <summary>
        /// 获取书信息
        /// </summary>
        Task<GetBookOutput> Get(int id);

        /// <summary>
        /// 获取书信息
        /// </summary>
        Task<PagedResultOutput<GetBookOutput>> GetPaged(GetPagedBookInput input);

        /// <summary>
        /// 新增书信息
        /// </summary>
        Task<GetBookOutput> Add(AddBookInput input);

        /// <summary>
        /// 修改书信息
        /// </summary>
        Task<GetBookOutput> Update(int id, UpdateBookInput input);

        /// <summary>
        /// 删除书信息
        /// </summary>
        Task Delete(int id);
    }
}

