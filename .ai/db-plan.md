# 10xNoteQuiz - Database Schema

## 1. Tables

### Schemat `auth` (Zarządzany przez Supabase)

Poniższa tabela istnieje w chronionym schemacie `auth` i jest w pełni zarządzana przez system uwierzytelniania Supabase. Nie tworzymy jej samodzielnie, ale nasza tabela `public.profiles` jest z nią bezpośrednio powiązana.

| Column      | Type          | Description                                           |
| ----------- | ------------- | ----------------------------------------------------- |
| `id`        | `uuid`        | Unikalny identyfikator użytkownika. Używany jako klucz obcy. |
| `email`     | `text`        | Adres e-mail użytkownika.                             |
| `created_at`| `timestamptz` | Data utworzenia konta.                                |
| `...`       | `...`         | Inne kolumny zarządzane przez Supabase.               |

### `public.profiles`

Stores user-specific application data, extending the `auth.users` table.

| Column                  | Type                     | Constraints                                                               | Description                               |
| ----------------------- | ------------------------ | ------------------------------------------------------------------------- | ----------------------------------------- |
| `id`                    | `uuid`                   | `PRIMARY KEY`, `REFERENCES auth.users(id) ON DELETE CASCADE`                | User's unique identifier from `auth.users`. |
| `encrypted_api_key`     | `text`                   | `NULL`                                                                    | User's encrypted AI API key.              |
| `free_quizzes_remaining`| `smallint`               | `NOT NULL`, `DEFAULT 5`, `CHECK (free_quizzes_remaining >= 0)`            | Counter for free quiz generations.        |
| `created_at`            | `timestamptz`            | `NOT NULL`, `DEFAULT now()`                                               | Timestamp of profile creation.            |
| `updated_at`            | `timestamptz`            | `NOT NULL`, `DEFAULT now()`                                               | Timestamp of the last profile update.     |

### `public.categories`

Stores user-defined categories for organizing notes.

| Column       | Type          | Constraints                                          | Description                         |
| ------------ | ------------- | ---------------------------------------------------- | ----------------------------------- |
| `id`         | `uuid`        | `PRIMARY KEY`, `DEFAULT gen_random_uuid()`           | Unique identifier for the category. |
| `user_id`    | `uuid`        | `NOT NULL`, `REFERENCES public.profiles(id) ON DELETE CASCADE` | Owner of the category.              |
| `name`       | `text`        | `NOT NULL`                                           | Name of the category.               |
| `created_at` | `timestamptz` | `NOT NULL`, `DEFAULT now()`                          | Timestamp of category creation.     |
|              |               | `UNIQUE (user_id, name)`                             |                                     |

### `public.tags`

Stores user-defined tags for organizing notes.

| Column       | Type          | Constraints                                          | Description                     |
| ------------ | ------------- | ---------------------------------------------------- | ------------------------------- |
| `id`         | `uuid`        | `PRIMARY KEY`, `DEFAULT gen_random_uuid()`           | Unique identifier for the tag.  |
| `user_id`    | `uuid`        | `NOT NULL`, `REFERENCES public.profiles(id) ON DELETE CASCADE` | Owner of the tag.               |
| `name`       | `text`        | `NOT NULL`                                           | Name of the tag.                |
| `created_at` | `timestamptz` | `NOT NULL`, `DEFAULT now()`                          | Timestamp of tag creation.      |
|              |               | `UNIQUE (user_id, name)`                             |                                 |

### `public.notes`

The main entity for storing user notes.

| Column        | Type          | Constraints                                          | Description                                  |
| ------------- | ------------- | ---------------------------------------------------- | -------------------------------------------- |
| `id`          | `uuid`        | `PRIMARY KEY`, `DEFAULT gen_random_uuid()`           | Unique identifier for the note.              |
| `user_id`     | `uuid`        | `NOT NULL`, `REFERENCES public.profiles(id) ON DELETE CASCADE` | Owner of the note.                           |
| `category_id` | `uuid`        | `NULL`, `REFERENCES public.categories(id) ON DELETE SET NULL` | Category the note belongs to (optional).     |
| `title`       | `text`        | `NOT NULL`                                           | Title of the note.                           |
| `content`     | `text`        | `NOT NULL`                                           | Content of the note in Markdown format.      |
| `created_at`  | `timestamptz` | `NOT NULL`, `DEFAULT now()`                          | Timestamp of note creation.                  |
| `updated_at`  | `timestamptz` | `NOT NULL`, `DEFAULT now()`                          | Timestamp of the last note update.           |

