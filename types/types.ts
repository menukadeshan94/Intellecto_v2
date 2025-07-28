// types/index.ts
export interface ICategory {
  id: string;
  name: string;
  description: string;
  image?: string;
  isActive: boolean;           // ✅ Added
  quizzes: IQuiz[];
  createdAt: string;           // ISO strings from JSON
  updatedAt: string;   
}

export interface IQuiz {
  id: string;
  title: string;
  description?: string | null;
  image?: string | null;
  isActive: boolean;           // ✅ Added
  difficulty?: string | null;  // ✅ Added
  timeLimit?: number | null;   // ✅ Added (in minutes)
  passingScore?: number | null; // ✅ Added (percentage)
  categoryId: string;
  creatorId?: string | null;   // ✅ Added
  createdAt: string;           // ✅ Added
  updatedAt: string;           // ✅ Added
  questions: IQuestion[];
  creator?: IUser;             // ✅ Added (optional relation)
  category?: ICategory;        // ✅ Added (optional relation)
}

export interface IQuestion {
  id: string;
  text: string;
  difficulty?: string | null;
  points: number;              // ✅ Added (default 1)
  explanation?: string | null; // ✅ Added
  answer: string;              // ✅ Added
  quizId: string;              // ✅ Added
  createdAt: string;           // ✅ Added
  updatedAt: string;           // ✅ Added
  options: IOption[];
  quiz?: IQuiz;                // ✅ Added (optional relation)
}

export interface IOption {
  id: string;
  text: string;
  isCorrect: boolean;
  questionId: string;          // ✅ Added
  createdAt: string;           // ✅ Added
  question?: IQuestion;        // ✅ Added (optional relation)
}

export interface IResponse {
  questionId: string;
  optionId: string;
  isCorrect: boolean;
}

export interface ICategoryStats {
  id: string;
  userId: string;
  categoryId: string;
  attempts: number;
  completed: number;
  averageScore: number | null;
  bestScore: number | null;    // ✅ Added
  totalTime?: number | null;   // ✅ Added (in minutes)
  lastAttempt: string | null;  // ISO string from API response
  createdAt: string;           // ✅ Added
  updatedAt: string;           // ✅ Added
  user?: IUser;                // ✅ Added (optional relation)
  category?: ICategory;        // ✅ Added (optional relation)
}

export interface IUser {
  id: string;
  clerkId: string | null;
  role: string;
  createdAt: string;           // ✅ Added
  updatedAt: string;           // ✅ Added
  categoryStats: ICategoryStats[];
  quizAttempts?: IQuizAttempt[]; // ✅ Added (optional relation)
  achievements?: IUserAchievement[]; // ✅ Added (optional relation)
  quizzes?: IQuiz[];           // ✅ Added (created quizzes)
}

// ✅ New interfaces for missing models
export interface IQuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  categoryId: string;
  score?: number | null;       // percentage score
  totalQuestions: number;
  correctAnswers: number;
  completed: boolean;
  timeSpent?: number | null;   // in seconds
  startedAt: string;           // ISO string
  completedAt?: string | null; // ISO string
  answers?: any;               // JSON data
  createdAt: string;
  updatedAt: string;
  user?: IUser;                // optional relation
  quiz?: IQuiz;                // optional relation  
  category?: ICategory;        // optional relation
}

export interface IAchievement {
  id: string;
  name: string;
  description: string;
  icon?: string | null;
  type: string;                // streak, score, completion, category_master, etc.
  requirement: any;            // JSON - flexible requirement structure
  points: number;
  isActive: boolean;
  createdAt: string;
  users?: IUserAchievement[];  // optional relation
}

export interface IUserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  unlockedAt: string;          // ISO string
  progress?: any;              // JSON - track progress towards achievement
  user?: IUser;                // optional relation
  achievement?: IAchievement;  // optional relation
}

// Keep your existing form and creation types
export interface ICategoryForForm {
  id: string;
  name: string;
  description: string;
  image?: string;
}

export interface IQuizCreateData {
  title: string;
  description?: string;
  categoryId: string;
  creatorId: string;
  difficulty?: string;         // ✅ Added
  timeLimit?: number;          // ✅ Added
  passingScore?: number;       // ✅ Added
  questions: IQuestionCreateData[];
}

export interface IQuestionCreateData {
  text: string;
  answer: string;
  explanation?: string;
  difficulty?: string;         // ✅ Added
  points?: number;             // ✅ Added
  options: IOptionCreateData[];
}

export interface IOptionCreateData {
  text: string;
  isCorrect: boolean;
}

// ✅ Additional utility types
export interface IQuizStartResponse {
  attemptId: string;
  quiz: IQuiz;
  startedAt: string;
}

export interface IQuizFinishRequest {
  categoryId: string;
  quizId: string;
  score: number;
  responses: IResponse[];
}

export interface IQuizFinishResponse {
  stat: ICategoryStats;
  attempt: IQuizAttempt;
  message: string;
}

// ✅ API Response types
export interface IApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// ✅ Updated IUserStats to match new structure
export interface IUserStats {
  id: string;
  clerkId: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
  categoryStats: ICategoryStats[];
  quizAttempts?: IQuizAttempt[];
  achievements?: IUserAchievement[];
}