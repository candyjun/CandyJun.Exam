using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;

namespace CandyJun.Exam.Utility
{
    /// <summary>
    /// 扩展类型
    /// </summary>
    public static class Util
    {
        /// <summary>
        /// MD5
        /// </summary>
        /// <param name="src"></param>
        /// <returns></returns>
        public static string MD5Hash(string src)
        {
            using (var md5 = MD5.Create())
            {
                var result = md5.ComputeHash(Encoding.UTF8.GetBytes(src));
                var strResult = BitConverter.ToString(result);
                return strResult.Replace("-", "");
            }
        }
    }
}
