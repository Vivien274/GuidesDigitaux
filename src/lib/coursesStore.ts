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

const DEFAULT_COURSES: Course[] = [
  {
    id: 'c1',
    title: 'Formation Vidéo : Créer sa vitrine en ligne avec WordPress',
    description: 'Construis toi-même un site moderne, rapide et responsive.',
    duration: '3h30',
    level: '100% Adapté Débutant',
    prerequisites: 'Aucun prérequis technique nécessaire. Avoir un ordinateur connecté à internet.',
    price: 199,
    originalPrice: 249,
    isPreorder: false,
    category: 'Formation Vidéo',
    status: 'Publié',
    studentsCount: 84,
    modules: [
      {
        id: 'm1',
        title: 'Module 1 : Choix de l’hébergement & domaine',
        lessons: [
          { id: 'l1', title: 'Cours 1.1 : Bienvenue & Introduction', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', notes: 'Notes de présentation du projet.', duration: '08:15', pdfUrl: 'https://www.guides-digitaux.com/wp-content/uploads/2026/02/checklist-a-verifier-avant-le-lancement-du-site.webp' },
          { id: 'l2', title: 'Cours 1.2 : Réserver son nom de domaine', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', notes: 'Conseils pour réserver son domaine sans frais cachés.', duration: '14:30' }
        ],
        quiz: {
          id: 'q1',
          title: 'Quizz de validation du Module 1 : Hébergement & Domaine',
          passingScorePercent: 100,
          questions: [
            {
              id: 'q1-1',
              question: 'Quel est l\'élément indispensable pour installer WordPress et héberger son site web ?',
              options: [
                'Un serveur d\'hébergement web et un nom de domaine',
                'Un compte Instagram Pro',
                'Une imprimante 3D'
              ],
              correctOptionIndex: 0,
              explanation: 'Un nom de domaine et un serveur d\'hébergement sont requis pour rendre votre site accessible en ligne.'
            },
            {
              id: 'q1-2',
              question: 'Quelle est la bonne pratique pour choisir son nom de domaine ?',
              options: [
                'Prendre un nom le plus long possible avec plein d\'accents',
                'Choisir un nom court, mémorisable et en rapport avec sa marque',
                'Utiliser des caractères spéciaux étranges'
              ],
              correctOptionIndex: 1,
              explanation: 'Un nom court et mémorisable facilite le bouche-à-oreille et les recherches de vos clients.'
            }
          ]
        }
      },
      {
        id: 'm2',
        title: 'Module 2 : Installation & Paramétrage WordPress',
        lessons: [
          { id: 'l3', title: 'Cours 2.1 : Installer WordPress en 1 clic', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', notes: 'Installation rapide chez l’hébergeur.', duration: '12:40' }
        ]
      }
    ]
  },
  {
    id: 'c2',
    title: 'Formation Vidéo : Ajouter une boutique en ligne avec WooCommerce',
    description: 'Vends tes créations en ligne avec la solution e-commerce numéro 1.',
    duration: '2h15',
    level: 'Débutant',
    prerequisites: 'Avoir un site WordPress fonctionnel.',
    price: 99,
    originalPrice: 149,
    isPreorder: false,
    category: 'Formation Vidéo',
    status: 'Publié',
    studentsCount: 58,
    modules: [
      {
        id: 'm2-1',
        title: 'Module 1 : Configuration initiale WooCommerce',
        lessons: [
          { id: 'l2-1', title: 'Cours 1.1 : Installer l’extension WooCommerce', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoylikes.mp4', notes: 'Réglages de la devise et du pays.', duration: '15:00' },
          { id: 'l2-2', title: 'Cours 2 : Nouvelle vidéo & ressources', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', notes: 'Consignes et guides pratiques.', duration: '12:00' }
        ]
      }
    ]
  }
];

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
    localStorage.setItem('gd_custom_courses', JSON.stringify(updated));
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
