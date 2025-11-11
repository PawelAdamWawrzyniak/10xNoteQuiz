-- Migration: 20251111161431_seed_quizzes.sql
-- Description: Seed quizzes with questions and answers for existing notes
-- Tables affected: quizzes, questions, answers
-- Special notes: This migration inserts all existing quizzes, questions, and answers

-- Insert quiz for note: "Playwright"
INSERT INTO public.quizzes (id, note_id, status, ai_prompt, ai_raw_response, ai_model_version, created_at) VALUES (
  'bff1fc40-d552-46f1-bf93-95429c0101dd',
  'a86190d6-cfe8-4c1a-a851-e5eadfb3ade0',
  'rejected'::quiz_status,
  'Generated quiz for note: "Playwright"',
  '{"title":"Quiz Wiedzy o Playwright","questions":[{"type":"true_false","question_text":"Playwright został stworzony przez Google.","correct_answer":"Fałsz"},{"type":"true_false","question_text":"Playwright wymaga instalacji dodatkowych bibliotek do runnera testów i asercji.","correct_answer":"Fałsz"},{"type":"multiple_choice","options":["Chromium","WebKit","Firefox","Edge Legacy"],"question_text":"Które przeglądarki są wspierane przez Playwright?","correct_answer":["Chromium","WebKit","Firefox"]},{"type":"multiple_choice","options":["Auto-waiting dla elementów","Zintegrowane narzędzia do debugowania","Wymaga ręcznego pisania synchronizacji","Wsparcie dla wielu przeglądarek"],"question_text":"Które z poniższych są kluczowymi zaletami Playwright?","correct_answer":["Auto-waiting dla elementów","Zintegrowane narzędzia do debugowania","Wsparcie dla wielu przeglądarek"]},{"type":"multiple_choice","options":["getByRole","getByLabel","getByText","CSS selectors tied to DOM structure"],"question_text":"Które z poniższych są zalecanymi sposobami lokalizowania elementów w Playwright?","correct_answer":["getByRole","getByLabel","getByText"]},{"type":"multiple_choice","options":["Retries dla nieudanych testów","Timeout dla testów","Reporter dla wyników testów","Nazwa użytkownika dla logowania"],"question_text":"Które z poniższych konfiguracji można ustawić w pliku `playwright.config.ts`?","correct_answer":["Retries dla nieudanych testów","Timeout dla testów","Reporter dla wyników testów"]},{"type":"short_answer","question_text":"Jaki jest główny benefit z test isolation w Playwright?","correct_answer":"Brak zanieczyszczenia testów"},{"type":"short_answer","question_text":"Jak nazywa się tryb w Playwright, który pozwala na interaktywne przechodzenie przez testy?","correct_answer":"UI Mode"}]}'::jsonb,
  'google/gemini-2.5-flash-lite',
  '2025-11-11T11:52:16.872+00:00'
);

-- Insert question: true_false (Order: 1)
INSERT INTO public.questions (id, quiz_id, type, content, question_order, correct_answers_data, created_at) VALUES (
  'bca37761-a32b-417e-8be9-f25aaa4199e9',
  'bff1fc40-d552-46f1-bf93-95429c0101dd',
  'true_false'::question_type,
  'Playwright został stworzony przez Google.',
  1,
  '{"type":"true_false","correct_answer":false}'::jsonb,
  '2025-11-11T11:52:16.872+00:00'
);

-- Insert question: true_false (Order: 2)
INSERT INTO public.questions (id, quiz_id, type, content, question_order, correct_answers_data, created_at) VALUES (
  '90c1e3dc-8c3f-4b36-8701-e9ebdfec211e',
  'bff1fc40-d552-46f1-bf93-95429c0101dd',
  'true_false'::question_type,
  'Playwright wymaga instalacji dodatkowych bibliotek do runnera testów i asercji.',
  2,
  '{"type":"true_false","correct_answer":false}'::jsonb,
  '2025-11-11T11:52:16.872+00:00'
);

-- Insert question: multiple_choice (Order: 3)
INSERT INTO public.questions (id, quiz_id, type, content, question_order, correct_answers_data, created_at) VALUES (
  '9bb90ddb-5650-49a8-8c6f-319bce02dc5a',
  'bff1fc40-d552-46f1-bf93-95429c0101dd',
  'multiple_choice'::question_type,
  'Które przeglądarki są wspierane przez Playwright?',
  3,
  '{"type":"multiple_choice","correct_answer_ids":["50460195-62b3-4290-992e-ed508b4b857c","4cb75b9d-0f98-4441-9dfb-97beda361f26","89023994-7769-4b6e-b9cb-609b65fe738d"],"correct_answer_texts":["Chromium","WebKit","Firefox"]}'::jsonb,
  '2025-11-11T11:52:16.872+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '50460195-62b3-4290-992e-ed508b4b857c',
  '9bb90ddb-5650-49a8-8c6f-319bce02dc5a',
  'Chromium',
  true,
  '2025-11-11T11:52:16.872+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '4cb75b9d-0f98-4441-9dfb-97beda361f26',
  '9bb90ddb-5650-49a8-8c6f-319bce02dc5a',
  'WebKit',
  true,
  '2025-11-11T11:52:16.872+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '89023994-7769-4b6e-b9cb-609b65fe738d',
  '9bb90ddb-5650-49a8-8c6f-319bce02dc5a',
  'Firefox',
  true,
  '2025-11-11T11:52:16.872+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '3746e29c-7505-488d-978d-163508913d70',
  '9bb90ddb-5650-49a8-8c6f-319bce02dc5a',
  'Edge Legacy',
  false,
  '2025-11-11T11:52:16.872+00:00'
);

-- Insert question: multiple_choice (Order: 4)
INSERT INTO public.questions (id, quiz_id, type, content, question_order, correct_answers_data, created_at) VALUES (
  '7a2b98e5-399d-454a-95ce-fdf0199c0706',
  'bff1fc40-d552-46f1-bf93-95429c0101dd',
  'multiple_choice'::question_type,
  'Które z poniższych są kluczowymi zaletami Playwright?',
  4,
  '{"type":"multiple_choice","correct_answer_ids":["10f0bec5-8516-447a-9342-1bcaf489a6f4","69861ba9-3624-404a-a1a2-2df17b90f39d","bbcd66fd-10c6-4fab-8d0a-a921836e8e74"],"correct_answer_texts":["Auto-waiting dla elementów","Zintegrowane narzędzia do debugowania","Wsparcie dla wielu przeglądarek"]}'::jsonb,
  '2025-11-11T11:52:16.872+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '10f0bec5-8516-447a-9342-1bcaf489a6f4',
  '7a2b98e5-399d-454a-95ce-fdf0199c0706',
  'Auto-waiting dla elementów',
  true,
  '2025-11-11T11:52:16.872+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '69861ba9-3624-404a-a1a2-2df17b90f39d',
  '7a2b98e5-399d-454a-95ce-fdf0199c0706',
  'Zintegrowane narzędzia do debugowania',
  true,
  '2025-11-11T11:52:16.872+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '88342070-6cf7-4367-87c3-1368c69daeeb',
  '7a2b98e5-399d-454a-95ce-fdf0199c0706',
  'Wymaga ręcznego pisania synchronizacji',
  false,
  '2025-11-11T11:52:16.872+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  'bbcd66fd-10c6-4fab-8d0a-a921836e8e74',
  '7a2b98e5-399d-454a-95ce-fdf0199c0706',
  'Wsparcie dla wielu przeglądarek',
  true,
  '2025-11-11T11:52:16.872+00:00'
);

-- Insert question: multiple_choice (Order: 5)
INSERT INTO public.questions (id, quiz_id, type, content, question_order, correct_answers_data, created_at) VALUES (
  '673e5cce-e48f-4441-a35f-8dcefdae7728',
  'bff1fc40-d552-46f1-bf93-95429c0101dd',
  'multiple_choice'::question_type,
  'Które z poniższych są zalecanymi sposobami lokalizowania elementów w Playwright?',
  5,
  '{"type":"multiple_choice","correct_answer_ids":["aa537400-9aa3-472c-ae9f-a3383e405d1c","500c63e7-518b-4cb3-acf6-8ce22915d78b","f8262b1b-a102-4a5d-b7ba-42ab407f5eb9"],"correct_answer_texts":["getByRole","getByLabel","getByText"]}'::jsonb,
  '2025-11-11T11:52:16.872+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  'aa537400-9aa3-472c-ae9f-a3383e405d1c',
  '673e5cce-e48f-4441-a35f-8dcefdae7728',
  'getByRole',
  true,
  '2025-11-11T11:52:16.872+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '500c63e7-518b-4cb3-acf6-8ce22915d78b',
  '673e5cce-e48f-4441-a35f-8dcefdae7728',
  'getByLabel',
  true,
  '2025-11-11T11:52:16.872+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  'f8262b1b-a102-4a5d-b7ba-42ab407f5eb9',
  '673e5cce-e48f-4441-a35f-8dcefdae7728',
  'getByText',
  true,
  '2025-11-11T11:52:16.872+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '69cf0d11-43b1-4a62-9333-90ccbeb89e11',
  '673e5cce-e48f-4441-a35f-8dcefdae7728',
  'CSS selectors tied to DOM structure',
  false,
  '2025-11-11T11:52:16.872+00:00'
);

-- Insert question: multiple_choice (Order: 6)
INSERT INTO public.questions (id, quiz_id, type, content, question_order, correct_answers_data, created_at) VALUES (
  'd7de7ebe-dd4b-44ab-9249-0010bfa91050',
  'bff1fc40-d552-46f1-bf93-95429c0101dd',
  'multiple_choice'::question_type,
  'Które z poniższych konfiguracji można ustawić w pliku `playwright.config.ts`?',
  6,
  '{"type":"multiple_choice","correct_answer_ids":["1a9f4614-97a8-44ec-a83d-85f7fd39f86d","b1fa6342-9555-4d72-b78c-25be367ffa6a","3eefe8c3-ac9d-494a-8e82-ec396a399b01"],"correct_answer_texts":["Retries dla nieudanych testów","Timeout dla testów","Reporter dla wyników testów"]}'::jsonb,
  '2025-11-11T11:52:16.872+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '1a9f4614-97a8-44ec-a83d-85f7fd39f86d',
  'd7de7ebe-dd4b-44ab-9249-0010bfa91050',
  'Retries dla nieudanych testów',
  true,
  '2025-11-11T11:52:16.872+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  'b1fa6342-9555-4d72-b78c-25be367ffa6a',
  'd7de7ebe-dd4b-44ab-9249-0010bfa91050',
  'Timeout dla testów',
  true,
  '2025-11-11T11:52:16.872+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '3eefe8c3-ac9d-494a-8e82-ec396a399b01',
  'd7de7ebe-dd4b-44ab-9249-0010bfa91050',
  'Reporter dla wyników testów',
  true,
  '2025-11-11T11:52:16.872+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  'ba5f7297-5bc4-4d7a-8beb-f7b9b616a521',
  'd7de7ebe-dd4b-44ab-9249-0010bfa91050',
  'Nazwa użytkownika dla logowania',
  false,
  '2025-11-11T11:52:16.872+00:00'
);

-- Insert question: short_answer (Order: 7)
INSERT INTO public.questions (id, quiz_id, type, content, question_order, correct_answers_data, created_at) VALUES (
  '92f5a19c-391b-4c6a-b929-1b1d238bd838',
  'bff1fc40-d552-46f1-bf93-95429c0101dd',
  'short_answer'::question_type,
  'Jaki jest główny benefit z test isolation w Playwright?',
  7,
  '{"type":"short_answer","case_sensitive":false,"correct_answers":["Brak zanieczyszczenia testów"]}'::jsonb,
  '2025-11-11T11:52:16.872+00:00'
);

-- Insert question: short_answer (Order: 8)
INSERT INTO public.questions (id, quiz_id, type, content, question_order, correct_answers_data, created_at) VALUES (
  '76242e82-626e-47df-820f-6442daf6baec',
  'bff1fc40-d552-46f1-bf93-95429c0101dd',
  'short_answer'::question_type,
  'Jak nazywa się tryb w Playwright, który pozwala na interaktywne przechodzenie przez testy?',
  8,
  '{"type":"short_answer","case_sensitive":false,"correct_answers":["UI Mode"]}'::jsonb,
  '2025-11-11T11:52:16.872+00:00'
);


-- Insert quiz for note: "Playwright"
INSERT INTO public.quizzes (id, note_id, status, ai_prompt, ai_raw_response, ai_model_version, created_at) VALUES (
  '8058dae6-16f0-4d84-8b0c-d04a554e4f06',
  'a86190d6-cfe8-4c1a-a851-e5eadfb3ade0',
  'accepted'::quiz_status,
  'Generated quiz for note: "Playwright"',
  '{"title":"Quiz Wiedzy o Playwright","questions":[{"type":"true_false","options":["Prawda","Fałsz"],"question_text":"Playwright jest frameworkiem stworzonym przez Google.","correct_answer":"Fałsz"},{"type":"true_false","options":["Prawda","Fałsz"],"question_text":"Playwright automatycznie czeka na elementy, aż staną się gotowe do interakcji, eliminując potrzebę ręcznego dodawania `sleep()`.","correct_answer":"Prawda"},{"type":"multiple_choice","options":["Chromium","WebKit","Internet Explorer","Firefox"],"question_text":"Które z poniższych przeglądarek są wspierane przez Playwright?","correct_answer":["Chromium","WebKit","Firefox"]},{"type":"multiple_choice","options":["Brak potrzeby instalowania osobnych runnerów testowych","Zintegrowane narzędzia do debugowania","Obsługa tylko przeglądarki Chrome","Wbudowane generowanie kodu (Codegen)"],"question_text":"Jakie są kluczowe zalety Playwright jako ''All-in-One Solution''?","correct_answer":["Brak potrzeby instalowania osobnych runnerów testowych","Zintegrowane narzędzia do debugowania","Wbudowane generowanie kodu (Codegen)"]},{"type":"multiple_choice","options":["getByRole","getCssSelector","getByLabel","getByText"],"question_text":"Które z poniższych są zalecanymi, przyjaznymi dla użytkownika lokalizatorami w Playwright?","correct_answer":["getByRole","getByLabel","getByText"]},{"type":"multiple_choice","options":["Test timeout","Action timeout","Page load timeout","Assertion timeout"],"question_text":"Które z poniższych są przykładowymi opcjami konfiguracji timeout w Playwright?","correct_answer":["Test timeout","Action timeout","Assertion timeout"]},{"type":"short_answer","question_text":"Jaki jest główny benefit wynikający z ''Test Isolation'' w Playwright?","correct_answer":"Brak zanieczyszczania testów"},{"type":"short_answer","question_text":"Podaj przykład polecenia do uruchomienia testów w trybie UI w Playwright.","correct_answer":"npx playwright test --ui"}]}'::jsonb,
  'google/gemini-2.5-flash-lite',
  '2025-11-11T11:52:37.257+00:00'
);

