"use server"

import prisma from "@/server/prisma/db"
import { revalidateTag } from "next/cache"

export const give_answers = async (given_answers: string[], test_question_id: string) => {
  'use server'

  await prisma.testQuestion.update({
    where: { id: test_question_id }, data: {
      answered: true,
      given_answers_ids: {
        create: [...given_answers.map((ga) => { return { answer_id: ga } })]
      }
    }
  })

  const test = await prisma.user_Tests.findFirst({
    where: {
      test_questions: { some: { id: test_question_id } }
    },
    include: {
      test_questions: {
        include: {
          question: { include: { answers: true } },
          given_answers_ids: true
        }
      }
    }
  });

  if (test) {
    const allQuestionsAnswered = test.test_questions.every(question => question.answered);
    let passed = null;

    if (allQuestionsAnswered) {
      passed = test.test_questions.every(question => {
        const correctAnswerIds = question.question.answers.filter(answer => answer.is_correct).map(answer => answer.id);
        const givenAnswerIds = question.given_answers_ids.map(answer => answer.answer_id);
        return correctAnswerIds.length === givenAnswerIds.length && correctAnswerIds.every(id => givenAnswerIds.includes(id));
      });
    }

    await prisma.user_Tests.update({
      where: {
        id: test.id
      },
      data: {
        finished: allQuestionsAnswered,
        passed: passed
      }
    });
  }

  revalidateTag(`test-question-${test_question_id}`)

}
