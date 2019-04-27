using Creekdream;

namespace CandyJun.Exam
{
    /// <summary>
    /// Exam core module extension methods for <see cref="ServicesBuilderOptions" />.
    /// </summary>
    public static class ExamCoreServicesBuilderExtension
    {
        /// <summary>
        /// Add a Exam core module
        /// </summary>
        public static ServicesBuilderOptions AddExamCore(this ServicesBuilderOptions builder)
        {
            builder.IocRegister.RegisterAssemblyByBasicInterface(typeof(ExamCoreServicesBuilderExtension).Assembly);
            return builder;
        }
    }
}