-- Insert question: true_false (Order: 1)
INSERT INTO public.questions (id, quiz_id, type, content, question_order, correct_answers_data, created_at) VALUES (
  'e08f96ce-a3c4-43a9-978a-c1cc8b72a0d5',
  '8058dae6-16f0-4d84-8b0c-d04a554e4f06',
  'true_false'::question_type,
  'Playwright jest frameworkiem stworzonym przez Google.',
  1,
  '{"type":"true_false","correct_answer":false}'::jsonb,
  '2025-11-11T11:52:37.257+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '9f5cf72f-d048-44cb-b196-c155c9fc560c',
  'e08f96ce-a3c4-43a9-978a-c1cc8b72a0d5',
  'Prawda',
  false,
  '2025-11-11T11:52:37.257+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '101ad379-e6ae-48a2-b45d-832c731cca6f',
  'e08f96ce-a3c4-43a9-978a-c1cc8b72a0d5',
  'Fałsz',
  true,
  '2025-11-11T11:52:37.257+00:00'
);

-- Insert question: true_false (Order: 2)
INSERT INTO public.questions (id, quiz_id, type, content, question_order, correct_answers_data, created_at) VALUES (
  'ac65f797-badc-4de3-ae47-2b7af9e2bfd2',
  '8058dae6-16f0-4d84-8b0c-d04a554e4f06',
  'true_false'::question_type,
  'Playwright automatycznie czeka na elementy, aż staną się gotowe do interakcji, eliminując potrzebę ręcznego dodawania `sleep()`.',
  2,
  '{"type":"true_false","correct_answer":true}'::jsonb,
  '2025-11-11T11:52:37.257+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  'f431f7cc-ce61-4598-a63a-01238c4a8cfd',
  'ac65f797-badc-4de3-ae47-2b7af9e2bfd2',
  'Prawda',
  true,
  '2025-11-11T11:52:37.257+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '8291f9d7-9415-4de2-9efd-3e28d3b98dc5',
  'ac65f797-badc-4de3-ae47-2b7af9e2bfd2',
  'Fałsz',
  false,
  '2025-11-11T11:52:37.257+00:00'
);

-- Insert question: multiple_choice (Order: 3)
INSERT INTO public.questions (id, quiz_id, type, content, question_order, correct_answers_data, created_at) VALUES (
  'eb334ab3-db3f-4243-be43-15138c478e6d',
  '8058dae6-16f0-4d84-8b0c-d04a554e4f06',
  'multiple_choice'::question_type,
  'Które z poniższych przeglądarek są wspierane przez Playwright?',
  3,
  '{"type":"multiple_choice","correct_answer_ids":["8a38fb6d-2178-465f-ad20-1d6091f261de","0cb014e2-38f5-4c3f-bd41-92531b239711","4ed23267-d023-4cdf-923e-1b6eae6a116a"],"correct_answer_texts":["Chromium","WebKit","Firefox"]}'::jsonb,
  '2025-11-11T11:52:37.257+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '8a38fb6d-2178-465f-ad20-1d6091f261de',
  'eb334ab3-db3f-4243-be43-15138c478e6d',
  'Chromium',
  true,
  '2025-11-11T11:52:37.257+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '0cb014e2-38f5-4c3f-bd41-92531b239711',
  'eb334ab3-db3f-4243-be43-15138c478e6d',
  'WebKit',
  true,
  '2025-11-11T11:52:37.257+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '4c14f91e-26ea-4680-a643-78a237dba37f',
  'eb334ab3-db3f-4243-be43-15138c478e6d',
  'Internet Explorer',
  false,
  '2025-11-11T11:52:37.257+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '4ed23267-d023-4cdf-923e-1b6eae6a116a',
  'eb334ab3-db3f-4243-be43-15138c478e6d',
  'Firefox',
  true,
  '2025-11-11T11:52:37.257+00:00'
);

-- Insert question: multiple_choice (Order: 4)
INSERT INTO public.questions (id, quiz_id, type, content, question_order, correct_answers_data, created_at) VALUES (
  'f9b01bbb-f12d-49cd-91b0-04960bedd2f8',
  '8058dae6-16f0-4d84-8b0c-d04a554e4f06',
  'multiple_choice'::question_type,
  'Jakie są kluczowe zalety Playwright jako ''All-in-One Solution''?',
  4,
  '{"type":"multiple_choice","correct_answer_ids":["fdf3f17a-1915-467e-b1b1-ddcb552a541d","6a10858e-302e-4fb8-bccf-70193aac2875","40ba0dc0-967c-41d5-a076-d5ea5a42ec70"],"correct_answer_texts":["Brak potrzeby instalowania osobnych runnerów testowych","Zintegrowane narzędzia do debugowania","Wbudowane generowanie kodu (Codegen)"]}'::jsonb,
  '2025-11-11T11:52:37.257+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  'fdf3f17a-1915-467e-b1b1-ddcb552a541d',
  'f9b01bbb-f12d-49cd-91b0-04960bedd2f8',
  'Brak potrzeby instalowania osobnych runnerów testowych',
  true,
  '2025-11-11T11:52:37.257+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '6a10858e-302e-4fb8-bccf-70193aac2875',
  'f9b01bbb-f12d-49cd-91b0-04960bedd2f8',
  'Zintegrowane narzędzia do debugowania',
  true,
  '2025-11-11T11:52:37.257+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '43dded8f-0676-4ad8-827d-f7eff438f703',
  'f9b01bbb-f12d-49cd-91b0-04960bedd2f8',
  'Obsługa tylko przeglądarki Chrome',
  false,
  '2025-11-11T11:52:37.257+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '40ba0dc0-967c-41d5-a076-d5ea5a42ec70',
  'f9b01bbb-f12d-49cd-91b0-04960bedd2f8',
  'Wbudowane generowanie kodu (Codegen)',
  true,
  '2025-11-11T11:52:37.257+00:00'
);

-- Insert question: multiple_choice (Order: 5)
INSERT INTO public.questions (id, quiz_id, type, content, question_order, correct_answers_data, created_at) VALUES (
  '153cdaef-7e7a-4148-a6b5-0f20a0b05072',
  '8058dae6-16f0-4d84-8b0c-d04a554e4f06',
  'multiple_choice'::question_type,
  'Które z poniższych są zalecanymi, przyjaznymi dla użytkownika lokalizatorami w Playwright?',
  5,
  '{"type":"multiple_choice","correct_answer_ids":["0f8b272a-3b2a-4701-93e6-c2d1ea3d4a74","4ae6400a-fb51-4ee6-9c39-1f5e6e222469","f8ec86ed-bfd7-4dcc-8f84-b581ef59c5fb"],"correct_answer_texts":["getByRole","getByLabel","getByText"]}'::jsonb,
  '2025-11-11T11:52:37.257+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '0f8b272a-3b2a-4701-93e6-c2d1ea3d4a74',
  '153cdaef-7e7a-4148-a6b5-0f20a0b05072',
  'getByRole',
  true,
  '2025-11-11T11:52:37.257+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '6a5517a1-a074-449e-9980-d49f27ee4328',
  '153cdaef-7e7a-4148-a6b5-0f20a0b05072',
  'getCssSelector',
  false,
  '2025-11-11T11:52:37.257+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '4ae6400a-fb51-4ee6-9c39-1f5e6e222469',
  '153cdaef-7e7a-4148-a6b5-0f20a0b05072',
  'getByLabel',
  true,
  '2025-11-11T11:52:37.257+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  'f8ec86ed-bfd7-4dcc-8f84-b581ef59c5fb',
  '153cdaef-7e7a-4148-a6b5-0f20a0b05072',
  'getByText',
  true,
  '2025-11-11T11:52:37.257+00:00'
);

-- Insert question: multiple_choice (Order: 6)
INSERT INTO public.questions (id, quiz_id, type, content, question_order, correct_answers_data, created_at) VALUES (
  'ad304e34-09c3-4ac5-9abb-7da3428fc653',
  '8058dae6-16f0-4d84-8b0c-d04a554e4f06',
  'multiple_choice'::question_type,
  'Które z poniższych są przykładowymi opcjami konfiguracji timeout w Playwright?',
  6,
  '{"type":"multiple_choice","correct_answer_ids":["c829d3aa-0ec5-43c1-851b-e161869c85bc","7b5d29b1-078c-435a-8f2b-efd9495493f5","1f512921-fdab-4476-a733-1235286eed8b"],"correct_answer_texts":["Test timeout","Action timeout","Assertion timeout"]}'::jsonb,
  '2025-11-11T11:52:37.257+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  'c829d3aa-0ec5-43c1-851b-e161869c85bc',
  'ad304e34-09c3-4ac5-9abb-7da3428fc653',
  'Test timeout',
  true,
  '2025-11-11T11:52:37.257+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '7b5d29b1-078c-435a-8f2b-efd9495493f5',
  'ad304e34-09c3-4ac5-9abb-7da3428fc653',
  'Action timeout',
  true,
  '2025-11-11T11:52:37.257+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '3511929e-883c-4d0f-9bd9-a0b8e18d682d',
  'ad304e34-09c3-4ac5-9abb-7da3428fc653',
  'Page load timeout',
  false,
  '2025-11-11T11:52:37.257+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '1f512921-fdab-4476-a733-1235286eed8b',
  'ad304e34-09c3-4ac5-9abb-7da3428fc653',
  'Assertion timeout',
  true,
  '2025-11-11T11:52:37.257+00:00'
);

-- Insert question: short_answer (Order: 7)
INSERT INTO public.questions (id, quiz_id, type, content, question_order, correct_answers_data, created_at) VALUES (
  'd2896fa9-8ebc-46af-9598-13b89d087611',
  '8058dae6-16f0-4d84-8b0c-d04a554e4f06',
  'short_answer'::question_type,
  'Jaki jest główny benefit wynikający z ''Test Isolation'' w Playwright?',
  7,
  '{"type":"short_answer","case_sensitive":false,"correct_answers":["Brak zanieczyszczania testów"]}'::jsonb,
  '2025-11-11T11:52:37.257+00:00'
);

-- Insert question: short_answer (Order: 8)
INSERT INTO public.questions (id, quiz_id, type, content, question_order, correct_answers_data, created_at) VALUES (
  '451f70c4-e0d0-4a35-87ee-de5543b7ca29',
  '8058dae6-16f0-4d84-8b0c-d04a554e4f06',
  'short_answer'::question_type,
  'Podaj przykład polecenia do uruchomienia testów w trybie UI w Playwright.',
  8,
  '{"type":"short_answer","case_sensitive":false,"correct_answers":["npx playwright test --ui"]}'::jsonb,
  '2025-11-11T11:52:37.257+00:00'
);


-- Insert quiz for note: "DDD - Value Object"
INSERT INTO public.quizzes (id, note_id, status, ai_prompt, ai_raw_response, ai_model_version, created_at) VALUES (
  '540f95d7-86df-4e2c-80e8-047a1325d674',
  '92d9030a-8152-482b-8ca4-f84ad1e10e2c',
  'rejected'::quiz_status,
  'Generated quiz for note: "DDD - Value Object"',
  '{"title":"Quiz: Value Objects w DDD","questions":[{"type":"true_false","options":["Prawda","Fałsz"],"question_text":"Value Object jest definiowany przez swoją tożsamość, a nie przez stan swoich atrybutów.","correct_answer":"Fałsz"},{"type":"true_false","options":["Prawda","Fałsz"],"question_text":"Główną cechą Value Object jest jego niezmienność (immutability) po utworzeniu.","correct_answer":"Prawda"},{"type":"multiple_choice","options":["Posiada unikalny identyfikator","Porównywanie przez wartość","Brak tożsamości","Zmienność stanu po utworzeniu"],"question_text":"Które z poniższych cech są charakterystyczne dla Value Object?","correct_answer":["Porównywanie przez wartość","Brak tożsamości","Niezmienność"]},{"type":"multiple_choice","options":["Użytkownik systemu (z unikalnym ID)","Adres (ulica, miasto, kod pocztowy)","Kwota pieniędzy (wartość, waluta)","Zakres dat (data początkowa, data końcowa)"],"question_text":"Które z poniższych przykładów najlepiej ilustrują koncepcję Value Object?","correct_answer":["Adres (ulica, miasto, kod pocztowy)","Kwota pieniędzy (wartość, waluta)","Zakres dat (data początkowa, data końcowa)"]},{"type":"multiple_choice","options":["Zmodyfikować istniejącą instancję obiektu","Utworzyć nową instancję obiektu z pożądanymi wartościami","Wywołać metodę ''update'' na istniejącej instancji","Zwrócić błąd, ponieważ obiekty Value są niezmienne"],"question_text":"Co należy zrobić, gdy chcemy ''zmienić'' wartość obiektu typu Value Object?","correct_answer":["Utworzyć nową instancję obiektu z pożądanymi wartościami"]},{"type":"multiple_choice","options":["Reprezentowanie encji z unikalną tożsamością","Zastępowanie prymitywnych typów danych (primitive obsession)","Enkapsulacja logiki biznesowej i walidacji","Budowanie złożonych obiektów poprzez kompozycję"],"question_text":"Które z poniższych zastosowań jest odpowiednie dla Value Objects?","correct_answer":["Zastępowanie prymitywnych typów danych (primitive obsession)","Enkapsulacja logiki biznesowej i walidacji","Budowanie złożonych obiektów poprzez kompozycję"]},{"type":"short_answer","question_text":"Podaj jeden przykład sytuacji, w której NIE należy używać Value Object.","correct_answer":"Encja z tożsamością"},{"type":"short_answer","question_text":"Jak definiuje się równość dwóch instancji Value Object?","correct_answer":"Na podstawie wszystkich atrybutów"}]}'::jsonb,
  'google/gemini-2.5-flash-lite',
  '2025-11-11T11:53:17.697+00:00'
);

-- Insert question: true_false (Order: 1)
INSERT INTO public.questions (id, quiz_id, type, content, question_order, correct_answers_data, created_at) VALUES (
  '3e462d46-3d74-432c-97be-9f6e8b790ec5',
  '540f95d7-86df-4e2c-80e8-047a1325d674',
  'true_false'::question_type,
  'Value Object jest definiowany przez swoją tożsamość, a nie przez stan swoich atrybutów.',
  1,
  '{"type":"true_false","correct_answer":false}'::jsonb,
  '2025-11-11T11:53:17.697+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  'a909ce82-f10d-40dd-9887-94126ac6a6fa',
  '3e462d46-3d74-432c-97be-9f6e8b790ec5',
  'Prawda',
  false,
  '2025-11-11T11:53:17.697+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '0e961e83-0fc5-4965-9c7c-47e9682000e0',
  '3e462d46-3d74-432c-97be-9f6e8b790ec5',
  'Fałsz',
  true,
  '2025-11-11T11:53:17.697+00:00'
);

