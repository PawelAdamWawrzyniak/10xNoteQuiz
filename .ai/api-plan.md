# REST API Plan

This document outlines the REST API for the 10xNoteQuiz application. The API is designed to be RESTful, resource-oriented, and secured on a per-user basis.

## 1. Resources

The API revolves around the following core resources:

- **Profile**: Represents the authenticated user's application-specific data. (Maps to `public.profiles`)
- **Notes**: The primary resource for user-created content. (Maps to `public.notes`)
- **Categories**: User-defined categories to organize notes. (Maps to `public.categories`)
- **Tags**: User-defined tags to organize notes. (Maps to `public.tags`)
- **Quizzes**: AI-generated quizzes based on a note. (Maps to `public.quizzes`)
- **Quiz Attempts**: Represents a user's single attempt at solving a quiz. (Maps to `public.quiz_attempts`)

## 2. Endpoints

All endpoints are prefixed with `/api`. Access to all resources is restricted to the authenticated user who owns the data.

---

### Profile

Represents the current user's profile.

#### `GET /profile`

- **Description**: Retrieves the profile of the currently authenticated user.
- **Request Body**: None.
- **Response Body**:
  ```json
  {
    "id": "uuid",
    "has_api_key": true,
    "free_quizzes_remaining": 5,
    "created_at": "timestamptz",
    "updated_at": "timestamptz"
  }
  ```
- **Success**: `200 OK`
- **Error**: `401 Unauthorized`

#### `PATCH /profile`

- **Description**: Updates the user's profile, specifically for setting or clearing the API key.
- **Request Body**:
  ```json
  {
    "api_key": "string | null"
  }
  ```
- **Response Body**:
  ```json
  {
    "id": "uuid",
    "has_api_key": true,
    "free_quizzes_remaining": 5,
    "created_at": "timestamptz",
    "updated_at": "timestamptz"
  }
  ```
- **Success**: `200 OK`
- **Error**: `400 Bad Request`, `401 Unauthorized`

---

### Notes

Endpoints for managing notes.

#### `GET /notes`

- **Description**: Retrieves a list of all notes for the user.
- **Query Parameters**:
  - `page` (integer, default: 1): For pagination.
  - `page_size` (integer, default: 20): For pagination.
  - `sort_by` (string, e.g., "updated_at"): Field to sort by.
  - `order` (string, "asc" | "desc", default: "desc"): Sort order.
  - `category_id` (uuid): Filter by category.
  - `tag_id` (uuid): Filter by tag.
- **Response Body**:
  ```json
  {
    "data": [
      {
        "id": "uuid",
        "user_id": "uuid",
        "category_id": "uuid | null",
        "title": "string",
        "created_at": "timestamptz",
        "updated_at": "timestamptz"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 10,
      "total_items": 198
    }
  }
  ```
- **Success**: `200 OK`
- **Error**: `401 Unauthorized`

#### `GET /notes/due-for-review`

- **Description**: Retrieves a list of all notes scheduled for review (where `srs_data.due_date` is today or in the past).
- **Request Body**: None.
- **Response Body**:
  ```json
  {
    "data": [
      {
        "id": "uuid",
        "user_id": "uuid",
        "category_id": "uuid | null",
        "title": "string",
        "created_at": "timestamptz",
        "updated_at": "timestamptz"
      }
    ]
  }
  ```
- **Success**: `200 OK`
- **Error**: `401 Unauthorized`

#### `POST /notes`

- **Description**: Creates a new note.
- **Request Body**:
  ```json
  {
    "title": "string",
    "content": "string",
    "category_id": "uuid | null",
    "tag_ids": ["uuid"]
  }
  ```
- **Response Body**:
  ```json
  {
    "id": "uuid",
    "user_id": "uuid",
    "category_id": "uuid | null",
    "title": "string",
    "content": "string",
    "tags": [{ "id": "uuid", "name": "string" }],
    "created_at": "timestamptz",
    "updated_at": "timestamptz"
  }
  ```
