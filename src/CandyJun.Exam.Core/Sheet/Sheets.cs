using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace CandyJun.Exam.Sheet
{
    public class Sheets : BaseEntity
    {
        [Column(Order = 1)]
        public virtual int UserId { get; set; }
        [Column(Order = 2)]
        public virtual int PaperId { get; set; }
        [Column(Order = 3)]
        public virtual int Score { get; set; }
        [Column(Order = 4)]
        public virtual EnumSheetStatus Status { get; set; }
    }

    public enum EnumSheetStatus
    {
        Undo = 0,
        Examing = 1,
        Complete = 2
    }
}