-- Insert question: true_false (Order: 2)
INSERT INTO public.questions (id, quiz_id, type, content, question_order, correct_answers_data, created_at) VALUES (
  '3b058ade-d184-4b85-a4a4-362e4b04217e',
  '540f95d7-86df-4e2c-80e8-047a1325d674',
  'true_false'::question_type,
  'Główną cechą Value Object jest jego niezmienność (immutability) po utworzeniu.',
  2,
  '{"type":"true_false","correct_answer":true}'::jsonb,
  '2025-11-11T11:53:17.697+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '729e4d65-6f9f-493b-afdc-955e93626e37',
  '3b058ade-d184-4b85-a4a4-362e4b04217e',
  'Prawda',
  true,
  '2025-11-11T11:53:17.697+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  'e6ec06bb-d14a-467f-a4a1-4b95d1de4b0c',
  '3b058ade-d184-4b85-a4a4-362e4b04217e',
  'Fałsz',
  false,
  '2025-11-11T11:53:17.697+00:00'
);

-- Insert question: multiple_choice (Order: 3)
INSERT INTO public.questions (id, quiz_id, type, content, question_order, correct_answers_data, created_at) VALUES (
  '47b3e230-f5f1-46a9-97a1-2c28f8393f6e',
  '540f95d7-86df-4e2c-80e8-047a1325d674',
  'multiple_choice'::question_type,
  'Które z poniższych cech są charakterystyczne dla Value Object?',
  3,
  '{"type":"multiple_choice","correct_answer_ids":["8fcc3884-8c39-4ff1-9eba-53a114d32ed7","adbeebd6-319c-4817-93c9-96be72a9d9db"],"correct_answer_texts":["Porównywanie przez wartość","Brak tożsamości","Niezmienność"]}'::jsonb,
  '2025-11-11T11:53:17.697+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  'd7606096-e97b-4213-b27a-3369dfc3a217',
  '47b3e230-f5f1-46a9-97a1-2c28f8393f6e',
  'Posiada unikalny identyfikator',
  false,
  '2025-11-11T11:53:17.697+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '8fcc3884-8c39-4ff1-9eba-53a114d32ed7',
  '47b3e230-f5f1-46a9-97a1-2c28f8393f6e',
  'Porównywanie przez wartość',
  true,
  '2025-11-11T11:53:17.697+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  'adbeebd6-319c-4817-93c9-96be72a9d9db',
  '47b3e230-f5f1-46a9-97a1-2c28f8393f6e',
  'Brak tożsamości',
  true,
  '2025-11-11T11:53:17.697+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '11e6ce6a-80fd-451c-973c-0e76e68ab434',
  '47b3e230-f5f1-46a9-97a1-2c28f8393f6e',
  'Zmienność stanu po utworzeniu',
  false,
  '2025-11-11T11:53:17.697+00:00'
);

-- Insert question: multiple_choice (Order: 4)
INSERT INTO public.questions (id, quiz_id, type, content, question_order, correct_answers_data, created_at) VALUES (
  '26e229ef-5f1f-479e-9c46-c023928432a9',
  '540f95d7-86df-4e2c-80e8-047a1325d674',
  'multiple_choice'::question_type,
  'Które z poniższych przykładów najlepiej ilustrują koncepcję Value Object?',
  4,
  '{"type":"multiple_choice","correct_answer_ids":["a8aa8379-e2aa-429d-8f76-37841cf2862a","f9dbb3c3-0c9f-42ad-acad-7862dee2a4ed","b6ff6664-1ac6-42e9-a087-f6014febf2a9"],"correct_answer_texts":["Adres (ulica, miasto, kod pocztowy)","Kwota pieniędzy (wartość, waluta)","Zakres dat (data początkowa, data końcowa)"]}'::jsonb,
  '2025-11-11T11:53:17.697+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '21abad13-557e-46c5-bf40-8c3444d44342',
  '26e229ef-5f1f-479e-9c46-c023928432a9',
  'Użytkownik systemu (z unikalnym ID)',
  false,
  '2025-11-11T11:53:17.697+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  'a8aa8379-e2aa-429d-8f76-37841cf2862a',
  '26e229ef-5f1f-479e-9c46-c023928432a9',
  'Adres (ulica, miasto, kod pocztowy)',
  true,
  '2025-11-11T11:53:17.697+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  'f9dbb3c3-0c9f-42ad-acad-7862dee2a4ed',
  '26e229ef-5f1f-479e-9c46-c023928432a9',
  'Kwota pieniędzy (wartość, waluta)',
  true,
  '2025-11-11T11:53:17.697+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  'b6ff6664-1ac6-42e9-a087-f6014febf2a9',
  '26e229ef-5f1f-479e-9c46-c023928432a9',
  'Zakres dat (data początkowa, data końcowa)',
  true,
  '2025-11-11T11:53:17.697+00:00'
);

-- Insert question: multiple_choice (Order: 5)
INSERT INTO public.questions (id, quiz_id, type, content, question_order, correct_answers_data, created_at) VALUES (
  'a8134d18-ca33-43f6-a054-cc1935a39e34',
  '540f95d7-86df-4e2c-80e8-047a1325d674',
  'multiple_choice'::question_type,
  'Co należy zrobić, gdy chcemy ''zmienić'' wartość obiektu typu Value Object?',
  5,
  '{"type":"multiple_choice","correct_answer_ids":["1d09e0d6-a550-4b5d-a2f6-20d42a528767"],"correct_answer_texts":["Utworzyć nową instancję obiektu z pożądanymi wartościami"]}'::jsonb,
  '2025-11-11T11:53:17.697+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '6f6ed060-43eb-4972-a44e-f9138ca14ed6',
  'a8134d18-ca33-43f6-a054-cc1935a39e34',
  'Zmodyfikować istniejącą instancję obiektu',
  false,
  '2025-11-11T11:53:17.697+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '1d09e0d6-a550-4b5d-a2f6-20d42a528767',
  'a8134d18-ca33-43f6-a054-cc1935a39e34',
  'Utworzyć nową instancję obiektu z pożądanymi wartościami',
  true,
  '2025-11-11T11:53:17.697+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '4ccb580e-abbe-44fb-a051-86b886ebf5c4',
  'a8134d18-ca33-43f6-a054-cc1935a39e34',
  'Wywołać metodę ''update'' na istniejącej instancji',
  false,
  '2025-11-11T11:53:17.697+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  'd8bda35c-5d68-464a-bc86-6ae3efc9a887',
  'a8134d18-ca33-43f6-a054-cc1935a39e34',
  'Zwrócić błąd, ponieważ obiekty Value są niezmienne',
  false,
  '2025-11-11T11:53:17.697+00:00'
);

-- Insert question: multiple_choice (Order: 6)
INSERT INTO public.questions (id, quiz_id, type, content, question_order, correct_answers_data, created_at) VALUES (
  '36d84071-11c8-4e93-9e04-c94925a5bbc1',
  '540f95d7-86df-4e2c-80e8-047a1325d674',
  'multiple_choice'::question_type,
  'Które z poniższych zastosowań jest odpowiednie dla Value Objects?',
  6,
  '{"type":"multiple_choice","correct_answer_ids":["a1b95d6f-9a38-4508-b7b1-6652658dd04b","6ba8121d-f684-4527-9806-7901ce6a4ffe","b487362d-1096-443d-8d05-679eb784445b"],"correct_answer_texts":["Zastępowanie prymitywnych typów danych (primitive obsession)","Enkapsulacja logiki biznesowej i walidacji","Budowanie złożonych obiektów poprzez kompozycję"]}'::jsonb,
  '2025-11-11T11:53:17.697+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '1107ea7a-7501-4a06-9f40-eb576422fb60',
  '36d84071-11c8-4e93-9e04-c94925a5bbc1',
  'Reprezentowanie encji z unikalną tożsamością',
  false,
  '2025-11-11T11:53:17.697+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  'a1b95d6f-9a38-4508-b7b1-6652658dd04b',
  '36d84071-11c8-4e93-9e04-c94925a5bbc1',
  'Zastępowanie prymitywnych typów danych (primitive obsession)',
  true,
  '2025-11-11T11:53:17.697+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '6ba8121d-f684-4527-9806-7901ce6a4ffe',
  '36d84071-11c8-4e93-9e04-c94925a5bbc1',
  'Enkapsulacja logiki biznesowej i walidacji',
  true,
  '2025-11-11T11:53:17.697+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  'b487362d-1096-443d-8d05-679eb784445b',
  '36d84071-11c8-4e93-9e04-c94925a5bbc1',
  'Budowanie złożonych obiektów poprzez kompozycję',
  true,
  '2025-11-11T11:53:17.697+00:00'
);

-- Insert question: short_answer (Order: 7)
INSERT INTO public.questions (id, quiz_id, type, content, question_order, correct_answers_data, created_at) VALUES (
  'ab67eb5c-26b2-445c-9f99-0962abea9659',
  '540f95d7-86df-4e2c-80e8-047a1325d674',
  'short_answer'::question_type,
  'Podaj jeden przykład sytuacji, w której NIE należy używać Value Object.',
  7,
  '{"type":"short_answer","case_sensitive":false,"correct_answers":["Encja z tożsamością"]}'::jsonb,
  '2025-11-11T11:53:17.697+00:00'
);

-- Insert question: short_answer (Order: 8)
INSERT INTO public.questions (id, quiz_id, type, content, question_order, correct_answers_data, created_at) VALUES (
  'dd7224c7-ca60-41fb-94d5-89f25ed6767e',
  '540f95d7-86df-4e2c-80e8-047a1325d674',
  'short_answer'::question_type,
  'Jak definiuje się równość dwóch instancji Value Object?',
  8,
  '{"type":"short_answer","case_sensitive":false,"correct_answers":["Na podstawie wszystkich atrybutów"]}'::jsonb,
  '2025-11-11T11:53:17.697+00:00'
);


-- Insert quiz for note: "DDD - Value Object"
INSERT INTO public.quizzes (id, note_id, status, ai_prompt, ai_raw_response, ai_model_version, created_at) VALUES (
  '7800f172-0c7b-4da0-ba17-6ff8ace7f0f7',
  '92d9030a-8152-482b-8ca4-f84ad1e10e2c',
  'rejected'::quiz_status,
  'Generated quiz for note: "DDD - Value Object"',
  '{"title":"Quiz o Value Objects w DDD","questions":[{"type":"true_false","options":["Prawda","Fałsz"],"question_text":"Value Object posiada unikalny identyfikator.","correct_answer":"Fałsz"},{"type":"true_false","options":["Prawda","Fałsz"],"question_text":"Value Object jest z założenia niezmienny (immutable).","correct_answer":"Prawda"},{"type":"multiple_choice","options":["Posiada unikalny identyfikator","Porównywanie po wartości","Niezmienność","Możliwość modyfikacji po utworzeniu"],"question_text":"Które z poniższych cech charakteryzują Value Object?","correct_answer":["Porównywanie po wartości","Niezmienność","Brak tożsamości"]},{"type":"multiple_choice","options":["Użytkownik z ID","Adres (ulica, miasto, kod pocztowy)","Konto bankowe z numerem","Kwota pieniędzy (wartość, waluta)"],"question_text":"Które z poniższych przykładów najlepiej ilustrują Value Object?","correct_answer":["Adres (ulica, miasto, kod pocztowy)","Kwota pieniędzy (wartość, waluta)"]},{"type":"multiple_choice","options":["Bezpośrednio zmienić jego atrybuty","Utworzyć nową instancję z pożądanymi zmianami","Wywołać metodę ''update''","Zastąpić istniejącą instancję nową"],"question_text":"Co należy zrobić, aby ''zmodyfikować'' Value Object?","correct_answer":["Utworzyć nową instancję z pożądanymi zmianami"]},{"type":"multiple_choice","options":["Przekazywanie obiektu typu ''Adres''","Przekazywanie ciągu znaków reprezentującego email","Przekazywanie liczby dla wieku","Przekazywanie liczby i osobnego ciągu znaków dla waluty"],"question_text":"Które z poniższych jest przykładem ''Primitive Obsession'', które można zastąpić Value Object?","correct_answer":["Przekazywanie ciągu znaków reprezentującego email","Przekazywanie liczby i osobnego ciągu znaków dla waluty"]},{"type":"short_answer","question_text":"Jak definiuje się równość dwóch Value Objects?","correct_answer":"Na podstawie wszystkich atrybutów"},{"type":"short_answer","question_text":"W jaki sposób Value Object zapewnia integralność danych?","correct_answer":"Walidacja przy tworzeniu"}]}'::jsonb,
  'google/gemini-2.5-flash-lite',
  '2025-11-11T11:53:44.127+00:00'
);

-- Insert question: true_false (Order: 1)
INSERT INTO public.questions (id, quiz_id, type, content, question_order, correct_answers_data, created_at) VALUES (
  '56726a41-c108-4be0-b4a1-c12727123993',
  '7800f172-0c7b-4da0-ba17-6ff8ace7f0f7',
  'true_false'::question_type,
  'Value Object posiada unikalny identyfikator.',
  1,
  '{"type":"true_false","correct_answer":false}'::jsonb,
  '2025-11-11T11:53:44.127+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '1012cb4e-105c-4d18-9559-7278517cd319',
  '56726a41-c108-4be0-b4a1-c12727123993',
  'Prawda',
  false,
  '2025-11-11T11:53:44.127+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  'a0315854-40e8-4821-b007-16812471dd98',
  '56726a41-c108-4be0-b4a1-c12727123993',
  'Fałsz',
  true,
  '2025-11-11T11:53:44.127+00:00'
);

-- Insert question: true_false (Order: 2)
INSERT INTO public.questions (id, quiz_id, type, content, question_order, correct_answers_data, created_at) VALUES (
  '3a5b2ab9-74ee-4f01-af01-562ef517e1b3',
  '7800f172-0c7b-4da0-ba17-6ff8ace7f0f7',
  'true_false'::question_type,
  'Value Object jest z założenia niezmienny (immutable).',
  2,
  '{"type":"true_false","correct_answer":true}'::jsonb,
  '2025-11-11T11:53:44.127+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '26d37ed8-b82d-463c-9d30-15483d15cd9c',
  '3a5b2ab9-74ee-4f01-af01-562ef517e1b3',
  'Prawda',
  true,
  '2025-11-11T11:53:44.127+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '831de740-60a1-4fd2-a923-583b9fd66a0d',
  '3a5b2ab9-74ee-4f01-af01-562ef517e1b3',
  'Fałsz',
  false,
  '2025-11-11T11:53:44.127+00:00'
);

