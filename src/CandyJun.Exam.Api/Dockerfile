FROM microsoft/dotnet:2.1-aspnetcore-runtime AS base
WORKDIR /app
EXPOSE 8000
EXPOSE 44300

FROM microsoft/dotnet:2.1-sdk AS build
WORKDIR /src
COPY src/CandyJun.Exam.Api/CandyJun.Exam.Api.csproj src/CandyJun.Exam.Api/
RUN dotnet restore src/CandyJun.Exam.Api/CandyJun.Exam.Api.csproj
COPY . .
WORKDIR /src/src/CandyJun.Exam.Api
RUN dotnet build CandyJun.Exam.Api.csproj -c Release -o /app

FROM build AS publish
RUN dotnet publish CandyJun.Exam.Api.csproj -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "CandyJun.Exam.Api.dll"]

