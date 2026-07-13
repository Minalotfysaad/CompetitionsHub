# CompetitionsHub

A modern ASP.NET Core Web API for creating, managing, conducting, and grading online competitions.

CompetitionsHub is designed to support competitions consisting of multiple competition days, where each day contains different types of questions. The system supports automatic grading, manual grading for essay questions, leaderboards, contestant results, and role-based administration.

---

# Features

## Authentication & Authorization

- User Registration
- User Login
- JWT Authentication
- Role-based Authorization
- Secure API endpoints

---

## Competition Management

Administrators can:

- Create competitions
- Edit competitions
- Delete competitions
- Retrieve competitions
- Organize competitions into multiple Competition Days

---

## Competition Day Management

Each competition can contain multiple days.

Administrators can:

- Create Competition Days
- Edit Competition Days
- Delete Competition Days
- Configure:
  - Start Date
  - End Date
  - Day Number
  - Title

The system automatically determines whether a Competition Day is active based on its schedule.

---

## Question Builder

Supports multiple question types similar to Google Forms.

### Supported Question Types

- Multiple Choice
- Short Answer
- Paragraph
- Linear Scale
- Multiple Choice Grid

Each question supports:

- Required / Optional
- Marks
- Display Order
- Correct Answers
- Validation

---

## Contestant Submission System

Contestants can:

- Start a competition day
- Resume unfinished submissions
- Save answers
- Submit answers

The system prevents:

- Duplicate submissions
- Answer modification after submission
- Access outside the competition window

---

## Automatic Grading

Automatically grades:

- Multiple Choice
- Short Answer
- Linear Scale
- Multiple Choice Grid

The grading engine calculates:

- Question score
- Total score
- Percentage
- Submission status

---

## Manual Grading

Paragraph questions are reviewed manually.

Administrators can:

- View pending manual reviews
- Browse competitions with pending reviews
- Browse competition days
- Browse paragraph questions
- Grade individual responses
- Add reviewer comments

After grading, the system automatically recalculates:

- Submission score
- Percentage
- Submission status

---

## Leaderboards

Supports rankings on two levels.

### Competition Day Leaderboard

Ranks contestants for a single competition day.

### Competition Leaderboard

Ranks contestants across the entire competition.

Ranking is calculated based on:

- Total Score
- Percentage

---

## Contestant Results

Contestants can retrieve all of their competition history.

Includes:

- Competition information
- Competition Day results
- Submission status
- Question responses
- Earned marks
- Reviewer comments
- Model answers (after competition ends)

---

## Administrative Results

Administrators can retrieve:

- All submissions for a Competition Day
- Individual contestant responses
- Scores
- Manual grading status

---

# Architecture

The project follows a layered architecture to keep business logic separated from infrastructure.

```
Presentation Layer
        │
Controllers
        │
Services
        │
Repositories
        │
Entity Framework Core
        │
SQL Server
```

### Design Patterns

- Repository Pattern
- Unit of Work Pattern
- Dependency Injection
- DTO Pattern
- AutoMapper
- Service Layer Pattern

---

# Technologies

### Backend

- ASP.NET Core Web API
- C#
- Entity Framework Core
- SQL Server
- LINQ
- AutoMapper

### Authentication

- ASP.NET Core Identity
- JWT Bearer Authentication

### Documentation

- Swagger / OpenAPI

### Database

- SQL Server
- Entity Framework Core Migrations

---

# Project Structure

```
Controllers/
DTOs/
Enums/
Helpers/
Interfaces/
Mappings/
Models/
Repositories/
Services/
Specifications/
Extensions/
```

---

# API Modules

### Authentication

- Register
- Login

### Competitions

- CRUD Operations

### Competition Days

- CRUD Operations
- Contestant View
- Admin View

### Questions

- CRUD Operations

### Submissions

- Start Submission
- Save Answers
- Submit Competition

### Manual Grading

- Pending Reviews
- Grade Responses

### Leaderboards

- Competition Day Rankings
- Competition Rankings

### Results

- Contestant Results
- Competition Day Results

---

# Grading Workflow

```
Contestant Starts Competition
            │
            ▼
Answers Questions
            │
            ▼
Submit Competition
            │
            ▼
Automatic Grading
            │
            ├──────────────► Fully Auto-Graded
            │
            ▼
Contains Paragraph Questions?
            │
       Yes ─────────► Pending Manual Review
                          │
                          ▼
                  Administrator Grades
                          │
                          ▼
                 Final Score Calculated
```

---

# Security

- JWT Authentication
- Role-Based Authorization
- Secure Endpoints
- Input Validation
- Protected Administrative APIs

---

# Future Improvements

- File Upload Questions
- Timed Exams
- Anti-cheating Features
- Email Notifications
- Certificate Generation
- Real-time Leaderboards (SignalR)
- Competition Engine Integration
- Docker Support
- Unit & Integration Testing

---

# Getting Started

## Clone the repository

```bash
git clone https://github.com/Minalotfysaad/CompetitionsHub.git
```

## Restore packages

```bash
dotnet restore
```

## Apply migrations

```bash
dotnet ef database update
```

## Run the project

```bash
dotnet run
```

Swagger will be available at:

```
https://localhost:{port}/swagger
```

---

# Author

**Mina Lotfy**

Junior .NET Backend Developer

GitHub:
https://github.com/Minalotfysaad

LinkedIn:
(Add your LinkedIn URL here)

---

## License

This project is intended for educational and portfolio purposes.
