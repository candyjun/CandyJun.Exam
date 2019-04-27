using Creekdream;

namespace CandyJun.Exam
{
    /// <summary>
    /// Exam application module extension methods for <see cref="ServicesBuilderOptions" />.
    /// </summary>
    public static class ExamApplicationServicesBuilderExtension
    {
        /// <summary>
        /// Add a Exam application module
        /// </summary>
        public static ServicesBuilderOptions AddExamApplication(this ServicesBuilderOptions builder)
        {
            builder.IocRegister.RegisterAssemblyByBasicInterface(typeof(ExamApplicationServicesBuilderExtension).Assembly);
            return builder;
        }
    }
}

