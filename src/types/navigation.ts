// Navigation types for the app
export type RootStackParamList = {
    Dashboard: undefined;
    Module: { moduleId: string; title: string };
    SubLesson: { moduleId: string; sublessonId: string; title: string; language: 'ASL' | 'FSL' };
}; 