-- Insert question: multiple_choice (Order: 3)
INSERT INTO public.questions (id, quiz_id, type, content, question_order, correct_answers_data, created_at) VALUES (
  'ef3b0a52-6f3b-4e1a-8592-3302b24a9e1a',
  '7800f172-0c7b-4da0-ba17-6ff8ace7f0f7',
  'multiple_choice'::question_type,
  'Które z poniższych cech charakteryzują Value Object?',
  3,
  '{"type":"multiple_choice","correct_answer_ids":["e66e7716-af8b-46ec-83a6-007c8afe3267","9cd1df1f-e0c5-468f-ba4d-617636a00cc5"],"correct_answer_texts":["Porównywanie po wartości","Niezmienność","Brak tożsamości"]}'::jsonb,
  '2025-11-11T11:53:44.127+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  'a6e3be98-ae32-42de-a698-19702968415f',
  'ef3b0a52-6f3b-4e1a-8592-3302b24a9e1a',
  'Posiada unikalny identyfikator',
  false,
  '2025-11-11T11:53:44.127+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  'e66e7716-af8b-46ec-83a6-007c8afe3267',
  'ef3b0a52-6f3b-4e1a-8592-3302b24a9e1a',
  'Porównywanie po wartości',
  true,
  '2025-11-11T11:53:44.127+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '9cd1df1f-e0c5-468f-ba4d-617636a00cc5',
  'ef3b0a52-6f3b-4e1a-8592-3302b24a9e1a',
  'Niezmienność',
  true,
  '2025-11-11T11:53:44.127+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '87c02599-9100-4770-aa25-92e498a03a28',
  'ef3b0a52-6f3b-4e1a-8592-3302b24a9e1a',
  'Możliwość modyfikacji po utworzeniu',
  false,
  '2025-11-11T11:53:44.127+00:00'
);

-- Insert question: multiple_choice (Order: 4)
INSERT INTO public.questions (id, quiz_id, type, content, question_order, correct_answers_data, created_at) VALUES (
  'b4a7743e-f9fa-473f-873b-7a0cbcb6e3f2',
  '7800f172-0c7b-4da0-ba17-6ff8ace7f0f7',
  'multiple_choice'::question_type,
  'Które z poniższych przykładów najlepiej ilustrują Value Object?',
  4,
  '{"type":"multiple_choice","correct_answer_ids":["fd6fd383-c88a-4951-81af-c889b604dcc9","dffb0071-424c-421d-925f-71c521f276b9"],"correct_answer_texts":["Adres (ulica, miasto, kod pocztowy)","Kwota pieniędzy (wartość, waluta)"]}'::jsonb,
  '2025-11-11T11:53:44.127+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  'f1460052-f6ef-4a1e-8474-3b309b58e67c',
  'b4a7743e-f9fa-473f-873b-7a0cbcb6e3f2',
  'Użytkownik z ID',
  false,
  '2025-11-11T11:53:44.127+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  'fd6fd383-c88a-4951-81af-c889b604dcc9',
  'b4a7743e-f9fa-473f-873b-7a0cbcb6e3f2',
  'Adres (ulica, miasto, kod pocztowy)',
  true,
  '2025-11-11T11:53:44.127+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  'bbd3c4a8-5bd1-48bc-b962-6a6373fb6b09',
  'b4a7743e-f9fa-473f-873b-7a0cbcb6e3f2',
  'Konto bankowe z numerem',
  false,
  '2025-11-11T11:53:44.127+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  'dffb0071-424c-421d-925f-71c521f276b9',
  'b4a7743e-f9fa-473f-873b-7a0cbcb6e3f2',
  'Kwota pieniędzy (wartość, waluta)',
  true,
  '2025-11-11T11:53:44.127+00:00'
);

-- Insert question: multiple_choice (Order: 5)
INSERT INTO public.questions (id, quiz_id, type, content, question_order, correct_answers_data, created_at) VALUES (
  '80165cf3-5c9d-44d5-9d7a-28c05b27eef6',
  '7800f172-0c7b-4da0-ba17-6ff8ace7f0f7',
  'multiple_choice'::question_type,
  'Co należy zrobić, aby ''zmodyfikować'' Value Object?',
  5,
  '{"type":"multiple_choice","correct_answer_ids":["1866f68e-343d-46e6-bd32-ae84b88c00ce"],"correct_answer_texts":["Utworzyć nową instancję z pożądanymi zmianami"]}'::jsonb,
  '2025-11-11T11:53:44.127+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  'c40af69d-b4fc-42c4-ac0a-35e1231c6f12',
  '80165cf3-5c9d-44d5-9d7a-28c05b27eef6',
  'Bezpośrednio zmienić jego atrybuty',
  false,
  '2025-11-11T11:53:44.127+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '1866f68e-343d-46e6-bd32-ae84b88c00ce',
  '80165cf3-5c9d-44d5-9d7a-28c05b27eef6',
  'Utworzyć nową instancję z pożądanymi zmianami',
  true,
  '2025-11-11T11:53:44.127+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '5262b889-d56a-453d-891d-4788378afd39',
  '80165cf3-5c9d-44d5-9d7a-28c05b27eef6',
  'Wywołać metodę ''update''',
  false,
  '2025-11-11T11:53:44.127+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  'a0405915-4c91-425d-967e-111c784a88e3',
  '80165cf3-5c9d-44d5-9d7a-28c05b27eef6',
  'Zastąpić istniejącą instancję nową',
  false,
  '2025-11-11T11:53:44.127+00:00'
);

-- Insert question: multiple_choice (Order: 6)
INSERT INTO public.questions (id, quiz_id, type, content, question_order, correct_answers_data, created_at) VALUES (
  'eba66901-5aea-4d41-890f-07ba67e29793',
  '7800f172-0c7b-4da0-ba17-6ff8ace7f0f7',
  'multiple_choice'::question_type,
  'Które z poniższych jest przykładem ''Primitive Obsession'', które można zastąpić Value Object?',
  6,
  '{"type":"multiple_choice","correct_answer_ids":["cb1df70b-e8c3-4881-a2a7-d5e3e9c9c50e","e5c4334f-6d04-4ac7-88ce-9e096f55afc7"],"correct_answer_texts":["Przekazywanie ciągu znaków reprezentującego email","Przekazywanie liczby i osobnego ciągu znaków dla waluty"]}'::jsonb,
  '2025-11-11T11:53:44.127+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  'af2ca012-bbd4-469c-bf49-ebf27df80200',
  'eba66901-5aea-4d41-890f-07ba67e29793',
  'Przekazywanie obiektu typu ''Adres''',
  false,
  '2025-11-11T11:53:44.127+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  'cb1df70b-e8c3-4881-a2a7-d5e3e9c9c50e',
  'eba66901-5aea-4d41-890f-07ba67e29793',
  'Przekazywanie ciągu znaków reprezentującego email',
  true,
  '2025-11-11T11:53:44.127+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '7c8262c0-247e-4759-9063-c51d54155de7',
  'eba66901-5aea-4d41-890f-07ba67e29793',
  'Przekazywanie liczby dla wieku',
  false,
  '2025-11-11T11:53:44.127+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  'e5c4334f-6d04-4ac7-88ce-9e096f55afc7',
  'eba66901-5aea-4d41-890f-07ba67e29793',
  'Przekazywanie liczby i osobnego ciągu znaków dla waluty',
  true,
  '2025-11-11T11:53:44.127+00:00'
);

-- Insert question: short_answer (Order: 7)
INSERT INTO public.questions (id, quiz_id, type, content, question_order, correct_answers_data, created_at) VALUES (
  '5af6c67f-3def-4770-b29b-cd4a0509ff90',
  '7800f172-0c7b-4da0-ba17-6ff8ace7f0f7',
  'short_answer'::question_type,
  'Jak definiuje się równość dwóch Value Objects?',
  7,
  '{"type":"short_answer","case_sensitive":false,"correct_answers":["Na podstawie wszystkich atrybutów"]}'::jsonb,
  '2025-11-11T11:53:44.127+00:00'
);

-- Insert question: short_answer (Order: 8)
INSERT INTO public.questions (id, quiz_id, type, content, question_order, correct_answers_data, created_at) VALUES (
  '3dce9ccc-08d7-4be5-b125-11e8f1858f9f',
  '7800f172-0c7b-4da0-ba17-6ff8ace7f0f7',
  'short_answer'::question_type,
  'W jaki sposób Value Object zapewnia integralność danych?',
  8,
  '{"type":"short_answer","case_sensitive":false,"correct_answers":["Walidacja przy tworzeniu"]}'::jsonb,
  '2025-11-11T11:53:44.127+00:00'
);


-- Insert quiz for note: "DDD - Value Object"
INSERT INTO public.quizzes (id, note_id, status, ai_prompt, ai_raw_response, ai_model_version, created_at) VALUES (
  'd25c17f8-08f2-474d-b924-01b4090caf42',
  '92d9030a-8152-482b-8ca4-f84ad1e10e2c',
  'accepted'::quiz_status,
  'Generated quiz for note: "DDD - Value Object"',
  '{"title":"Quiz: Value Objects w DDD","questions":[{"type":"true_false","question_text":"Value Object jest definiowany poprzez swoją tożsamość, a nie stan.","correct_answer":"Fałsz"},{"type":"true_false","question_text":"Metody Value Object powinny być wolne od efektów ubocznych, co oznacza, że nie powinny modyfikować stanu obiektu.","correct_answer":"Prawda"},{"type":"multiple_choice","options":["Niezmienność (Immutability)","Posiadanie unikalnego identyfikatora","Porównywanie po wartości (Structural Equality)","Możliwość modyfikacji po utworzeniu"],"question_text":"Które z poniższych cech charakteryzują Value Object?","correct_answer":["Niezmienność (Immutability)","Porównywanie po wartości (Structural Equality)","Brak tożsamości (No Identity)"]},{"type":"multiple_choice","options":["Użytkownik z unikalnym ID","Adres (ulica, miasto, kod pocztowy)","Pieniądze (kwota, waluta)","Zakres dat (data początkowa, końcowa)"],"question_text":"Które z poniższych są dobrymi przykładami zastosowania Value Object?","correct_answer":["Adres (ulica, miasto, kod pocztowy)","Pieniądze (kwota, waluta)","Zakres dat (data początkowa, końcowa)"]},{"type":"multiple_choice","options":["Używanie prymitywnych typów tylko wtedy, gdy jest to absolutnie konieczne.","Nadmierne używanie prymitywnych typów danych (np. string, int) zamiast dedykowanych Value Objects.","Zastępowanie prymitywnych typów przez Value Objects w celu lepszego odzwierciedlenia domeny.","Preferowanie złożonych struktur danych nad prostymi typami."],"question_text":"Co oznacza termin ''Primitive Obsession'' w kontekście DDD i Value Objects?","correct_answer":["Nadmierne używanie prymitywnych typów danych (np. string, int) zamiast dedykowanych Value Objects.","Zastępowanie prymitywnych typów przez Value Objects w celu lepszego odzwierciedlenia domeny."]},{"type":"multiple_choice","options":["Klasa Money z polem amount i currency.","Klasa Email z walidacją formatu.","Klasa Age z walidacją wieku.","Klasa PageNumber reprezentująca numer strony."],"question_text":"Który z poniższych przykładów kodu ilustruje błąd polegający na nadużywaniu Value Object?","correct_answer":["Klasa PageNumber reprezentująca numer strony."]},{"type":"short_answer","question_text":"Podaj jedną cechę Value Object, która odróżnia go od encji.","correct_answer":"Brak tożsamości"},{"type":"short_answer","question_text":"Co należy zrobić, aby ''zmodyfikować'' Value Object?","correct_answer":"Utworzyć nową instancję"}]}'::jsonb,
  'google/gemini-2.5-flash-lite',
  '2025-11-11T11:54:16.893+00:00'
);

-- Insert question: true_false (Order: 1)
INSERT INTO public.questions (id, quiz_id, type, content, question_order, correct_answers_data, created_at) VALUES (
  'dc3cfde0-da89-470f-9bd3-eda2d5852c50',
  'd25c17f8-08f2-474d-b924-01b4090caf42',
  'true_false'::question_type,
  'Value Object jest definiowany poprzez swoją tożsamość, a nie stan.',
  1,
  '{"type":"true_false","correct_answer":false}'::jsonb,
  '2025-11-11T11:54:16.893+00:00'
);

-- Insert question: true_false (Order: 2)
INSERT INTO public.questions (id, quiz_id, type, content, question_order, correct_answers_data, created_at) VALUES (
  '8d95cf55-68be-4952-9dba-e78be6b24e4d',
  'd25c17f8-08f2-474d-b924-01b4090caf42',
  'true_false'::question_type,
  'Metody Value Object powinny być wolne od efektów ubocznych, co oznacza, że nie powinny modyfikować stanu obiektu.',
  2,
  '{"type":"true_false","correct_answer":true}'::jsonb,
  '2025-11-11T11:54:16.893+00:00'
);

-- Insert question: multiple_choice (Order: 3)
INSERT INTO public.questions (id, quiz_id, type, content, question_order, correct_answers_data, created_at) VALUES (
  '8b01b4cb-9ccf-4ba2-9e69-814e2ca8d8e5',
  'd25c17f8-08f2-474d-b924-01b4090caf42',
  'multiple_choice'::question_type,
  'Które z poniższych cech charakteryzują Value Object?',
  3,
  '{"type":"multiple_choice","correct_answer_ids":["f28d9747-406c-4c0f-b644-869cbb58305d","5c0b4f2c-9540-4116-b1bd-f0a875ae192e"],"correct_answer_texts":["Niezmienność (Immutability)","Porównywanie po wartości (Structural Equality)","Brak tożsamości (No Identity)"]}'::jsonb,
  '2025-11-11T11:54:16.893+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  'f28d9747-406c-4c0f-b644-869cbb58305d',
  '8b01b4cb-9ccf-4ba2-9e69-814e2ca8d8e5',
  'Niezmienność (Immutability)',
  true,
  '2025-11-11T11:54:16.893+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '1ca8bb40-1ff4-4eb9-b798-35f1f7efe994',
  '8b01b4cb-9ccf-4ba2-9e69-814e2ca8d8e5',
  'Posiadanie unikalnego identyfikatora',
  false,
  '2025-11-11T11:54:16.893+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '5c0b4f2c-9540-4116-b1bd-f0a875ae192e',
  '8b01b4cb-9ccf-4ba2-9e69-814e2ca8d8e5',
  'Porównywanie po wartości (Structural Equality)',
  true,
  '2025-11-11T11:54:16.893+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  'adf29367-3001-49a2-89d8-224236c4a4e5',
  '8b01b4cb-9ccf-4ba2-9e69-814e2ca8d8e5',
  'Możliwość modyfikacji po utworzeniu',
  false,
  '2025-11-11T11:54:16.893+00:00'
);

-- Insert question: multiple_choice (Order: 4)
INSERT INTO public.questions (id, quiz_id, type, content, question_order, correct_answers_data, created_at) VALUES (
  'bab719d8-e214-4e10-92bc-bf4cab091163',
  'd25c17f8-08f2-474d-b924-01b4090caf42',
  'multiple_choice'::question_type,
  'Które z poniższych są dobrymi przykładami zastosowania Value Object?',
  4,
  '{"type":"multiple_choice","correct_answer_ids":["a8011675-e6bf-41f0-bc85-54eeafc43797","4d12a2bb-18f1-4662-a6b6-d5a6b6ab3641","351a965f-e38f-4d61-be1b-8530854522f6"],"correct_answer_texts":["Adres (ulica, miasto, kod pocztowy)","Pieniądze (kwota, waluta)","Zakres dat (data początkowa, końcowa)"]}'::jsonb,
  '2025-11-11T11:54:16.893+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  'd7f48aff-7eb5-4401-97a1-7547ecf09fda',
  'bab719d8-e214-4e10-92bc-bf4cab091163',
  'Użytkownik z unikalnym ID',
  false,
  '2025-11-11T11:54:16.893+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  'a8011675-e6bf-41f0-bc85-54eeafc43797',
  'bab719d8-e214-4e10-92bc-bf4cab091163',
  'Adres (ulica, miasto, kod pocztowy)',
  true,
  '2025-11-11T11:54:16.893+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '4d12a2bb-18f1-4662-a6b6-d5a6b6ab3641',
  'bab719d8-e214-4e10-92bc-bf4cab091163',
  'Pieniądze (kwota, waluta)',
  true,
  '2025-11-11T11:54:16.893+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '351a965f-e38f-4d61-be1b-8530854522f6',
  'bab719d8-e214-4e10-92bc-bf4cab091163',
  'Zakres dat (data początkowa, końcowa)',
  true,
  '2025-11-11T11:54:16.893+00:00'
);