### `public.note_tags`

A join table for the many-to-many relationship between `notes` and `tags`.

| Column    | Type   | Constraints                                       | Description                     |
| --------- | ------ | ------------------------------------------------- | ------------------------------- |
| `note_id` | `uuid` | `PRIMARY KEY`, `REFERENCES public.notes(id) ON DELETE CASCADE` | Foreign key to the notes table. |
| `tag_id`  | `uuid` | `PRIMARY KEY`, `REFERENCES public.tags(id) ON DELETE CASCADE`  | Foreign key to the tags table.  |

### `public.srs_data`

Stores the Spaced Repetition System data for each note.

| Column       | Type           | Constraints                                       | Description                               |
| ------------ | -------------- | ------------------------------------------------- | ----------------------------------------- |
| `note_id`    | `uuid`         | `PRIMARY KEY`, `REFERENCES public.notes(id) ON DELETE CASCADE` | The note associated with this SRS data.   |
| `due_date`   | `timestamptz`  | `NOT NULL`, `DEFAULT now()`                       | The next scheduled review date.           |
| `interval`   | `real`         | `NOT NULL`, `DEFAULT 0`                           | The interval in days for the next review. |
| `ease_factor`| `real`         | `NOT NULL`, `DEFAULT 2.5`                         | A factor representing memory stability.   |
| `updated_at` | `timestamptz`  | `NOT NULL`, `DEFAULT now()`                       | Timestamp of the last SRS update.         |

---
**ENUM Types**

```sql
CREATE TYPE quiz_status AS ENUM ('pending_acceptance', 'accepted', 'rejected');
CREATE TYPE question_type AS ENUM ('true_false', 'multiple_choice', 'short_answer');
```
---

### `public.quizzes`

Stores quizzes generated from notes.

| Column            | Type           | Constraints                                       | Description                                       |
| ----------------- | -------------- | ------------------------------------------------- | ------------------------------------------------- |
| `id`              | `uuid`         | `PRIMARY KEY`, `DEFAULT gen_random_uuid()`        | Unique identifier for the quiz.                   |
| `note_id`         | `uuid`         | `NOT NULL`, `REFERENCES public.notes(id) ON DELETE CASCADE` | The note this quiz was generated from.            |
| `status`          | `quiz_status`  | `NOT NULL`, `DEFAULT 'pending_acceptance'`        | The current status of the quiz.                   |
| `ai_prompt`       | `text`         | `NULL`                                            | The exact prompt sent to the AI model.            |
| `ai_raw_response` | `jsonb`        | `NULL`                                            | The raw, unprocessed JSON response from the AI.   |
| `ai_model_version`| `text`         | `NULL`                                            | The version of the AI model used for generation.  |
| `created_at`      | `timestamptz`  | `NOT NULL`, `DEFAULT now()`                       | Timestamp of quiz creation.                       |

### `public.questions`

Stores individual questions for a quiz.

| Column                | Type            | Constraints                                       | Description                                    |
| --------------------- | --------------- | ------------------------------------------------- | ---------------------------------------------- |
| `id`                  | `uuid`          | `PRIMARY KEY`, `DEFAULT gen_random_uuid()`        | Unique identifier for the question.            |
| `quiz_id`             | `uuid`          | `NOT NULL`, `REFERENCES public.quizzes(id) ON DELETE CASCADE` | The quiz this question belongs to.             |
| `type`                | `question_type` | `NOT NULL`                                        | The type of the question.                      |
| `content`             | `text`          | `NOT NULL`                                        | The text of the question.                      |
| `question_order`      | `smallint`      | `NOT NULL`                                        | The display order of the question within the quiz. |
| `correct_answers_data`| `jsonb`         | `NOT NULL`                                        | Structured data for correct answers (e.g., list of valid strings for short answers). |
| `created_at`          | `timestamptz`   | `NOT NULL`, `DEFAULT now()`                       | Timestamp of question creation.                |

### `public.answers`

Stores the possible answer options for multiple-choice questions.

| Column      | Type          | Constraints                                          | Description                               |
| ----------- | ------------- | ---------------------------------------------------- | ----------------------------------------- |
| `id`        | `uuid`        | `PRIMARY KEY`, `DEFAULT gen_random_uuid()`           | Unique identifier for the answer.         |
| `question_id`| `uuid`        | `NOT NULL`, `REFERENCES public.questions(id) ON DELETE CASCADE` | The question this answer belongs to.      |
| `content`   | `text`        | `NOT NULL`                                           | The text of the answer option.            |
| `is_correct`| `boolean`     | `NOT NULL`, `DEFAULT false`                          | Indicates if this is a correct answer.    |
| `created_at`| `timestamptz` | `NOT NULL`, `DEFAULT now()`                          | Timestamp of answer creation.             |

