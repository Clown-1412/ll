export interface Question {
  content: string;
  answers: string[];
  correctAnswer: number; // Index của đáp án đúng
}

export const QUESTIONS: Question[] = [
  {
    content: 'Có bao nhiêu chữ C trong câu sau đây: "Cơm, canh, chảo, gì tớ cũng thích ăn!"',
    answers: ['1 chữ', '2 chữ', '3 chữ', '4 chữ'],
    correctAnswer: 2, // "3 chữ" (Cơm, canh, chảo)
  },
  {
    content: 'React Native do công ty nào phát triển?',
    answers: ['Google', 'Microsoft', 'Facebook', 'Apple'],
    correctAnswer: 2,
  },
];