- **Success**: `201 Created`
- **Error**: `400 Bad Request`, `401 Unauthorized`

#### `GET /notes/{noteId}`

- **Description**: Retrieves a single note by its ID.
- **Response Body**:
  ```json
  {
    "id": "uuid",
    "user_id": "uuid",
    "category_id": "uuid | null",
    "title": "string",
    "content": "string",
    "tags": [{ "id": "uuid", "name": "string" }],
    "srs_data": {
      "due_date": "timestamptz",
      "interval": "real",
      "ease_factor": "real"
    },
    "created_at": "timestamptz",
    "updated_at": "timestamptz"
  }
  ```
- **Success**: `200 OK`
- **Error**: `401 Unauthorized`, `404 Not Found`

#### `PATCH /notes/{noteId}`

- **Description**: Updates an existing note.
- **Request Body**:
  ```json
  {
    "title": "string",
    "content": "string",
    "category_id": "uuid | null",
    "tag_ids": ["uuid"]
  }
  ```
- **Response Body**: Same as `GET /notes/{noteId}`.
- **Success**: `200 OK`
- **Error**: `400 Bad Request`, `401 Unauthorized`, `404 Not Found`

#### `DELETE /notes/{noteId}`

- **Description**: Deletes a note.
- **Response Body**: None.
- **Success**: `204 No Content`
- **Error**: `401 Unauthorized`, `404 Not Found`

---

### Quizzes

Endpoints for managing quizzes, which are sub-resources of Notes.

#### `POST /notes/{noteId}/quizzes`

- **Description**: Generates a new quiz for a specific note using the AI service. The created quiz will have a `pending_acceptance` status.
- **Request Body**: None.
- **Response Body**:
  ```json
  {
    "id": "uuid",
    "note_id": "uuid",
    "status": "pending_acceptance",
    "created_at": "timestamptz",
    "questions": [
      {
        "id": "uuid",
        "type": "true_false | multiple_choice | short_answer",
        "content": "string",
        "question_order": "smallint",
        "answers": [
          // only for multiple_choice
          {
            "id": "uuid",
            "content": "string"
          }
        ]
      }
    ]
  }
  ```
- **Success**: `201 Created`
- **Error**: `400 Bad Request` (e.g., note content too short), `401 Unauthorized`, `402 Payment Required` (e.g., out of free quizzes and no API key), `404 Not Found`, `503 Service Unavailable` (AI service error).

#### `POST /quizzes/{quizId}/accept`

- **Description**: Accepts a pending quiz, changing its status to `accepted`.
- **Request Body**: None.
- **Response Body**:
  ```json
  {
    "id": "uuid",
    "note_id": "uuid",
    "status": "accepted",
    "created_at": "timestamptz"
  }
  ```
- **Success**: `200 OK`
- **Error**: `401 Unauthorized`, `404 Not Found`, `409 Conflict` (quiz not in pending state).

#### `POST /quizzes/{quizId}/regenerate`

- **Description**: Rejects a pending quiz and triggers a new generation, returning a new pending quiz.
- **Request Body**: None.
- **Response Body**: Same as `POST /notes/{noteId}/quizzes`.
- **Success**: `201 Created`
- **Error**: `401 Unauthorized`, `404 Not Found`, `409 Conflict` (quiz not in pending state), `503 Service Unavailable`.

#### `DELETE /quizzes/{quizId}`

- **Description**: Deletes a quiz. Can be used to reject a pending quiz without regeneration.
- **Response Body**: None.
- **Success**: `204 No Content`
- **Error**: `401 Unauthorized`, `404 Not Found`

---

### Quiz Attempts

Endpoints for solving quizzes.

#### `POST /quizzes/{quizId}/attempts`

- **Description**: Submits a user's answers for a quiz. The system calculates the score, creates an attempt record, and updates the note's SRS data.
- **Request Body**:
  ```json
  {
    "answers": [
      {
        "question_id": "uuid",
        "answer": "string | uuid" // string for short_answer/true_false, uuid for multiple_choice answer_id
      }
    ]
  }
  ```
