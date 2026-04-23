import { IntimacyAnswer, IntimacyCategory, IntimacyCategoryDescription, IntimacyStatement } from './types';

export const INTIMACY_ANSWERS: IntimacyAnswer[] = [
  { label: 'никогда', value: 0 },
  { label: 'иногда', value: 1 },
  { label: 'умеренно', value: 2 },
  { label: 'часто', value: 3 },
];

export const INTIMACY_STATEMENTS: IntimacyStatement[] = [
  // 1. Низкая самооценка: 1, 11, 31, 47
  { id: 1, text: 'Иногда мне кажется, что я не очень привлекательный(-ая) и желанный(-ая)', category: IntimacyCategory.LOW_SELF_ESTEEM },
  { id: 11, text: 'Иногда мне кажется, что со мной что-то в корне не так', category: IntimacyCategory.LOW_SELF_ESTEEM },
  { id: 31, text: 'Не представляю, чтобы кто-нибудь когда-нибудь меня полюбил', category: IntimacyCategory.LOW_SELF_ESTEEM },
  { id: 47, text: 'Мне кажется, что я хуже других', category: IntimacyCategory.LOW_SELF_ESTEEM },

  // 2. Романтический перфекционизм: 9, 12, 43, 58
  { id: 9, text: 'Мне кажется, что нужно хорошо выглядеть, быть интересной, умной или успешной личностью, обладать высоким статусом, чтобы другие любили и принимали меня', category: IntimacyCategory.ROMANTIC_PERFECTIONISM },
  { id: 12, text: 'Мне было бы сложно любить кого-то менее привлекательного, интересного или умного, чем идеальный партнер, которого я бы себе желал(-а)', category: IntimacyCategory.ROMANTIC_PERFECTIONISM },
  { id: 43, text: 'Мне не хотелось бы, чтобы меня увидели на свидании с человеком, который не соответствует моим стандартам привлекательности или интеллекта', category: IntimacyCategory.ROMANTIC_PERFECTIONISM },
  { id: 58, text: 'Я часто расстраиваюсь и разочаровываюсь, когда по-настоящему узнаю друга или партнера', category: IntimacyCategory.ROMANTIC_PERFECTIONISM },

  // 3. Эмоциональный перфекционизм: 29, 48, 49, 53
  { id: 29, text: 'Мне кажется, что злость между друзьями или партнерами почти всегда говорит о нехватке любви и уважения', category: IntimacyCategory.EMOTIONAL_PERFECTIONISM },
  { id: 48, text: 'Я всегда стараюсь избегать конфликтов и споров с теми, кто мне дорог', category: IntimacyCategory.EMOTIONAL_PERFECTIONISM },
  { id: 49, text: 'Если я не чувствую сильного романтического влечения к потенциальному партнеру, я говорю себе, что нет смысла что-либо начинать', category: IntimacyCategory.EMOTIONAL_PERFECTIONISM },
  { id: 53, text: 'Меня очень расстраивают споры и разногласия с друзьями и партнерами', category: IntimacyCategory.EMOTIONAL_PERFECTIONISM },

  // 4. Застенчивость и социальная тревожность: 3, 10, 20, 51
  { id: 3, text: 'В общении я часто чувствую себя неловко и неуверенно', category: IntimacyCategory.SHYNESS },
  { id: 10, text: 'Обычно я стараюсь избегать людей, если нервничаю или чувствую себя неуверенно', category: IntimacyCategory.SHYNESS },
  { id: 20, text: 'Если люди узнают, что я нервничаю или стесняюсь, они будут хуже обо мне думать', category: IntimacyCategory.SHYNESS },
  { id: 51, text: 'Иногда я так нервничаю, что не нахожу слов', category: IntimacyCategory.SHYNESS },

  // 5. Безнадежность: 14, 22, 33, 52
  { id: 14, text: 'Иногда я говорю себе, что у меня никогда не будет хороших отношений с теми, кто мне нравится', category: IntimacyCategory.HOPELESSNESS },
  { id: 22, text: 'Похоже, я совершенно не интересен(-на) людям, которые нравятся мне', category: IntimacyCategory.HOPELESSNESS },
  { id: 33, text: 'Иногда мне кажется, что, как бы я ни пытался(-ась) улучшить отношения с другими людьми, ничего не получается', category: IntimacyCategory.HOPELESSNESS },
  { id: 52, text: 'Иногда мне кажется, что я безнадежен(-на) и не смогу улучшить отношения с другими', category: IntimacyCategory.HOPELESSNESS },

  // 6. Отчужденность и изоляция: 18, 28, 36, 41
  { id: 18, text: 'Коллектива, частью которого мне действительно нравится быть, не существует', category: IntimacyCategory.ALIENATION },
  { id: 28, text: 'Мне кажется, что у меня мало общего с другими', category: IntimacyCategory.ALIENATION },
  { id: 36, text: 'Я не знаю, где с кем-нибудь познакомиться', category: IntimacyCategory.ALIENATION },
  { id: 41, text: 'Мне сложно заводить друзей', category: IntimacyCategory.ALIENATION },

  // 7. Чувствительность к отвержению: 5, 21, 32, 39
  { id: 5, text: 'Если кто-то меня отвергает, я обычно чувствую, что со мной что-то не так', category: IntimacyCategory.REJECTION_SENSITIVITY },
  { id: 21, text: 'Когда кто-то меня отвергает, обычно я чувствую, что я не особенно любимый(-ая) и желанный(-ая)', category: IntimacyCategory.REJECTION_SENSITIVITY },
  { id: 32, text: 'Когда кто-то меня отвергает, мне кажется, что все остальные тоже рано или поздно меня отвергнут', category: IntimacyCategory.REJECTION_SENSITIVITY },
  { id: 39, text: 'Когда кто-то меня отвергает, мне обычно кажется, что во всем виноват(-а) я сам(-а)', category: IntimacyCategory.REJECTION_SENSITIVITY },

  // 8. Страх одиночества: 2, 6, 23, 57
  { id: 2, text: 'Я несчастлив(-а) из-за того, что приходится все делать в одиночку', category: IntimacyCategory.FEAR_OF_LONELINESS },
  { id: 6, text: 'Мне трудно бывать одному(-ой)', category: IntimacyCategory.FEAR_OF_LONELINESS },
  { id: 23, text: 'Мне кажется, что быть одному(-ой) — ненормально', category: IntimacyCategory.FEAR_OF_LONELINESS },
  { id: 57, text: 'Когда я один (одна), я чувствую себя опустошенным(-ой) и нереализованным(-ой)', category: IntimacyCategory.FEAR_OF_LONELINESS },

  // 9. Отчаяние: 13, 26, 37, 42
  { id: 13, text: 'Я часто чувствую себя брошенным(-ой), когда я один (одна)', category: IntimacyCategory.DESPAIR },
  { id: 26, text: 'Когда я один (одна), я чувствую себя беспомощным(-ой) и уязвимым(-ой)', category: IntimacyCategory.DESPAIR },
  { id: 37, text: 'Когда я один (одна), мне страшно, я впадаю в панику', category: IntimacyCategory.DESPAIR },
  { id: 42, text: 'Иногда мне кажется, что несчастливые отношения лучше, чем никаких', category: IntimacyCategory.DESPAIR },

  // 10. Страх «разоблачения»: 4, 24, 27, 56
  { id: 4, text: 'Мне трудно рассказать другу, что мне одиноко или я расстроен(-а)', category: IntimacyCategory.FEAR_OF_EXPOSURE },
  { id: 24, text: 'Мне не нравится рассказывать о своих слабостях, недостатках и несовершенствах', category: IntimacyCategory.FEAR_OF_EXPOSURE },
  { id: 27, text: 'Мне трудно делиться своими чувствами с людьми', category: IntimacyCategory.FEAR_OF_EXPOSURE },
  { id: 56, text: 'Мне кажется, что большинство людей не приняли бы меня, узнав получше', category: IntimacyCategory.FEAR_OF_EXPOSURE },

  // 11. Нерешительность: 8, 15, 34, 60
  { id: 8, text: 'Мне очень сложно критиковать друзей и любимых или говорить, что я на них злюсь', category: IntimacyCategory.INDECISIVENESS },
  { id: 15, text: 'Обычно мне кажется, что я должен(-на) соглашаться на все, даже если стоило бы отказать', category: IntimacyCategory.INDECISIVENESS },
  { id: 34, text: 'Обычно мне кажется, что я должен(-на) пытаться сделать всех остальных счастливыми, даже если сам(-а) стану несчастным(-ой)', category: IntimacyCategory.INDECISIVENESS },
  { id: 60, text: 'Во время конфликтов я почти всегда поддаюсь', category: IntimacyCategory.INDECISIVENESS },

  // 12. Обида и горечь: 17, 35, 45, 59
  { id: 17, text: 'По-моему, то, что у меня нет ни одного близкого человека, — нечестно', category: IntimacyCategory.RESENTMENT },
  { id: 35, text: 'Меня часто обижает то, как люди ко мне относятся', category: IntimacyCategory.RESENTMENT },
  { id: 45, text: 'Мне обидно, потому что я получаю от других меньше любви и тепла, чем заслуживаю', category: IntimacyCategory.RESENTMENT },
  { id: 59, text: 'Я часто думаю, что в большинстве моих проблем с отношениями виноваты другие', category: IntimacyCategory.RESENTMENT },

  // 13. Защита и страх критики: 19, 25, 30, 44
  { id: 19, text: 'Когда меня критикуют, мне часто хочется защищаться', category: IntimacyCategory.DEFENSE_CRITICISM_FEAR },
  { id: 25, text: 'Обычно я крайне чувствителен(-на) к неодобрению и критике', category: IntimacyCategory.DEFENSE_CRITICISM_FEAR },
  { id: 30, text: 'Когда меня критикуют, я часто расстраиваюсь, потому что люди не хотят признавать, что я прав(-а)', category: IntimacyCategory.DEFENSE_CRITICISM_FEAR },
  { id: 44, text: 'Обычно критика меня очень расстраивает', category: IntimacyCategory.DEFENSE_CRITICISM_FEAR },

  // 14. Депрессия: 16, 38, 50, 55
  { id: 16, text: 'У меня мало интересов', category: IntimacyCategory.DEPRESSION },
  { id: 38, text: 'Я утратил(-а) мотивацию ко многим занятиям', category: IntimacyCategory.DEPRESSION },
  { id: 50, text: 'Мне грустно и тоскливо', category: IntimacyCategory.DEPRESSION },
  { id: 55, text: 'Иногда мне кажется, что я неудачник (неудачница)', category: IntimacyCategory.DEPRESSION },

  // 15. Страх оказаться в ловушке: 7, 40, 46, 54
  { id: 7, text: 'Иногда кажется, что в близких отношениях мне не хватает свободы', category: IntimacyCategory.FEAR_OF_TRAP },
  { id: 40, text: 'Иногда мысль о длительных отношениях меня пугает', category: IntimacyCategory.FEAR_OF_TRAP },
  { id: 46, text: 'Меня очень расстраивает, если я не соответствую всем ожиданиям друга или партнера', category: IntimacyCategory.FEAR_OF_TRAP },
  { id: 54, text: 'Иногда мне кажется, что близкие отношения — ловушка', category: IntimacyCategory.FEAR_OF_TRAP },
];

