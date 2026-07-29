'use client';

export interface LessonResourceFile {
  id: string;
  name: string;
  url: string;
}

export interface LessonExternalLink {
  id: string;
  title: string;
  url: string;
}

export interface Lesson {
  id: string;
  title: string;
  videoUrl: string;
  notes: string;
  pdfUrl?: string;
  externalLink?: string;
  duration: string;
  files?: LessonResourceFile[];
  links?: LessonExternalLink[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation?: string;
}

export interface ModuleQuiz {
  id: string;
  title: string;
  passingScorePercent: number;
  questions: QuizQuestion[];
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
  quiz?: ModuleQuiz;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  prerequisites: string;
  price: number;
  originalPrice?: number;
  normalPrice?: number;
  discountedPrice?: number;
  image?: string;
  isPreorder?: boolean;
  preorderReleaseDate?: string;
  category: string;
  status: 'Publié' | 'Brouillon' | 'Planifié';
  scheduledPublishDate?: string;
  modules: Module[];
  congratulationsMsg?: string;
  certificateEnabled?: boolean;
  bonusDocTitle?: string;
  bonusDocUrl?: string;
  communityLink?: string;
  liveStreamUrl?: string;
  liveStreamDate?: string;
  liveStreamTitle?: string;
  studentsCount?: number;
}

const DEFAULT_COURSES: Course[] = [];

export function purgeAllCoursesData(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('gd_custom_courses');
    localStorage.removeItem('gd_enrolled_courses');
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('gd_user_purchases_') || key.startsWith('gd_completed_lessons_')) {
        localStorage.removeItem(key);
      }
    });
  }
}

export function getStoredCourses(): Course[] {
  if (typeof window === 'undefined') return DEFAULT_COURSES;
  try {
    const data = localStorage.getItem('gd_custom_courses');
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to parse gd_custom_courses', e);
  }
  return DEFAULT_COURSES;
}

export function saveCourse(newCourse: Course): Course[] {
  const current = getStoredCourses();
  const index = current.findIndex(c => c.id === newCourse.id);
  let updated: Course[];
  if (index >= 0) {
    updated = current.map(c => c.id === newCourse.id ? newCourse : c);
  } else {
    updated = [newCourse, ...current];
  }
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('gd_custom_courses', JSON.stringify(updated));
    } catch (quotaError) {
      console.warn('localStorage quota exceeded when saving gd_custom_courses. Preserving images while trimming heavy pdfs/videos...', quotaError);
      const sanitized = updated.map(c => ({
        ...c,
        image: c.image && c.image.length > 2000000 ? c.image.slice(0, 500000) : c.image,
        modules: (c.modules || []).map(m => ({
          ...m,
          lessons: (m.lessons || []).map(l => ({
            ...l,
            pdfUrl: l.pdfUrl && l.pdfUrl.length > 200000 ? '' : l.pdfUrl,
            videoUrl: l.videoUrl && l.videoUrl.length > 500000 ? '' : l.videoUrl
          }))
        }))
      }));
      try {
        localStorage.setItem('gd_custom_courses', JSON.stringify(sanitized));
      } catch (e) {
        console.error('Could not save sanitized courses to localStorage', e);
      }
    }
  }
  return updated;
}

export interface RealCourseStats {
  enrolledCount: number;
  completedCount: number;
  completionPercentage: number;
}

/**
 * Calculate REAL student stats based on actual enrolments in localStorage
 */
export function getRealCourseStats(courseId: string, courseTitle?: string): RealCourseStats {
  if (typeof window === 'undefined') {
    return { enrolledCount: 0, completedCount: 0, completionPercentage: 0 };
  }

  try {
    const rawEnrolled = localStorage.getItem('gd_enrolled_courses');
    const enrolledList = rawEnrolled ? JSON.parse(rawEnrolled) : [];

    // Filter enrollments matching courseId or courseTitle keyword
    const matchingEnrollments = enrolledList.filter((item: any) => {
      if (item.id === courseId) return true;
      if (courseId === 'c2' && (item.slug === 'formation-woocommerce' || item.title?.toLowerCase().includes('woocommerce'))) return true;
      if (courseId === 'c1' && (item.slug === 'creer-sa-vitrine-wordpress' || item.title?.toLowerCase().includes('wordpress'))) return true;
      if (courseTitle && item.title?.toLowerCase() === courseTitle.toLowerCase()) return true;
      return false;
    });

    const enrolledCount = matchingEnrollments.length;
    
    // Calculate completed count from matching enrollments having progress >= 100
    const completedCount = matchingEnrollments.filter((item: any) => 
      item.progress >= 100 || (item.completedLessons && item.totalLessons && item.completedLessons >= item.totalLessons)
    ).length;
    
    const completionPercentage = enrolledCount > 0 ? Math.round((completedCount / enrolledCount) * 100) : 0;

    return {
      enrolledCount,
      completedCount,
      completionPercentage
    };
  } catch (e) {
    console.error('Failed to compute real student stats', e);
  }

  return { enrolledCount: 0, completedCount: 0, completionPercentage: 0 };
}
