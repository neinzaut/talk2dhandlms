export interface Sublesson {
    id: string;
    title: string;
    progress: number;
  }
  
  export interface Lesson {
    id: string;
    title: string;
    image: any;
    sublessons: Sublesson[];
    overallProgress: number;
  }