using Creekdream;

namespace CandyJun.Exam
{
    /// <summary>
    /// Exam efcore module extension methods for <see cref="ServicesBuilderOptions" />.
    /// </summary>
    public static class ExamEfCoreServicesBuilderExtension 
    {
        /// <summary>
        /// Add a Exam efcore module
        /// </summary>
        public static ServicesBuilderOptions AddExamEfCore(this ServicesBuilderOptions builder)
        {
            builder.IocRegister.RegisterAssemblyByBasicInterface(typeof(ExamEfCoreServicesBuilderExtension).Assembly);
            return builder;
        }
    }
}