- **Response Body**:
  ```json
  {
    "id": "uuid",
    "quiz_id": "uuid",
    "score_percentage": 80,
    "completed_at": "timestamptz",
    "results": [
      {
        "question_id": "uuid",
        "user_answer": "string | uuid",
        "is_correct": true,
        "correct_answers_data": { ... } // Detailed correct answer data
      }
    ]
  }
  ```
- **Success**: `201 Created`
- **Error**: `400 Bad Request`, `401 Unauthorized`, `404 Not Found`

---

### Categories and Tags

Standard CRUD endpoints for managing categories and tags.

#### `GET /categories`, `POST /categories`, `PATCH /categories/{id}`, `DELETE /categories/{id}`

#### `GET /tags`, `POST /tags`, `PATCH /tags/{id}`, `DELETE /tags/{id}`

- **Description**: These endpoints follow standard REST conventions for managing `category` and `tag` resources, scoped to the current user. They accept and return simple `{ "name": "string" }` payloads.

---

### Statistics

Endpoints for retrieving aggregated user statistics.

#### `GET /statistics`

- **Description**: Retrieves aggregated statistical data for the authenticated user.
- **Request Body**: None.
- **Response Body**:
  ```json
  {
    "kpi": {
      "total_notes": 15,
      "total_quiz_attempts": 42,
      "overall_average_score": 83.5,
      "due_for_review_today": 3
    },
    "progress_chart_data": [
      { "week": "2025-10-05", "average_score": 75.0 },
      { "week": "2025-10-12", "average_score": 81.2 },
      { "week": "2025-10-19", "average_score": 85.5 },
      { "week": "2025-10-26", "average_score": 88.0 }
    ],
    "recent_attempts": {
      "data": [
        {
          "completed_at": "timestamptz",
          "note_title": "string",
          "note_id": "uuid",
          "score_percentage": 90
        }
      ],
      "pagination": {
        "current_page": 1,
        "total_pages": 5,
        "total_items": 48
      }
    }
  }
  ```
- **Success**: `200 OK`
- **Error**: `401 Unauthorized`

---

## 3. Authentication and Authorization

- **Authentication**: The API will use JSON Web Tokens (JWT) provided by Supabase Auth. The client must include the `Authorization: Bearer <token>` header in every request to authenticated endpoints.
- **Authorization**: Row-Level Security (RLS) policies are enforced at the database level for all tables. This ensures that users can only perform actions (SELECT, INSERT, UPDATE, DELETE) on data they own. The API layer trusts the database to enforce these permissions. Custom business logic endpoints (e.g., Edge Functions) will run under the authenticated user's role.

## 4. Validation and Business Logic

- **Validation**:
  - `profile`: `free_quizzes_remaining` cannot be negative.
  - `notes`: `title` and `content` are required and cannot be empty.
  - `categories`/`tags`: `name` is required and must be unique per user.
  - `quiz_attempts`: `score_percentage` must be between 0 and 100.
  - Input payloads will be validated for required fields, types, and formats.

- **Business Logic**:
  - **API Key Encryption**: When a user submits an API key via `PATCH /profile`, the backend service will encrypt it using `pgsodium` before storing it in the `profiles.encrypted_api_key` column.
  - **Quiz Generation**: The `POST /notes/{noteId}/quizzes` endpoint orchestrates the quiz generation:
    1.  It retrieves the user's decrypted API key or falls back to a default, rate-limited key.
    2.  It checks if the user has `free_quizzes_remaining` if they are using the default key.
    3.  It constructs a prompt and sends the note's content to the Openrouter.ai service.
    4.  It parses the AI response, validates its structure, and creates records in the `quizzes`, `questions`, and `answers` tables with a `pending_acceptance` status.
  - **SRS Updates**: The `POST /quizzes/{quizId}/attempts` endpoint, after calculating the `score_percentage`, will use this score to update the corresponding `srs_data` record for the parent note, calculating the next `due_date`, `interval`, and `ease_factor` based on an SRS algorithm.