-- Insert question: multiple_choice (Order: 5)
INSERT INTO public.questions (id, quiz_id, type, content, question_order, correct_answers_data, created_at) VALUES (
  'b1ff3bfc-bfb1-4a8f-8118-12a024bf4893',
  'd25c17f8-08f2-474d-b924-01b4090caf42',
  'multiple_choice'::question_type,
  'Co oznacza termin ''Primitive Obsession'' w kontekście DDD i Value Objects?',
  5,
  '{"type":"multiple_choice","correct_answer_ids":["8408be48-e8d1-4f55-a5b2-c71ab10723dc","29aa0317-85f0-4e86-9f36-769d58a8bc7c"],"correct_answer_texts":["Nadmierne używanie prymitywnych typów danych (np. string, int) zamiast dedykowanych Value Objects.","Zastępowanie prymitywnych typów przez Value Objects w celu lepszego odzwierciedlenia domeny."]}'::jsonb,
  '2025-11-11T11:54:16.893+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  'cafcee57-c36f-421b-b2ee-b6608bbc04f3',
  'b1ff3bfc-bfb1-4a8f-8118-12a024bf4893',
  'Używanie prymitywnych typów tylko wtedy, gdy jest to absolutnie konieczne.',
  false,
  '2025-11-11T11:54:16.893+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '8408be48-e8d1-4f55-a5b2-c71ab10723dc',
  'b1ff3bfc-bfb1-4a8f-8118-12a024bf4893',
  'Nadmierne używanie prymitywnych typów danych (np. string, int) zamiast dedykowanych Value Objects.',
  true,
  '2025-11-11T11:54:16.893+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '29aa0317-85f0-4e86-9f36-769d58a8bc7c',
  'b1ff3bfc-bfb1-4a8f-8118-12a024bf4893',
  'Zastępowanie prymitywnych typów przez Value Objects w celu lepszego odzwierciedlenia domeny.',
  true,
  '2025-11-11T11:54:16.893+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '224b7b99-3ca5-4ada-9fb3-e6c7c0161078',
  'b1ff3bfc-bfb1-4a8f-8118-12a024bf4893',
  'Preferowanie złożonych struktur danych nad prostymi typami.',
  false,
  '2025-11-11T11:54:16.893+00:00'
);

-- Insert question: multiple_choice (Order: 6)
INSERT INTO public.questions (id, quiz_id, type, content, question_order, correct_answers_data, created_at) VALUES (
  '4f1e0c05-b1d4-4ceb-ae87-a5157b288839',
  'd25c17f8-08f2-474d-b924-01b4090caf42',
  'multiple_choice'::question_type,
  'Który z poniższych przykładów kodu ilustruje błąd polegający na nadużywaniu Value Object?',
  6,
  '{"type":"multiple_choice","correct_answer_ids":["cbc86a17-0132-4368-9d18-b77d2f742166"],"correct_answer_texts":["Klasa PageNumber reprezentująca numer strony."]}'::jsonb,
  '2025-11-11T11:54:16.893+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '8874fc12-1751-487b-8f49-c3c8f000295c',
  '4f1e0c05-b1d4-4ceb-ae87-a5157b288839',
  'Klasa Money z polem amount i currency.',
  false,
  '2025-11-11T11:54:16.893+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  'c3c48c6e-149e-4bdb-8a3d-1b8d82e4a922',
  '4f1e0c05-b1d4-4ceb-ae87-a5157b288839',
  'Klasa Email z walidacją formatu.',
  false,
  '2025-11-11T11:54:16.893+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  'db0a00fb-012a-4baa-845b-f70e1acf8a73',
  '4f1e0c05-b1d4-4ceb-ae87-a5157b288839',
  'Klasa Age z walidacją wieku.',
  false,
  '2025-11-11T11:54:16.893+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  'cbc86a17-0132-4368-9d18-b77d2f742166',
  '4f1e0c05-b1d4-4ceb-ae87-a5157b288839',
  'Klasa PageNumber reprezentująca numer strony.',
  true,
  '2025-11-11T11:54:16.893+00:00'
);

-- Insert question: short_answer (Order: 7)
INSERT INTO public.questions (id, quiz_id, type, content, question_order, correct_answers_data, created_at) VALUES (
  '880f6a41-667f-41e2-8e8d-97fbec7342c6',
  'd25c17f8-08f2-474d-b924-01b4090caf42',
  'short_answer'::question_type,
  'Podaj jedną cechę Value Object, która odróżnia go od encji.',
  7,
  '{"type":"short_answer","case_sensitive":false,"correct_answers":["Brak tożsamości"]}'::jsonb,
  '2025-11-11T11:54:16.893+00:00'
);

-- Insert question: short_answer (Order: 8)
INSERT INTO public.questions (id, quiz_id, type, content, question_order, correct_answers_data, created_at) VALUES (
  'aa153e94-6bf1-444f-81b3-7fdca94b30f5',
  'd25c17f8-08f2-474d-b924-01b4090caf42',
  'short_answer'::question_type,
  'Co należy zrobić, aby ''zmodyfikować'' Value Object?',
  8,
  '{"type":"short_answer","case_sensitive":false,"correct_answers":["Utworzyć nową instancję"]}'::jsonb,
  '2025-11-11T11:54:16.893+00:00'
);


-- Insert quiz for note: "React"
INSERT INTO public.quizzes (id, note_id, status, ai_prompt, ai_raw_response, ai_model_version, created_at) VALUES (
  '43f2cf69-63e9-47f5-853e-e8c21e94840d',
  '19e895ff-f4c1-4ced-b5f5-222057169a56',
  'accepted'::quiz_status,
  'Generated quiz for note: "React"',
  '{"title":"React Fundamentals Quiz","questions":[{"type":"true_false","options":["Prawda","Fałsz"],"question_text":"Komponenty w React muszą zaczynać się od małej litery, aby odróżnić je od zwykłych tagów HTML.","correct_answer":"Fałsz"},{"type":"true_false","options":["Prawda","Fałsz"],"question_text":"W JSX do osadzania logiki JavaScript wewnątrz znacznika używa się nawiasów klamrowych {}.","correct_answer":"Prawda"},{"type":"multiple_choice","options":["Tworzenie i zagnieżdżanie komponentów","Dodawanie znaczników i stylów","Zarządzanie stanem serwera","Wyświetlanie danych","Udostepnianie danych między komponentami"],"question_text":"Które z poniższych są kluczowymi celami nauki z przewodnika React Quick Start?","correct_answer":["Dodawanie znaczników i stylów","Wyświetlanie danych","Udostepnianie danych między komponentami"]},{"type":"multiple_choice","options":["Jest bardziej elastyczny niż HTML i nie wymaga zamykania wszystkich tagów.","Komponenty mogą zwracać wiele elementów głównych bez użycia fragmentów.","Musi zamykać wszystkie tagi.","Komponenty mogą zwracać tylko jeden element główny."],"question_text":"Które z poniższych stwierdzeń dotyczących JSX są prawdziwe?","correct_answer":["Musi zamykać wszystkie tagi.","Komponenty mogą zwracać tylko jeden element główny."]},{"type":"multiple_choice","options":["class","className","cssClass","styleClass"],"question_text":"Jakiego atrybutu należy użyć w JSX do zdefiniowania klasy CSS?","correct_answer":["className"]},{"type":"multiple_choice","options":["Pętle for","Instrukcje if/else","Operator trójargumentowy","Operator logiczny AND (&&)"],"question_text":"Które metody są wymienione jako sposoby implementacji renderowania warunkowego w React?","correct_answer":["Instrukcje if/else","Operator trójargumentowy","Operator logiczny AND (&&)"]},{"type":"short_answer","question_text":"Jaki hook jest używany do zarządzania stanem w komponentach funkcyjnych React?","correct_answer":"useState"},{"type":"short_answer","question_text":"Jaki wzorzec jest zalecany do udostępniania danych między komponentami, polegający na przeniesieniu stanu do wspólnego komponentu nadrzędnego?","correct_answer":"Lifting State Up"}]}'::jsonb,
  'google/gemini-2.5-flash-lite',
  '2025-11-11T11:55:04.714+00:00'
);

-- Insert question: true_false (Order: 1)
INSERT INTO public.questions (id, quiz_id, type, content, question_order, correct_answers_data, created_at) VALUES (
  '8d44080c-42a2-4168-9f5b-7534795f4c62',
  '43f2cf69-63e9-47f5-853e-e8c21e94840d',
  'true_false'::question_type,
  'Komponenty w React muszą zaczynać się od małej litery, aby odróżnić je od zwykłych tagów HTML.',
  1,
  '{"type":"true_false","correct_answer":false}'::jsonb,
  '2025-11-11T11:55:04.714+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '5618e431-420e-4ced-94cf-1fac22ae3994',
  '8d44080c-42a2-4168-9f5b-7534795f4c62',
  'Prawda',
  false,
  '2025-11-11T11:55:04.714+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '518449d2-1b26-441f-abbe-75a0bed2d261',
  '8d44080c-42a2-4168-9f5b-7534795f4c62',
  'Fałsz',
  true,
  '2025-11-11T11:55:04.714+00:00'
);

-- Insert question: true_false (Order: 2)
INSERT INTO public.questions (id, quiz_id, type, content, question_order, correct_answers_data, created_at) VALUES (
  '629c095d-58c3-472f-84ce-b64259c7799c',
  '43f2cf69-63e9-47f5-853e-e8c21e94840d',
  'true_false'::question_type,
  'W JSX do osadzania logiki JavaScript wewnątrz znacznika używa się nawiasów klamrowych {}.',
  2,
  '{"type":"true_false","correct_answer":true}'::jsonb,
  '2025-11-11T11:55:04.714+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  'cd7d23d3-2e1f-4425-9c8e-89a0b6a2e556',
  '629c095d-58c3-472f-84ce-b64259c7799c',
  'Prawda',
  true,
  '2025-11-11T11:55:04.714+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  'e69b9ac5-33d6-4bcc-bf3a-fecc3a3de64e',
  '629c095d-58c3-472f-84ce-b64259c7799c',
  'Fałsz',
  false,
  '2025-11-11T11:55:04.714+00:00'
);

-- Insert question: multiple_choice (Order: 3)
INSERT INTO public.questions (id, quiz_id, type, content, question_order, correct_answers_data, created_at) VALUES (
  '74d454bd-b975-490d-8eeb-dc5b09639824',
  '43f2cf69-63e9-47f5-853e-e8c21e94840d',
  'multiple_choice'::question_type,
  'Które z poniższych są kluczowymi celami nauki z przewodnika React Quick Start?',
  3,
  '{"type":"multiple_choice","correct_answer_ids":["2774d6d6-3ecb-4336-88c4-2b5cf573300a","d1abcd1b-9e78-4737-8d93-9578c6c78575","cce4a3a5-ca8b-48ef-a09d-86ba4179381e"],"correct_answer_texts":["Dodawanie znaczników i stylów","Wyświetlanie danych","Udostepnianie danych między komponentami"]}'::jsonb,
  '2025-11-11T11:55:04.714+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  'ddd5d070-f006-446c-8882-6c5e87114274',
  '74d454bd-b975-490d-8eeb-dc5b09639824',
  'Tworzenie i zagnieżdżanie komponentów',
  false,
  '2025-11-11T11:55:04.714+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '2774d6d6-3ecb-4336-88c4-2b5cf573300a',
  '74d454bd-b975-490d-8eeb-dc5b09639824',
  'Dodawanie znaczników i stylów',
  true,
  '2025-11-11T11:55:04.714+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '570e3b31-9908-4dc1-9bdb-8d714896af9b',
  '74d454bd-b975-490d-8eeb-dc5b09639824',
  'Zarządzanie stanem serwera',
  false,
  '2025-11-11T11:55:04.714+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  'd1abcd1b-9e78-4737-8d93-9578c6c78575',
  '74d454bd-b975-490d-8eeb-dc5b09639824',
  'Wyświetlanie danych',
  true,
  '2025-11-11T11:55:04.714+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  'cce4a3a5-ca8b-48ef-a09d-86ba4179381e',
  '74d454bd-b975-490d-8eeb-dc5b09639824',
  'Udostepnianie danych między komponentami',
  true,
  '2025-11-11T11:55:04.714+00:00'
);

-- Insert question: multiple_choice (Order: 4)
INSERT INTO public.questions (id, quiz_id, type, content, question_order, correct_answers_data, created_at) VALUES (
  'de93a46c-ad2f-4fc2-81d7-061b97d18f67',
  '43f2cf69-63e9-47f5-853e-e8c21e94840d',
  'multiple_choice'::question_type,
  'Które z poniższych stwierdzeń dotyczących JSX są prawdziwe?',
  4,
  '{"type":"multiple_choice","correct_answer_ids":["0f43aa59-2e0a-4931-be14-1509610bc792","45de222c-650c-4a80-94f2-5d2c3c3307f5"],"correct_answer_texts":["Musi zamykać wszystkie tagi.","Komponenty mogą zwracać tylko jeden element główny."]}'::jsonb,
  '2025-11-11T11:55:04.714+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  'e5bfae8c-7ee4-41ae-9cdc-f42555cef823',
  'de93a46c-ad2f-4fc2-81d7-061b97d18f67',
  'Jest bardziej elastyczny niż HTML i nie wymaga zamykania wszystkich tagów.',
  false,
  '2025-11-11T11:55:04.714+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  'fd8b648e-2c59-4c51-beac-a9f680befc70',
  'de93a46c-ad2f-4fc2-81d7-061b97d18f67',
  'Komponenty mogą zwracać wiele elementów głównych bez użycia fragmentów.',
  false,
  '2025-11-11T11:55:04.714+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '0f43aa59-2e0a-4931-be14-1509610bc792',
  'de93a46c-ad2f-4fc2-81d7-061b97d18f67',
  'Musi zamykać wszystkie tagi.',
  true,
  '2025-11-11T11:55:04.714+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '45de222c-650c-4a80-94f2-5d2c3c3307f5',
  'de93a46c-ad2f-4fc2-81d7-061b97d18f67',
  'Komponenty mogą zwracać tylko jeden element główny.',
  true,
  '2025-11-11T11:55:04.714+00:00'
);

