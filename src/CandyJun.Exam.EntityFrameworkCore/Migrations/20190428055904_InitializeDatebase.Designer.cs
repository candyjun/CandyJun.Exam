﻿// <auto-generated />
using System;
using CandyJun.Exam.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace CandyJun.Exam.Migrations
{
    [DbContext(typeof(ExamDbContext))]
    [Migration("20190428055904_InitializeDatebase")]
    partial class InitializeDatebase
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.2.3-servicing-35854")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            modelBuilder.Entity("CandyJun.Exam.Books.Book", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("CreationTime");

                    b.Property<DateTime?>("DeletionTime");

                    b.Property<bool>("IsDeleted");

                    b.Property<DateTime?>("LastModificationTime");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(50);

                    b.HasKey("Id");

                    b.ToTable("Books");
                });

            modelBuilder.Entity("CandyJun.Exam.Paper.PaperTopics", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("CreationTime");

                    b.Property<DateTime?>("DeletionTime");

                    b.Property<bool>("IsDeleted");

                    b.Property<DateTime?>("LastModificationTime");

                    b.Property<int>("Score");

                    b.Property<int>("Sort");

                    b.Property<int>("TopicId");

                    b.HasKey("Id");

                    b.ToTable("PaperTopics");
                });

            modelBuilder.Entity("CandyJun.Exam.Paper.Papers", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("CreationTime");

                    b.Property<DateTime?>("DeletionTime");

                    b.Property<int>("DifficultyLevel");

                    b.Property<bool>("IsDeleted");

                    b.Property<DateTime?>("LastModificationTime");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(50);

                    b.HasKey("Id");

                    b.ToTable("Papers");
                });

            modelBuilder.Entity("CandyJun.Exam.Sheet.Sheets", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("CreationTime");

                    b.Property<DateTime?>("DeletionTime");

                    b.Property<bool>("IsDeleted");

                    b.Property<DateTime?>("LastModificationTime");

                    b.Property<int>("PaperId");

                    b.Property<int>("Score");

                    b.Property<int>("Status");

                    b.Property<int>("UserId");

                    b.HasKey("Id");

                    b.ToTable("Sheets");
                });

            modelBuilder.Entity("CandyJun.Exam.Topic.TopicAnswerChoices", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("Choice");

                    b.Property<DateTime>("CreationTime");

                    b.Property<DateTime?>("DeletionTime");

                    b.Property<bool>("IsDeleted");

                    b.Property<DateTime?>("LastModificationTime");

                    b.HasKey("Id");

                    b.ToTable("TopicAnswerChoices");
                });

            modelBuilder.Entity("CandyJun.Exam.Topic.TopicChoices", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Content")
                        .IsRequired()
                        .HasMaxLength(500);

                    b.Property<DateTime>("CreationTime");

                    b.Property<DateTime?>("DeletionTime");

                    b.Property<bool>("IsDeleted");

                    b.Property<DateTime?>("LastModificationTime");

                    b.Property<int>("PickCount");

                    b.HasKey("Id");

                    b.ToTable("TopicChoices");
                });

            modelBuilder.Entity("CandyJun.Exam.Topic.Topics", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Answer")
                        .HasMaxLength(2000);

                    b.Property<string>("Content")
                        .HasMaxLength(2000);

                    b.Property<DateTime>("CreationTime");

                    b.Property<DateTime?>("DeletionTime");

                    b.Property<int>("DifficultyLevel");

                    b.Property<string>("Explanation")
                        .HasMaxLength(2000);

                    b.Property<bool>("IsDeleted");

                    b.Property<DateTime?>("LastModificationTime");

                    b.Property<string>("Subject")
                        .IsRequired()
                        .HasMaxLength(500);

                    b.Property<int>("TopicType");

                    b.HasKey("Id");

                    b.ToTable("Topics");
                });

            modelBuilder.Entity("CandyJun.Exam.User.Users", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("CreationTime");

                    b.Property<DateTime?>("DeletionTime");

                    b.Property<bool>("IsDeleted");

                    b.Property<DateTime?>("LastModificationTime");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(50);

                    b.Property<string>("NickName")
                        .HasMaxLength(50);

                    b.Property<string>("OpenId")
                        .HasMaxLength(100);

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasMaxLength(100);

                    b.Property<string>("Salt")
                        .IsRequired()
                        .HasMaxLength(20);

                    b.HasKey("Id");

                    b.ToTable("Users");
                });
#pragma warning restore 612, 618
        }
    }
}
