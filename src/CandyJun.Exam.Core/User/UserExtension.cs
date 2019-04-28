using CandyJun.Exam.Utility;
using System;
using System.Collections.Generic;
using System.Text;

namespace CandyJun.Exam.User
{
    /// <summary>
    /// Users实体类扩展
    /// </summary>
    public static class UserExtension
    {
        /// <summary>
        /// 产生随机盐值
        /// </summary>
        public static void GenerateSalt(this Users user)
        {
            if (user == null) return;

            user.Salt = Guid.NewGuid().ToString("X").Substring(0, 6);
        }

        /// <summary>
        /// 加密密码
        /// </summary>
        public static void HashPassword(this Users user)
        {
            user.HashPassword(user.Password);
        }

        /// <summary>
        /// 加密密码
        /// </summary>
        public static void HashPassword(this Users user, string password)
        {
            if (user == null) return;

            user.HashPassword(password, user.Salt);
        }

        /// <summary>
        /// 加密密码
        /// </summary>
        public static void HashPassword(this Users user, string password, string salt)
        {
            if (user == null) return;

            user.Password = Util.MD5Hash($"{password}{salt}");
        }
    }
}