-- Insert question: multiple_choice (Order: 5)
INSERT INTO public.questions (id, quiz_id, type, content, question_order, correct_answers_data, created_at) VALUES (
  '9c5de682-bc96-4e63-9442-979bff5faa0b',
  '43f2cf69-63e9-47f5-853e-e8c21e94840d',
  'multiple_choice'::question_type,
  'Jakiego atrybutu należy użyć w JSX do zdefiniowania klasy CSS?',
  5,
  '{"type":"multiple_choice","correct_answer_ids":["d3ffc195-074f-40aa-82cd-8133d000d18f"],"correct_answer_texts":["className"]}'::jsonb,
  '2025-11-11T11:55:04.714+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '6172f085-ccd5-483e-a5f3-c705ba0d818e',
  '9c5de682-bc96-4e63-9442-979bff5faa0b',
  'class',
  false,
  '2025-11-11T11:55:04.714+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  'd3ffc195-074f-40aa-82cd-8133d000d18f',
  '9c5de682-bc96-4e63-9442-979bff5faa0b',
  'className',
  true,
  '2025-11-11T11:55:04.714+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '8cdf8bfe-0ef5-45ee-a61b-9f40fe9482cd',
  '9c5de682-bc96-4e63-9442-979bff5faa0b',
  'cssClass',
  false,
  '2025-11-11T11:55:04.714+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '7bb4b4ee-7895-4081-af0c-30ea10c7514d',
  '9c5de682-bc96-4e63-9442-979bff5faa0b',
  'styleClass',
  false,
  '2025-11-11T11:55:04.714+00:00'
);

-- Insert question: multiple_choice (Order: 6)
INSERT INTO public.questions (id, quiz_id, type, content, question_order, correct_answers_data, created_at) VALUES (
  'f6806e31-bc84-442a-8f98-fd21991223a9',
  '43f2cf69-63e9-47f5-853e-e8c21e94840d',
  'multiple_choice'::question_type,
  'Które metody są wymienione jako sposoby implementacji renderowania warunkowego w React?',
  6,
  '{"type":"multiple_choice","correct_answer_ids":["c1f87545-c709-4c0f-973f-e55989fc46b5","46b1436a-d188-45dd-899c-6fd1032aca8c","7b311d14-91b5-487a-9a7d-d454156863eb"],"correct_answer_texts":["Instrukcje if/else","Operator trójargumentowy","Operator logiczny AND (&&)"]}'::jsonb,
  '2025-11-11T11:55:04.714+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '302188ca-dc85-481c-9f16-c17fba9d4a1a',
  'f6806e31-bc84-442a-8f98-fd21991223a9',
  'Pętle for',
  false,
  '2025-11-11T11:55:04.714+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  'c1f87545-c709-4c0f-973f-e55989fc46b5',
  'f6806e31-bc84-442a-8f98-fd21991223a9',
  'Instrukcje if/else',
  true,
  '2025-11-11T11:55:04.714+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '46b1436a-d188-45dd-899c-6fd1032aca8c',
  'f6806e31-bc84-442a-8f98-fd21991223a9',
  'Operator trójargumentowy',
  true,
  '2025-11-11T11:55:04.714+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '7b311d14-91b5-487a-9a7d-d454156863eb',
  'f6806e31-bc84-442a-8f98-fd21991223a9',
  'Operator logiczny AND (&&)',
  true,
  '2025-11-11T11:55:04.714+00:00'
);

-- Insert question: short_answer (Order: 7)
INSERT INTO public.questions (id, quiz_id, type, content, question_order, correct_answers_data, created_at) VALUES (
  'f40c48fa-c3e6-41cc-a8c2-e3a1f7aac392',
  '43f2cf69-63e9-47f5-853e-e8c21e94840d',
  'short_answer'::question_type,
  'Jaki hook jest używany do zarządzania stanem w komponentach funkcyjnych React?',
  7,
  '{"type":"short_answer","case_sensitive":false,"correct_answers":["useState"]}'::jsonb,
  '2025-11-11T11:55:04.714+00:00'
);

-- Insert question: short_answer (Order: 8)
INSERT INTO public.questions (id, quiz_id, type, content, question_order, correct_answers_data, created_at) VALUES (
  '978393dc-bed9-4e7f-ac8d-640b32acd917',
  '43f2cf69-63e9-47f5-853e-e8c21e94840d',
  'short_answer'::question_type,
  'Jaki wzorzec jest zalecany do udostępniania danych między komponentami, polegający na przeniesieniu stanu do wspólnego komponentu nadrzędnego?',
  8,
  '{"type":"short_answer","case_sensitive":false,"correct_answers":["Lifting State Up"]}'::jsonb,
  '2025-11-11T11:55:04.714+00:00'
);


-- Insert quiz for note: "GIT overview"
INSERT INTO public.quizzes (id, note_id, status, ai_prompt, ai_raw_response, ai_model_version, created_at) VALUES (
  'f1db1109-160a-4493-acc5-d0b7d9e2c1a8',
  'cb78d7af-ba4c-4e6a-87a7-4f2109adf3a3',
  'accepted'::quiz_status,
  'Generated quiz for note: "GIT overview"',
  '{"title":"Quiz Wiedzy o Git","questions":[{"type":"true_false","options":["Prawda","Fałsz"],"question_text":"Git jest systemem kontroli wersji typu Centralized Version Control System (CVCS).","correct_answer":"Fałsz"},{"type":"true_false","options":["Prawda","Fałsz"],"question_text":"W Git każdy klient w pełni odzwierciedla repozytorium z pełną historią.","correct_answer":"Prawda"},{"type":"multiple_choice","options":["Modified","Staged","Committed","Tracked"],"question_text":"Które z poniższych stanów opisują pliki w Git?","correct_answer":["Modified","Staged","Committed"]},{"type":"multiple_choice","options":["Full Local Access","Centralized Repository","Performance","Data Integrity"],"question_text":"Które z poniższych są kluczowymi zaletami Git?","correct_answer":["Full Local Access","Performance","Data Integrity"]},{"type":"multiple_choice","options":["git commit","git stash","git add","git stash save"],"question_text":"Które polecenie służy do tymczasowego zapisania zmian bez zatwierdzania ich w historii?","correct_answer":["git stash","git stash save"]},{"type":"multiple_choice","options":["git add <file>","git commit <file>","git add .","git stage <file>"],"question_text":"Które z poniższych to poprawne sposoby na dodanie plików do repozytorium Git?","correct_answer":["git add <file>","git add ."]},{"type":"short_answer","question_text":"Jaka jest podstawowa komenda do sprawdzenia statusu plików w repozytorium Git?","correct_answer":"git status"},{"type":"short_answer","question_text":"Jak nazywa się proces tymczasowego zapisywania zmian, który pozwala na szybkie przełączenie się do innej gałęzi?","correct_answer":"Stashing"}]}'::jsonb,
  'google/gemini-2.5-flash-lite',
  '2025-11-11T11:55:34.001+00:00'
);

-- Insert question: true_false (Order: 1)
INSERT INTO public.questions (id, quiz_id, type, content, question_order, correct_answers_data, created_at) VALUES (
  '40e4757f-e2c4-44aa-8115-dccaa3664ced',
  'f1db1109-160a-4493-acc5-d0b7d9e2c1a8',
  'true_false'::question_type,
  'Git jest systemem kontroli wersji typu Centralized Version Control System (CVCS).',
  1,
  '{"type":"true_false","correct_answer":false}'::jsonb,
  '2025-11-11T11:55:34.001+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '8e6eae15-37e8-4143-bd4d-0b0bbbb32b3c',
  '40e4757f-e2c4-44aa-8115-dccaa3664ced',
  'Prawda',
  false,
  '2025-11-11T11:55:34.001+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  'ae4301c8-e22c-4edd-b0be-e83658868a9e',
  '40e4757f-e2c4-44aa-8115-dccaa3664ced',
  'Fałsz',
  true,
  '2025-11-11T11:55:34.001+00:00'
);

-- Insert question: true_false (Order: 2)
INSERT INTO public.questions (id, quiz_id, type, content, question_order, correct_answers_data, created_at) VALUES (
  'd55acfa2-fb1a-44af-bea3-372508e11eb6',
  'f1db1109-160a-4493-acc5-d0b7d9e2c1a8',
  'true_false'::question_type,
  'W Git każdy klient w pełni odzwierciedla repozytorium z pełną historią.',
  2,
  '{"type":"true_false","correct_answer":true}'::jsonb,
  '2025-11-11T11:55:34.001+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '3a0c5a39-abf5-42e9-af51-06efaf605f45',
  'd55acfa2-fb1a-44af-bea3-372508e11eb6',
  'Prawda',
  true,
  '2025-11-11T11:55:34.001+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  'b55b17b1-251e-4034-be41-fcc3c9082258',
  'd55acfa2-fb1a-44af-bea3-372508e11eb6',
  'Fałsz',
  false,
  '2025-11-11T11:55:34.001+00:00'
);

-- Insert question: multiple_choice (Order: 3)
INSERT INTO public.questions (id, quiz_id, type, content, question_order, correct_answers_data, created_at) VALUES (
  '900dbcc9-8c4e-4d56-b8a6-207a0726d639',
  'f1db1109-160a-4493-acc5-d0b7d9e2c1a8',
  'multiple_choice'::question_type,
  'Które z poniższych stanów opisują pliki w Git?',
  3,
  '{"type":"multiple_choice","correct_answer_ids":["506a2732-8b08-483e-8969-4f4aadfb1412","53c9ff85-30bf-41ab-bf97-99e01dfd2411","33320bac-4e86-4c4e-9584-9d02dce2b51e"],"correct_answer_texts":["Modified","Staged","Committed"]}'::jsonb,
  '2025-11-11T11:55:34.001+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '506a2732-8b08-483e-8969-4f4aadfb1412',
  '900dbcc9-8c4e-4d56-b8a6-207a0726d639',
  'Modified',
  true,
  '2025-11-11T11:55:34.001+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '53c9ff85-30bf-41ab-bf97-99e01dfd2411',
  '900dbcc9-8c4e-4d56-b8a6-207a0726d639',
  'Staged',
  true,
  '2025-11-11T11:55:34.001+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '33320bac-4e86-4c4e-9584-9d02dce2b51e',
  '900dbcc9-8c4e-4d56-b8a6-207a0726d639',
  'Committed',
  true,
  '2025-11-11T11:55:34.001+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  'e4164321-fa50-4b0e-9ad8-785413fe4594',
  '900dbcc9-8c4e-4d56-b8a6-207a0726d639',
  'Tracked',
  false,
  '2025-11-11T11:55:34.001+00:00'
);

-- Insert question: multiple_choice (Order: 4)
INSERT INTO public.questions (id, quiz_id, type, content, question_order, correct_answers_data, created_at) VALUES (
  '0e8cc8fd-5f61-4854-a98b-60406776961f',
  'f1db1109-160a-4493-acc5-d0b7d9e2c1a8',
  'multiple_choice'::question_type,
  'Które z poniższych są kluczowymi zaletami Git?',
  4,
  '{"type":"multiple_choice","correct_answer_ids":["7c60b0e5-66d7-4cce-aaa3-e8ff96463286","cf04dab6-5cf3-48a5-a405-830f95a7a43c","283c1f9b-3263-47d7-a351-efce642f6f42"],"correct_answer_texts":["Full Local Access","Performance","Data Integrity"]}'::jsonb,
  '2025-11-11T11:55:34.001+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '7c60b0e5-66d7-4cce-aaa3-e8ff96463286',
  '0e8cc8fd-5f61-4854-a98b-60406776961f',
  'Full Local Access',
  true,
  '2025-11-11T11:55:34.001+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '9349e721-a27d-4432-8794-b29c60be8753',
  '0e8cc8fd-5f61-4854-a98b-60406776961f',
  'Centralized Repository',
  false,
  '2025-11-11T11:55:34.001+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  'cf04dab6-5cf3-48a5-a405-830f95a7a43c',
  '0e8cc8fd-5f61-4854-a98b-60406776961f',
  'Performance',
  true,
  '2025-11-11T11:55:34.001+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '283c1f9b-3263-47d7-a351-efce642f6f42',
  '0e8cc8fd-5f61-4854-a98b-60406776961f',
  'Data Integrity',
  true,
  '2025-11-11T11:55:34.001+00:00'
);

-- Insert question: multiple_choice (Order: 5)
INSERT INTO public.questions (id, quiz_id, type, content, question_order, correct_answers_data, created_at) VALUES (
  '7ed04e93-5e57-48fd-bc6b-ce8f62980e9d',
  'f1db1109-160a-4493-acc5-d0b7d9e2c1a8',
  'multiple_choice'::question_type,
  'Które polecenie służy do tymczasowego zapisania zmian bez zatwierdzania ich w historii?',
  5,
  '{"type":"multiple_choice","correct_answer_ids":["0fff9924-7f41-40c1-a38b-829fe91dc82f","f0a99094-78eb-48b7-9607-fccf4d28d9de"],"correct_answer_texts":["git stash","git stash save"]}'::jsonb,
  '2025-11-11T11:55:34.001+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '06f4c6ff-1e24-483e-8e75-60686f1d7c7e',
  '7ed04e93-5e57-48fd-bc6b-ce8f62980e9d',
  'git commit',
  false,
  '2025-11-11T11:55:34.001+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '0fff9924-7f41-40c1-a38b-829fe91dc82f',
  '7ed04e93-5e57-48fd-bc6b-ce8f62980e9d',
  'git stash',
  true,
  '2025-11-11T11:55:34.001+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  'fcd3dfc6-c9a7-46f1-b494-1d1959f95364',
  '7ed04e93-5e57-48fd-bc6b-ce8f62980e9d',
  'git add',
  false,
  '2025-11-11T11:55:34.001+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  'f0a99094-78eb-48b7-9607-fccf4d28d9de',
  '7ed04e93-5e57-48fd-bc6b-ce8f62980e9d',
  'git stash save',
  true,
  '2025-11-11T11:55:34.001+00:00'
);

-- Insert question: multiple_choice (Order: 6)
INSERT INTO public.questions (id, quiz_id, type, content, question_order, correct_answers_data, created_at) VALUES (
  '1d5b46ec-2e80-4be6-b1b4-23796ce93040',
  'f1db1109-160a-4493-acc5-d0b7d9e2c1a8',
  'multiple_choice'::question_type,
  'Które z poniższych to poprawne sposoby na dodanie plików do repozytorium Git?',
  6,
  '{"type":"multiple_choice","correct_answer_ids":["ba0257b0-776f-4ab3-9ddf-fb6eca631814","66607f95-b864-43fa-b148-577d0c3e23e7"],"correct_answer_texts":["git add <file>","git add ."]}'::jsonb,
  '2025-11-11T11:55:34.001+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  'ba0257b0-776f-4ab3-9ddf-fb6eca631814',
  '1d5b46ec-2e80-4be6-b1b4-23796ce93040',
  'git add <file>',
  true,
  '2025-11-11T11:55:34.001+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '7cdaeacc-0d52-403f-87d4-ad681f0133a2',
  '1d5b46ec-2e80-4be6-b1b4-23796ce93040',
  'git commit <file>',
  false,
  '2025-11-11T11:55:34.001+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '66607f95-b864-43fa-b148-577d0c3e23e7',
  '1d5b46ec-2e80-4be6-b1b4-23796ce93040',
  'git add .',
  true,
  '2025-11-11T11:55:34.001+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  'ba961e40-4ee8-4e6e-9c43-2fcbf72916ba',
  '1d5b46ec-2e80-4be6-b1b4-23796ce93040',
  'git stage <file>',
  false,
  '2025-11-11T11:55:34.001+00:00'
);

