declare module "*.json" {
    interface Section {
        id: string;
        title: string;
        path: string;
    }

    interface Chapter {
        id: string;
        title: string;
        path: string;
        order: number;
        sections: Section[];
    }

    interface SectionGroup {
        id: string;
        name: string;
        chapters: string[];
    }

    interface ChaptersData {
        sections: SectionGroup[];
        chapters: Chapter[];
    }

    const value: ChaptersData;
    export default value;
} 