### `public.quiz_attempts`

Records a user's attempt to solve a quiz.

| Column          | Type          | Constraints                                          | Description                               |
| --------------- | ------------- | ---------------------------------------------------- | ----------------------------------------- |
| `id`            | `uuid`        | `PRIMARY KEY`, `DEFAULT gen_random_uuid()`           | Unique identifier for the attempt.        |
| `user_id`       | `uuid`        | `NOT NULL`, `REFERENCES public.profiles(id) ON DELETE CASCADE` | The user who made the attempt.            |
| `quiz_id`       | `uuid`        | `NOT NULL`, `REFERENCES public.quizzes(id) ON DELETE CASCADE` | The quiz that was attempted.              |
| `score_percentage`| `smallint`    | `NOT NULL`, `CHECK (score_percentage BETWEEN 0 AND 100)` | The final score as a percentage.          |
| `completed_at`  | `timestamptz` | `NOT NULL`, `DEFAULT now()`                          | Timestamp when the attempt was completed. |
| `user_answers`  | `jsonb`       | `NOT NULL`                                           | A JSON object storing the user's answers for each question. |

## 2. Relationships

*   **Profiles & Auth Users**: `profiles` has a one-to-one relationship with `auth.users`.
*   **Notes & Categories**: A note can have one category. A category can have many notes (one-to-many).
*   **Notes & Tags**: A note can have many tags, and a tag can be applied to many notes (many-to-many, via `note_tags`).
*   **Notes & Quizzes**: A note can have multiple quizzes (one-to-many).
*   **Quizzes & Questions**: A quiz consists of multiple questions (one-to-many).
*   **Questions & Answers**: A multiple-choice question has multiple possible answers (one-to-many).
*   **Notes & SRS Data**: Each note has one corresponding SRS data entry (one-to-one).
*   **Users/Quizzes & Attempts**: A user can attempt a quiz multiple times. An attempt is linked to one user and one quiz (many-to-many with payload, via `quiz_attempts`).

## 3. Indexes

Indexes are automatically created for all `PRIMARY KEY` and `FOREIGN KEY` constraints. Additional indexes are defined below for performance.

*   **`categories_user_id_name_idx`**: on `(user_id, name)` in `categories` to speed up lookups.
*   **`tags_user_id_name_idx`**: on `(user_id, name)` in `tags` to speed up lookups.
*   **`notes_updated_at_idx`**: on `updated_at DESC` in `notes` for default sorting.
*   **`questions_quiz_id_order_idx`**: on `(quiz_id, question_order)` in `questions` to speed up fetching questions in order.

## 4. Row-Level Security (RLS)

RLS will be enabled on all tables to ensure users can only access their own data.

```sql
-- General policy for tables with a direct user_id link
CREATE POLICY "Enable read access for user based on user_id"
ON public.table_name
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Enable insert access for user based on user_id"
ON public.table_name
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update access for user based on user_id"
ON public.table_name
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Enable delete access for user based on user_id"
ON public.table_name
FOR DELETE
USING (auth.uid() = user_id);

-- Example for a table like `quizzes` which is linked via `notes`
CREATE POLICY "Enable read access for quiz owner"
ON public.quizzes
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM notes
    WHERE notes.id = quizzes.note_id AND notes.user_id = auth.uid()
  )
);
-- (Similar policies for INSERT, UPDATE, DELETE would be needed for indirectly linked tables)
```

## 5. Additional Notes

*   **Encryption**: The `encrypted_api_key` in the `profiles` table should be encrypted and decrypted at the application layer or using database extensions like `pgsodium`. The chosen method is `pgsodium` as per planning notes.
*   **Cascading Deletes**: `ON DELETE CASCADE` is used to maintain data integrity. For example, deleting a user will remove all their profiles, notes, quizzes, and related data.
*   **Data Integrity**: `CHECK` constraints are used to enforce rules, such as `score_percentage` being between 0 and 100. `NOT NULL` constraints are applied where data is essential.
*   **Triggers for `updated_at`**: A trigger function should be implemented to automatically update the `updated_at` columns in `profiles` and `notes` tables whenever a row is modified.