-- Insert question: short_answer (Order: 7)
INSERT INTO public.questions (id, quiz_id, type, content, question_order, correct_answers_data, created_at) VALUES (
  'd2c22913-1a44-40eb-a998-da79fcdd8880',
  'f1db1109-160a-4493-acc5-d0b7d9e2c1a8',
  'short_answer'::question_type,
  'Jaka jest podstawowa komenda do sprawdzenia statusu plików w repozytorium Git?',
  7,
  '{"type":"short_answer","case_sensitive":false,"correct_answers":["git status"]}'::jsonb,
  '2025-11-11T11:55:34.001+00:00'
);

-- Insert question: short_answer (Order: 8)
INSERT INTO public.questions (id, quiz_id, type, content, question_order, correct_answers_data, created_at) VALUES (
  '2c36fdb8-8343-469d-89cf-055b44690f47',
  'f1db1109-160a-4493-acc5-d0b7d9e2c1a8',
  'short_answer'::question_type,
  'Jak nazywa się proces tymczasowego zapisywania zmian, który pozwala na szybkie przełączenie się do innej gałęzi?',
  8,
  '{"type":"short_answer","case_sensitive":false,"correct_answers":["Stashing"]}'::jsonb,
  '2025-11-11T11:55:34.001+00:00'
);


-- Insert quiz for note: "DDD - Aggregate"
INSERT INTO public.quizzes (id, note_id, status, ai_prompt, ai_raw_response, ai_model_version, created_at) VALUES (
  '577d2a18-2d70-4a66-a882-516b4018f123',
  '043d5712-526f-4c45-a154-5503d0442a8e',
  'accepted'::quiz_status,
  'Generated quiz for note: "DDD - Aggregate"',
  '{"title":"Quiz: DDD - Agregaty","questions":[{"type":"true_false","options":["Prawda","Fałsz"],"question_text":"Agregat definiuje granicę spójności, która zapewnia przestrzeganie reguł biznesowych.","correct_answer":"Prawda"},{"type":"true_false","options":["Prawda","Fałsz"],"question_text":"Zewnętrzne obiekty mogą bezpośrednio odwoływać się do wewnętrznych encji i obiektów wartości wewnątrz agregatu.","correct_answer":"Fałsz"},{"type":"multiple_choice","options":["Granica spójności","Granica transakcyjna","Agregat root","Bezpośredni dostęp do wszystkich obiektów"],"question_text":"Które z poniższych są kluczowymi cechami agregatów?","correct_answer":["Granica spójności","Granica transakcyjna","Agregat root"]},{"type":"multiple_choice","options":["Wszystkie zmiany w obrębie jednego agregatu powinny być zatwierdzane jako jedna atomowa transakcja.","Jedna transakcja może obejmować wiele agregatów, jeśli są ze sobą powiązane.","Operacje obejmujące wiele agregatów nie powinny być wykonywane w ramach jednej transakcji.","Zmiany w agregacie są zatwierdzane indywidualnie."],"question_text":"Co odnosi się do zasady ''Jedna transakcja na agregat''?","correct_answer":["Wszystkie zmiany w obrębie jednego agregatu powinny być zatwierdzane jako jedna atomowa transakcja.","Operacje obejmujące wiele agregatów nie powinny być wykonywane w ramach jednej transakcji."]},{"type":"multiple_choice","options":["Egzekwowanie niezmienności (inwariantów)","Bezpośrednie modyfikowanie wewnętrznych encji","Kontrolowanie dostępu do wewnętrznych obiektów","Koordynowanie zmian wewnątrz agregatu"],"question_text":"Jakie są główne odpowiedzialności Agregat Root?","correct_answer":["Egzekwowanie niezmienności (inwariantów)","Kontrolowanie dostępu do wewnętrznych obiektów","Koordynowanie zmian wewnątrz agregatu"]},{"type":"multiple_choice","options":["Projektuj małe agregaty","Używaj identyfikatorów do odwoływania się do innych agregatów","Chroń niezmienności","Używaj jednego repozytorium dla wszystkich obiektów domenowych"],"question_text":"Które z poniższych są dobrymi praktykami projektowania agregatów?","correct_answer":["Projektuj małe agregaty","Używaj identyfikatorów do odwoływania się do innych agregatów","Chroń niezmienności"]},{"type":"short_answer","question_text":"Jak nazywa się pojedynczy punkt dostępu do wszystkich operacji w agregacie?","correct_answer":"Agregat root"},{"type":"short_answer","question_text":"Co powinno być zawsze prawdziwe w obrębie agregatu i jest egzekwowane przez jego granice?","correct_answer":"Niezmienności"}]}'::jsonb,
  'google/gemini-2.5-flash-lite',
  '2025-11-11T11:56:41.791+00:00'
);

-- Insert question: true_false (Order: 1)
INSERT INTO public.questions (id, quiz_id, type, content, question_order, correct_answers_data, created_at) VALUES (
  '41047311-d718-41fa-a626-e32bc3f1df09',
  '577d2a18-2d70-4a66-a882-516b4018f123',
  'true_false'::question_type,
  'Agregat definiuje granicę spójności, która zapewnia przestrzeganie reguł biznesowych.',
  1,
  '{"type":"true_false","correct_answer":true}'::jsonb,
  '2025-11-11T11:56:41.791+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '1fb967f8-7855-4ba1-8c15-2ddcb00afb95',
  '41047311-d718-41fa-a626-e32bc3f1df09',
  'Prawda',
  true,
  '2025-11-11T11:56:41.791+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '60a5d1ce-c530-4aea-babb-3ab8e9ba6c3d',
  '41047311-d718-41fa-a626-e32bc3f1df09',
  'Fałsz',
  false,
  '2025-11-11T11:56:41.791+00:00'
);

-- Insert question: true_false (Order: 2)
INSERT INTO public.questions (id, quiz_id, type, content, question_order, correct_answers_data, created_at) VALUES (
  '105c6112-3702-47d8-a62e-883c502dcbf6',
  '577d2a18-2d70-4a66-a882-516b4018f123',
  'true_false'::question_type,
  'Zewnętrzne obiekty mogą bezpośrednio odwoływać się do wewnętrznych encji i obiektów wartości wewnątrz agregatu.',
  2,
  '{"type":"true_false","correct_answer":false}'::jsonb,
  '2025-11-11T11:56:41.791+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  'b33998aa-38e6-4161-bba2-5e2bc1d3845f',
  '105c6112-3702-47d8-a62e-883c502dcbf6',
  'Prawda',
  false,
  '2025-11-11T11:56:41.791+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '19233bc9-9eeb-40f2-9d49-31b9d3a85d54',
  '105c6112-3702-47d8-a62e-883c502dcbf6',
  'Fałsz',
  true,
  '2025-11-11T11:56:41.791+00:00'
);

-- Insert question: multiple_choice (Order: 3)
INSERT INTO public.questions (id, quiz_id, type, content, question_order, correct_answers_data, created_at) VALUES (
  '99004481-e615-4bad-a236-532997da7d77',
  '577d2a18-2d70-4a66-a882-516b4018f123',
  'multiple_choice'::question_type,
  'Które z poniższych są kluczowymi cechami agregatów?',
  3,
  '{"type":"multiple_choice","correct_answer_ids":["7b600969-6aff-4b09-9f5b-6c2312c8f556","926a2510-7966-4d2f-bdbb-2779d71e61a3","281f4bc6-bc00-4e90-8d10-98cab30ff8bd"],"correct_answer_texts":["Granica spójności","Granica transakcyjna","Agregat root"]}'::jsonb,
  '2025-11-11T11:56:41.791+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '7b600969-6aff-4b09-9f5b-6c2312c8f556',
  '99004481-e615-4bad-a236-532997da7d77',
  'Granica spójności',
  true,
  '2025-11-11T11:56:41.791+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '926a2510-7966-4d2f-bdbb-2779d71e61a3',
  '99004481-e615-4bad-a236-532997da7d77',
  'Granica transakcyjna',
  true,
  '2025-11-11T11:56:41.791+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '281f4bc6-bc00-4e90-8d10-98cab30ff8bd',
  '99004481-e615-4bad-a236-532997da7d77',
  'Agregat root',
  true,
  '2025-11-11T11:56:41.791+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  'caa6c39f-fa50-44b7-a9ae-d86988d51ca3',
  '99004481-e615-4bad-a236-532997da7d77',
  'Bezpośredni dostęp do wszystkich obiektów',
  false,
  '2025-11-11T11:56:41.791+00:00'
);

-- Insert question: multiple_choice (Order: 4)
INSERT INTO public.questions (id, quiz_id, type, content, question_order, correct_answers_data, created_at) VALUES (
  '3f1e834f-de7a-4c85-95e2-3d85b261cf24',
  '577d2a18-2d70-4a66-a882-516b4018f123',
  'multiple_choice'::question_type,
  'Co odnosi się do zasady ''Jedna transakcja na agregat''?',
  4,
  '{"type":"multiple_choice","correct_answer_ids":["543af846-ff00-46da-867a-af199f463c8f","f44b66a4-03ef-447c-86cf-fc3d55a12c8f"],"correct_answer_texts":["Wszystkie zmiany w obrębie jednego agregatu powinny być zatwierdzane jako jedna atomowa transakcja.","Operacje obejmujące wiele agregatów nie powinny być wykonywane w ramach jednej transakcji."]}'::jsonb,
  '2025-11-11T11:56:41.791+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '543af846-ff00-46da-867a-af199f463c8f',
  '3f1e834f-de7a-4c85-95e2-3d85b261cf24',
  'Wszystkie zmiany w obrębie jednego agregatu powinny być zatwierdzane jako jedna atomowa transakcja.',
  true,
  '2025-11-11T11:56:41.791+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  'c642d133-bb21-4ba6-9186-4cef4cbfac0f',
  '3f1e834f-de7a-4c85-95e2-3d85b261cf24',
  'Jedna transakcja może obejmować wiele agregatów, jeśli są ze sobą powiązane.',
  false,
  '2025-11-11T11:56:41.791+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  'f44b66a4-03ef-447c-86cf-fc3d55a12c8f',
  '3f1e834f-de7a-4c85-95e2-3d85b261cf24',
  'Operacje obejmujące wiele agregatów nie powinny być wykonywane w ramach jednej transakcji.',
  true,
  '2025-11-11T11:56:41.791+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '8753663e-f4f7-48a0-81e6-9a92e6f0ea81',
  '3f1e834f-de7a-4c85-95e2-3d85b261cf24',
  'Zmiany w agregacie są zatwierdzane indywidualnie.',
  false,
  '2025-11-11T11:56:41.791+00:00'
);

-- Insert question: multiple_choice (Order: 5)
INSERT INTO public.questions (id, quiz_id, type, content, question_order, correct_answers_data, created_at) VALUES (
  '9bec355d-c3eb-4ec7-9fa7-182694b22a36',
  '577d2a18-2d70-4a66-a882-516b4018f123',
  'multiple_choice'::question_type,
  'Jakie są główne odpowiedzialności Agregat Root?',
  5,
  '{"type":"multiple_choice","correct_answer_ids":["088e494f-d3e5-45cc-9951-ea37348750ac","705f3832-76d6-4199-a5c0-8d40a2413cce","55fbca41-5e46-4c1e-afce-35796cae0e6e"],"correct_answer_texts":["Egzekwowanie niezmienności (inwariantów)","Kontrolowanie dostępu do wewnętrznych obiektów","Koordynowanie zmian wewnątrz agregatu"]}'::jsonb,
  '2025-11-11T11:56:41.791+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '088e494f-d3e5-45cc-9951-ea37348750ac',
  '9bec355d-c3eb-4ec7-9fa7-182694b22a36',
  'Egzekwowanie niezmienności (inwariantów)',
  true,
  '2025-11-11T11:56:41.791+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '7d3e6961-dcec-4a5d-a61a-1bc7eca9dd1f',
  '9bec355d-c3eb-4ec7-9fa7-182694b22a36',
  'Bezpośrednie modyfikowanie wewnętrznych encji',
  false,
  '2025-11-11T11:56:41.791+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '705f3832-76d6-4199-a5c0-8d40a2413cce',
  '9bec355d-c3eb-4ec7-9fa7-182694b22a36',
  'Kontrolowanie dostępu do wewnętrznych obiektów',
  true,
  '2025-11-11T11:56:41.791+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '55fbca41-5e46-4c1e-afce-35796cae0e6e',
  '9bec355d-c3eb-4ec7-9fa7-182694b22a36',
  'Koordynowanie zmian wewnątrz agregatu',
  true,
  '2025-11-11T11:56:41.791+00:00'
);

-- Insert question: multiple_choice (Order: 6)
INSERT INTO public.questions (id, quiz_id, type, content, question_order, correct_answers_data, created_at) VALUES (
  '2b30d3de-7c0e-4e5f-843b-797e499e4e85',
  '577d2a18-2d70-4a66-a882-516b4018f123',
  'multiple_choice'::question_type,
  'Które z poniższych są dobrymi praktykami projektowania agregatów?',
  6,
  '{"type":"multiple_choice","correct_answer_ids":["2a36c660-9cad-4727-a5d6-2ed5d713d120","f1df33ab-5e6c-47bf-95d9-2f69245b0927","69afbb6d-0efd-460a-ac4f-1d57ce567e3e"],"correct_answer_texts":["Projektuj małe agregaty","Używaj identyfikatorów do odwoływania się do innych agregatów","Chroń niezmienności"]}'::jsonb,
  '2025-11-11T11:56:41.791+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '2a36c660-9cad-4727-a5d6-2ed5d713d120',
  '2b30d3de-7c0e-4e5f-843b-797e499e4e85',
  'Projektuj małe agregaty',
  true,
  '2025-11-11T11:56:41.791+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  'f1df33ab-5e6c-47bf-95d9-2f69245b0927',
  '2b30d3de-7c0e-4e5f-843b-797e499e4e85',
  'Używaj identyfikatorów do odwoływania się do innych agregatów',
  true,
  '2025-11-11T11:56:41.791+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '69afbb6d-0efd-460a-ac4f-1d57ce567e3e',
  '2b30d3de-7c0e-4e5f-843b-797e499e4e85',
  'Chroń niezmienności',
  true,
  '2025-11-11T11:56:41.791+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '529984e5-2f11-469b-b651-7760da281796',
  '2b30d3de-7c0e-4e5f-843b-797e499e4e85',
  'Używaj jednego repozytorium dla wszystkich obiektów domenowych',
  false,
  '2025-11-11T11:56:41.791+00:00'
);

