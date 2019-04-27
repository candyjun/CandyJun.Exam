using System;
using System.Collections.Generic;
using System.Text;

namespace CandyJun.Exam.Sheet
{
    public class Sheets : BaseEntity
    {
        public virtual int UserId { get; set; }
        public virtual int PaperId { get; set; }
        public virtual int Score { get; set; }
        public virtual EnumSheetStatus Status { get; set; }
    }

    public enum EnumSheetStatus
    {
        Undo = 0,
        Examing = 1,
        Complete = 2
    }
}
