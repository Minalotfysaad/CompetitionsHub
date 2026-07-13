export interface PaginationResponse<T> {
  items: T[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  startFrom: number;
  endTo: number;
}

// ─── Competition ───────────────────────────────────────────────────────────────
export interface CompetitionListDto {
  id: number;
  title: string;
  description?: string;
  daysCount: number;
}

export interface CompetitionDto {
  id: number;
  title: string;
  description?: string;
}

export interface CompetitionDetailsDto {
  id: number;
  title: string;
  description?: string;
  days: CompetitionDayDto[];
}

export interface CreateCompetitionDto {
  title: string;
  description?: string;
}

export interface UpdateCompetitionDto {
  title: string;
  description?: string;
}

// ─── Competition Day ───────────────────────────────────────────────────────────
export interface CompetitionDayDto {
  id: number;
  competitionId: number;
  dayNum: number;
  title: string;
  startDate: string;
  endDate: string;
  dayTotalMark: number;
  questions: QuestionDto[];
}

export interface CompetitionDayContestantDto {
  id: number;
  competitionId: number;
  dayNum: number;
  title: string;
  startDate: string;
  endDate: string;
  dayTotalMark: number;
  isActive: boolean;
  questions: QuestionContestantDto[];
}

export interface CreateCompetitionDayDto {
  competitionId: number;
  dayNum: number;
  title: string;
  startDate: string;
  endDate: string;
}

export interface UpdateCompetitionDayDto {
  dayNum: number;
  title: string;
  startDate: string;
  endDate: string;
}

// ─── Question ──────────────────────────────────────────────────────────────────
export const QuestionType = {
  ShortAnswer: 1,
  Paragraph: 2,
  MultipleChoice: 3,
  Grid: 4,
  LinearScale: 5,
} as const;
export type QuestionType = typeof QuestionType[keyof typeof QuestionType];

export interface QuestionOptionDto {
  id: number;
  text: string;
}

export interface LinearScaleDto {
  minValue: number;
  maxValue: number;
  minLabel?: string;
  maxLabel?: string;
  correctValue: number;
}

export interface LinearScaleContestantDto {
  minValue: number;
  maxValue: number;
  minLabel?: string;
  maxLabel?: string;
}

export interface GridAnswerKeyDto {
  rowKey: string;
  columnKey: string;
}

export interface GridDto {
  rows: string[];
  columns: string[];
  answerKeys: GridAnswerKeyDto[];
}

export interface GridContestantDto {
  rows: string[];
  columns: string[];
}

export interface MultipleChoiceDto {
  options: string[];
  correctOptionIndex: number;
}

export interface TextQuestionDto {
  correctAnswer?: string;
}

export interface QuestionDto {
  id: number;
  displayOrder: number;
  title: string;
  description?: string;
  type: QuestionType;
  isRequired: boolean;
  questionMark: number;
  competitionDayId: number;
  correctAnswer?: string;
  options?: QuestionOptionDto[];
  linearScale?: LinearScaleDto;
  grid?: GridDto;
}

export interface QuestionContestantDto {
  id: number;
  competitionDayId: number;
  displayOrder: number;
  title: string;
  description?: string;
  type: QuestionType;
  isRequired: boolean;
  questionMark: number;
  options?: QuestionOptionDto[];
  linearScale?: LinearScaleContestantDto;
  grid?: GridContestantDto;
}

export interface CreateQuestionDto {
  displayOrder: number;
  title: string;
  description?: string;
  type: QuestionType;
  isRequired: boolean;
  questionMark: number;
  competitionDayId: number;
  multipleChoice?: MultipleChoiceDto;
  linearScale?: LinearScaleDto;
  grid?: GridDto;
  text?: TextQuestionDto;
}

// ─── Submission ────────────────────────────────────────────────────────────────
export const SubmissionStatus = {
  InProgress: 1,
  Submitted: 2,
  PendingManualReview: 3,
  Graded: 4,
} as const;
export type SubmissionStatus = typeof SubmissionStatus[keyof typeof SubmissionStatus];

export interface QuestionResponseDto {
  id: number;
  questionId: number;
  answerData?: string;
  isCorrect?: boolean;
  earnedMark: number;
  isManuallyGraded: boolean;
  reviewerComment?: string;
}

export interface SubmissionDto {
  id: number;
  competitionDayId: number;
  status: SubmissionStatus;
  startedAt: string;
  submittedAt?: string;
  totalScore: number;
  percentage: number;
  responses: QuestionResponseDto[];
}

export interface StartSubmissionDto {
  competitionDayId: number;
  userId: string;
}

export interface SaveAnswerDto {
  submissionId: number;
  questionId: number;
  answerData?: string;
}

// ─── Manual Grading ────────────────────────────────────────────────────────────
export interface CompetitionManualReviewDto {
  competitionId: number;
  competitionName: string;
  pendingResponsesCount: number;
}

export interface CompetitionDayManualReviewDto {
  id: number;
  dayNum: number;
  title: string;
  pendingResponsesCount: number;
}

export interface ParagraphQuestionReviewDto {
  questionId: number;
  title: string;
  questionMark: number;
  pendingSubmissionsCount: number;
  gradedSubmissionsCount: number;
}

export interface QuestionReviewResponseDto {
  responseId: number;
  submissionId: number;
  userId: string;
  userName: string;
  email: string;
  answerData: string;
  submittedAt: string;
  isManuallyGraded: boolean;
  earnedMark: number;
  reviewerComment?: string;
}

export interface QuestionReviewDetailsDto {
  questionId: number;
  competitionName: string;
  dayNum: number;
  questionTitle: string;
  questionMark: number;
  responses: QuestionReviewResponseDto[];
}

export interface GradeResponseDto {
  earnedMark: number;
  reviewerComment: string;
}

// ─── Auth ──────────────────────────────────────────────────────────────────────
export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  userName: string;
  email: string;
  password: string;
}

export type UserRole = 'admin' | 'contestant';

export interface AuthUser {
  id: string;
  userName: string;
  email: string;
  role: UserRole;
  token: string;
}

export interface AuthResponseDto {
  userId: string;
  token: string;
  role: string;
}
// ─── Leaderboard ──────────────────────────────────────────────────────────────
export interface CompetitionRankingDto {
  rank: number;
  userId: string;
  userName: string;
  totalScore: number;
  percentage: number;
}

export interface CompetitionLeaderboardDto {
  competitionId: number;
  competitionTitle: string;
  rankings: CompetitionRankingDto[];
}

export interface CompetitionDayRankingDto {
  rank: number;
  userId: string;
  userName: string;
  score: number;
  percentage: number;
}

export interface CompetitionDayLeaderboardDto {
  competitionDayId: number;
  dayNum: number;
  rankings: CompetitionDayRankingDto[];
}