-- Insert question: short_answer (Order: 7)
INSERT INTO public.questions (id, quiz_id, type, content, question_order, correct_answers_data, created_at) VALUES (
  'cf492574-2175-41a4-9046-94e6236b1c56',
  '577d2a18-2d70-4a66-a882-516b4018f123',
  'short_answer'::question_type,
  'Jak nazywa się pojedynczy punkt dostępu do wszystkich operacji w agregacie?',
  7,
  '{"type":"short_answer","case_sensitive":false,"correct_answers":["Agregat root"]}'::jsonb,
  '2025-11-11T11:56:41.791+00:00'
);

-- Insert question: short_answer (Order: 8)
INSERT INTO public.questions (id, quiz_id, type, content, question_order, correct_answers_data, created_at) VALUES (
  '59f4d589-0a77-468d-96bc-e54c1bc85cc0',
  '577d2a18-2d70-4a66-a882-516b4018f123',
  'short_answer'::question_type,
  'Co powinno być zawsze prawdziwe w obrębie agregatu i jest egzekwowane przez jego granice?',
  8,
  '{"type":"short_answer","case_sensitive":false,"correct_answers":["Niezmienności"]}'::jsonb,
  '2025-11-11T11:56:41.791+00:00'
);


-- Insert quiz for note: "Supabase"
INSERT INTO public.quizzes (id, note_id, status, ai_prompt, ai_raw_response, ai_model_version, created_at) VALUES (
  '03a9530b-6597-4fec-97b6-d9b6b33461f4',
  '0f24e9f0-0e80-4333-8c1b-d6f5c4e4c51d',
  'accepted'::quiz_status,
  'Generated quiz for note: "Supabase"',
  '{"title":"Quiz o Supabase","questions":[{"type":"true_false","options":["Prawda","Fałsz"],"question_text":"Supabase jest oparty na bazie danych NoSQL.","correct_answer":"Fałsz"},{"type":"true_false","options":["Prawda","Fałsz"],"question_text":"Row Level Security (RLS) jest opcjonalną funkcją i nie jest krytyczna dla bezpieczeństwa danych w Supabase.","correct_answer":"Fałsz"},{"type":"multiple_choice","options":["Database","Authentication","Storage","Realtime","Web Hosting"],"question_text":"Które z poniższych są głównymi produktami oferowanymi przez Supabase?","correct_answer":["Authentication","Storage","Realtime"]},{"type":"multiple_choice","options":["Open Source & Portable","Vendor Lock-in","Developer Experience","Cost-Effective","Limited Customization"],"question_text":"Które z poniższych są zaletami Supabase?","correct_answer":["Open Source & Portable","Developer Experience","Cost-Effective"]},{"type":"multiple_choice","options":["Email/password authentication","LDAP","OAuth providers","Phone/SMS authentication"],"question_text":"Które metody uwierzytelniania są obsługiwane przez Supabase?","correct_answer":["Email/password authentication","OAuth providers","Phone/SMS authentication"]},{"type":"multiple_choice","options":["Wszystkie bucket''y są publiczne z definicji.","Możliwość tworzenia prywatnych i publicznych bucketów.","Obsługa tylko S3 API.","Możliwość transformacji obrazów on-the-fly."],"question_text":"Które z poniższych stwierdzeń dotyczących Storage w Supabase są prawdziwe?","correct_answer":["Możliwość tworzenia prywatnych i publicznych bucketów.","Obsługa S3-compatible API.","Możliwość transformacji obrazów on-the-fly."]},{"type":"short_answer","question_text":"Jaka jest kluczowa zasada bezpieczeństwa, którą należy zawsze włączyć dla wszystkich tabel w Supabase?","correct_answer":"Row Level Security"},{"type":"short_answer","question_text":"Jaka jest domyślna maksymalna liczba wierszy zwracanych przez zapytania w Supabase?","correct_answer":"1000"}]}'::jsonb,
  'google/gemini-2.5-flash-lite',
  '2025-11-11T12:23:47.213+00:00'
);

-- Insert question: true_false (Order: 1)
INSERT INTO public.questions (id, quiz_id, type, content, question_order, correct_answers_data, created_at) VALUES (
  '6a788205-b28a-4115-b5d7-4d898ea25c4f',
  '03a9530b-6597-4fec-97b6-d9b6b33461f4',
  'true_false'::question_type,
  'Supabase jest oparty na bazie danych NoSQL.',
  1,
  '{"type":"true_false","correct_answer":false}'::jsonb,
  '2025-11-11T12:23:47.213+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '90447e5e-46fa-4430-bc3b-daa19acf96c7',
  '6a788205-b28a-4115-b5d7-4d898ea25c4f',
  'Prawda',
  false,
  '2025-11-11T12:23:47.213+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  'debf9603-4e80-4bd7-8665-50391cdaebd3',
  '6a788205-b28a-4115-b5d7-4d898ea25c4f',
  'Fałsz',
  true,
  '2025-11-11T12:23:47.213+00:00'
);

-- Insert question: true_false (Order: 2)
INSERT INTO public.questions (id, quiz_id, type, content, question_order, correct_answers_data, created_at) VALUES (
  'b3b8d8a6-056a-4e76-b4a2-e87af0c94c64',
  '03a9530b-6597-4fec-97b6-d9b6b33461f4',
  'true_false'::question_type,
  'Row Level Security (RLS) jest opcjonalną funkcją i nie jest krytyczna dla bezpieczeństwa danych w Supabase.',
  2,
  '{"type":"true_false","correct_answer":false}'::jsonb,
  '2025-11-11T12:23:47.213+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  'f4d1481c-90e3-4b4a-97ae-55488752fc0c',
  'b3b8d8a6-056a-4e76-b4a2-e87af0c94c64',
  'Prawda',
  false,
  '2025-11-11T12:23:47.213+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  'befac072-bfb8-44ad-b0b6-a946f79b9888',
  'b3b8d8a6-056a-4e76-b4a2-e87af0c94c64',
  'Fałsz',
  true,
  '2025-11-11T12:23:47.213+00:00'
);

-- Insert question: multiple_choice (Order: 3)
INSERT INTO public.questions (id, quiz_id, type, content, question_order, correct_answers_data, created_at) VALUES (
  '9f01a68b-5e67-4850-b508-ebdfc77a4d6b',
  '03a9530b-6597-4fec-97b6-d9b6b33461f4',
  'multiple_choice'::question_type,
  'Które z poniższych są głównymi produktami oferowanymi przez Supabase?',
  3,
  '{"type":"multiple_choice","correct_answer_ids":["e791cba8-0e6e-40af-b222-cbc3768160f3","a6bd71e2-e0e8-4536-b0f1-238d9779850e","171c9411-1187-4762-9d5d-611b28ff97a3"],"correct_answer_texts":["Authentication","Storage","Realtime"]}'::jsonb,
  '2025-11-11T12:23:47.213+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '64f6087e-9b82-4173-9912-a301a87b64b3',
  '9f01a68b-5e67-4850-b508-ebdfc77a4d6b',
  'Database',
  false,
  '2025-11-11T12:23:47.213+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  'e791cba8-0e6e-40af-b222-cbc3768160f3',
  '9f01a68b-5e67-4850-b508-ebdfc77a4d6b',
  'Authentication',
  true,
  '2025-11-11T12:23:47.213+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  'a6bd71e2-e0e8-4536-b0f1-238d9779850e',
  '9f01a68b-5e67-4850-b508-ebdfc77a4d6b',
  'Storage',
  true,
  '2025-11-11T12:23:47.213+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '171c9411-1187-4762-9d5d-611b28ff97a3',
  '9f01a68b-5e67-4850-b508-ebdfc77a4d6b',
  'Realtime',
  true,
  '2025-11-11T12:23:47.213+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '26838705-65f5-4578-a84c-02d3328324c2',
  '9f01a68b-5e67-4850-b508-ebdfc77a4d6b',
  'Web Hosting',
  false,
  '2025-11-11T12:23:47.213+00:00'
);

-- Insert question: multiple_choice (Order: 4)
INSERT INTO public.questions (id, quiz_id, type, content, question_order, correct_answers_data, created_at) VALUES (
  'a6a7bfa7-6c7b-449c-9467-4b921d958caf',
  '03a9530b-6597-4fec-97b6-d9b6b33461f4',
  'multiple_choice'::question_type,
  'Które z poniższych są zaletami Supabase?',
  4,
  '{"type":"multiple_choice","correct_answer_ids":["0dbc6d2b-a733-4f27-8e2f-8ca671d5129f","fb4b90a8-6af5-4be6-b2d8-c4bf50ed1c8c","a9a98f00-e594-4a58-adaa-4d5b9edfba4b"],"correct_answer_texts":["Open Source & Portable","Developer Experience","Cost-Effective"]}'::jsonb,
  '2025-11-11T12:23:47.213+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '0dbc6d2b-a733-4f27-8e2f-8ca671d5129f',
  'a6a7bfa7-6c7b-449c-9467-4b921d958caf',
  'Open Source & Portable',
  true,
  '2025-11-11T12:23:47.213+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '9502f3b9-21c1-4693-8723-ecadf98fea6e',
  'a6a7bfa7-6c7b-449c-9467-4b921d958caf',
  'Vendor Lock-in',
  false,
  '2025-11-11T12:23:47.213+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  'fb4b90a8-6af5-4be6-b2d8-c4bf50ed1c8c',
  'a6a7bfa7-6c7b-449c-9467-4b921d958caf',
  'Developer Experience',
  true,
  '2025-11-11T12:23:47.213+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  'a9a98f00-e594-4a58-adaa-4d5b9edfba4b',
  'a6a7bfa7-6c7b-449c-9467-4b921d958caf',
  'Cost-Effective',
  true,
  '2025-11-11T12:23:47.213+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '825ce690-5adb-4fa8-9a38-84fd8ea72828',
  'a6a7bfa7-6c7b-449c-9467-4b921d958caf',
  'Limited Customization',
  false,
  '2025-11-11T12:23:47.213+00:00'
);

-- Insert question: multiple_choice (Order: 5)
INSERT INTO public.questions (id, quiz_id, type, content, question_order, correct_answers_data, created_at) VALUES (
  'd998aeb7-2c12-46d5-9f4e-9ea703a77639',
  '03a9530b-6597-4fec-97b6-d9b6b33461f4',
  'multiple_choice'::question_type,
  'Które metody uwierzytelniania są obsługiwane przez Supabase?',
  5,
  '{"type":"multiple_choice","correct_answer_ids":["471d72a2-d1cd-499f-be3d-3ba85e79f160","46a83bbb-8973-4eb7-842e-fd70bd58ac0d","8f55e029-93fb-4751-b493-4679a8bb3205"],"correct_answer_texts":["Email/password authentication","OAuth providers","Phone/SMS authentication"]}'::jsonb,
  '2025-11-11T12:23:47.213+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '471d72a2-d1cd-499f-be3d-3ba85e79f160',
  'd998aeb7-2c12-46d5-9f4e-9ea703a77639',
  'Email/password authentication',
  true,
  '2025-11-11T12:23:47.213+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '7a139d86-c016-44e7-801f-87c2e40ba261',
  'd998aeb7-2c12-46d5-9f4e-9ea703a77639',
  'LDAP',
  false,
  '2025-11-11T12:23:47.213+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '46a83bbb-8973-4eb7-842e-fd70bd58ac0d',
  'd998aeb7-2c12-46d5-9f4e-9ea703a77639',
  'OAuth providers',
  true,
  '2025-11-11T12:23:47.213+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '8f55e029-93fb-4751-b493-4679a8bb3205',
  'd998aeb7-2c12-46d5-9f4e-9ea703a77639',
  'Phone/SMS authentication',
  true,
  '2025-11-11T12:23:47.213+00:00'
);

-- Insert question: multiple_choice (Order: 6)
INSERT INTO public.questions (id, quiz_id, type, content, question_order, correct_answers_data, created_at) VALUES (
  'ae3142bf-7a89-4e0a-b41f-aab92efe15fb',
  '03a9530b-6597-4fec-97b6-d9b6b33461f4',
  'multiple_choice'::question_type,
  'Które z poniższych stwierdzeń dotyczących Storage w Supabase są prawdziwe?',
  6,
  '{"type":"multiple_choice","correct_answer_ids":["bfea6e7a-f7de-4b49-b42c-d9bb31616554","4231ebef-9fab-43b6-9f58-15de81ecd385"],"correct_answer_texts":["Możliwość tworzenia prywatnych i publicznych bucketów.","Obsługa S3-compatible API.","Możliwość transformacji obrazów on-the-fly."]}'::jsonb,
  '2025-11-11T12:23:47.213+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  'cfc835fc-b871-4707-b8cc-8e439143e33d',
  'ae3142bf-7a89-4e0a-b41f-aab92efe15fb',
  'Wszystkie bucket''y są publiczne z definicji.',
  false,
  '2025-11-11T12:23:47.213+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  'bfea6e7a-f7de-4b49-b42c-d9bb31616554',
  'ae3142bf-7a89-4e0a-b41f-aab92efe15fb',
  'Możliwość tworzenia prywatnych i publicznych bucketów.',
  true,
  '2025-11-11T12:23:47.213+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '4946c59e-9214-435f-b59b-93f143013c01',
  'ae3142bf-7a89-4e0a-b41f-aab92efe15fb',
  'Obsługa tylko S3 API.',
  false,
  '2025-11-11T12:23:47.213+00:00'
);

-- Insert answer for question
INSERT INTO public.answers (id, question_id, content, is_correct, created_at) VALUES (
  '4231ebef-9fab-43b6-9f58-15de81ecd385',
  'ae3142bf-7a89-4e0a-b41f-aab92efe15fb',
  'Możliwość transformacji obrazów on-the-fly.',
  true,
  '2025-11-11T12:23:47.213+00:00'
);

-- Insert question: short_answer (Order: 7)
INSERT INTO public.questions (id, quiz_id, type, content, question_order, correct_answers_data, created_at) VALUES (
  '92c0be9d-f735-4448-ab9e-dbb6ff921056',
  '03a9530b-6597-4fec-97b6-d9b6b33461f4',
  'short_answer'::question_type,
  'Jaka jest kluczowa zasada bezpieczeństwa, którą należy zawsze włączyć dla wszystkich tabel w Supabase?',
  7,
  '{"type":"short_answer","case_sensitive":false,"correct_answers":["Row Level Security"]}'::jsonb,
  '2025-11-11T12:23:47.213+00:00'
);

-- Insert question: short_answer (Order: 8)
INSERT INTO public.questions (id, quiz_id, type, content, question_order, correct_answers_data, created_at) VALUES (
  'cd655512-bc47-470e-bdc4-9903403e3a2d',
  '03a9530b-6597-4fec-97b6-d9b6b33461f4',
  'short_answer'::question_type,
  'Jaka jest domyślna maksymalna liczba wierszy zwracanych przez zapytania w Supabase?',
  8,
  '{"type":"short_answer","case_sensitive":false,"correct_answers":["1000"]}'::jsonb,
  '2025-11-11T12:23:47.213+00:00'
);