// Описания категорий
export const INTIMACY_CATEGORY_DESCRIPTIONS: IntimacyCategoryDescription[] = [
  { category: IntimacyCategory.LOW_SELF_ESTEEM, title: 'Низкая самооценка' },
  { category: IntimacyCategory.ROMANTIC_PERFECTIONISM, title: 'Романтический перфекционизм' },
  { category: IntimacyCategory.EMOTIONAL_PERFECTIONISM, title: 'Эмоциональный перфекционизм' },
  { category: IntimacyCategory.SHYNESS, title: 'Застенчивость и социальная тревожность' },
  { category: IntimacyCategory.HOPELESSNESS, title: 'Безнадежность' },
  { category: IntimacyCategory.ALIENATION, title: 'Отчужденность и изоляция' },
  { category: IntimacyCategory.REJECTION_SENSITIVITY, title: 'Чувствительность к отвержению' },
  { category: IntimacyCategory.FEAR_OF_LONELINESS, title: 'Страх одиночества' },
  { category: IntimacyCategory.DESPAIR, title: 'Отчаяние' },
  { category: IntimacyCategory.FEAR_OF_EXPOSURE, title: 'Страх «разоблачения»' },
  { category: IntimacyCategory.INDECISIVENESS, title: 'Нерешительность' },
  { category: IntimacyCategory.RESENTMENT, title: 'Обида и горечь' },
  { category: IntimacyCategory.DEFENSE_CRITICISM_FEAR, title: 'Защита и страх критики' },
  { category: IntimacyCategory.DEPRESSION, title: 'Депрессия' },
  { category: IntimacyCategory.FEAR_OF_TRAP, title: 'Страх оказаться в ловушке' },
];

// Сортировка утверждений по ID для отображения в порядке 1..60
export const getSortedStatements = (): IntimacyStatement[] => {
  return [...INTIMACY_STATEMENTS].sort((a, b) => a.id - b.id);
};
