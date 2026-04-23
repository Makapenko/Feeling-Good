import { ACTIVITY_IDS } from "../../../constants/activities";

export interface LonelinessQuestion {
  text: string;
  // Баллы для каждого варианта ответа (никогда, редко, иногда, часто, почти всегда)
  values: [number, number, number, number, number];
}

export interface LonelinessConfig {
  id: string;
  title: string;
  questions: LonelinessQuestion[];
  answerLabels: string[];
  results: {
    minScore: number;
    maxScore: number;
    description: string;
    percent: string;
  }[];
}

export const lonelinessConfig: LonelinessConfig = {
  id: ACTIVITY_IDS.LONELINESS_SCALE,
  title: "Опросник одиночества",
  answerLabels: ["никогда", "редко", "иногда", "часто", "почти всегда"],
  questions: [
    {
      text: "Я чувствую себя одиноко",
      values: [0, 1, 2, 3, 4],
    },
    {
      text: "Есть люди, которым я действительно дорог(-а)",
      values: [4, 3, 2, 1, 0],
    },
    {
      text: "Я чувствую себя обделенным(-ой)",
      values: [0, 1, 2, 3, 4],
    },
    {
      text: "Мне сложно заводить друзей",
      values: [0, 1, 2, 3, 4],
    },
    {
      text: "У меня есть по-настоящему близкие друзья",
      values: [4, 3, 2, 1, 0],
    },
    {
      text: "Мне бы хотелось, чтобы больше людей хотело проводить со мной время",
      values: [0, 1, 2, 3, 4],
    },
    {
      text: "У меня есть с кем поговорить и поделиться чувствами",
      values: [4, 3, 2, 1, 0],
    },
    {
      text: "Я чувствую себя опустошенным и несостоявшимся человеком",
      values: [0, 1, 2, 3, 4],
    },
  ],
  results: [
    {
      minScore: 0,
      maxScore: 4,
      description: "Нет/минимальная степень одиночества. Вы чувствуете себя в целом комфортно в отношениях с другими людьми.",
      percent: "20% людей набирают такой же балл",
    },
    {
      minScore: 5,
      maxScore: 9,
      description: "Средняя степень одиночества. Вы иногда чувствуете себя одиноко, но в целом справляетесь с этим чувством.",
      percent: "30% людей набирают такой же балл",
    },
    {
      minScore: 10,
      maxScore: 14,
      description: "Умеренная степень одиночества. Одиночество заметно влияет на вашу жизнь. Техники из этой книги могут вам помочь.",
      percent: "30% людей набирают такой же балл",
    },
    {
      minScore: 15,
      maxScore: 32,
      description: "Сильная степень одиночества. Вам стоит уделить особое внимание работе над самооценкой и отношениями с окружающими.",
      percent: "20% людей набирают такой же балл",
    },
  ],
};
