/** DTO for a tag associated with a note. */
export interface TagDto {
  id: string;
  name: string;
}

/** DTO for Spaced Repetition System data. */
export interface SrsDataDto {
  due_date: string;
  interval: number;
  ease_factor: number;
}

/** DTO for the detailed view of a single note. */
export interface NoteDetailsDto {
  id: string;
  user_id: string;
  category_id: string | null;
  title: string;
  content: string;
  tags: TagDto[];
  srs_data: SrsDataDto | null;
  created_at: string;
  updated_at: string;
}
