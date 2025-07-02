export interface Section {
    id: string;
    title: string;
    path?: string;
}

export interface Chapter {
    id: string;
    title: string;
    path?: string;
    order: number;
    sections?: Section[];
}

export interface SectionGroup {
    id: string;
    name: string;
    chapters: string[];
}

export interface ChaptersData {
    sections: SectionGroup[];
    chapters: Chapter[];
} 
