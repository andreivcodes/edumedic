import { validateRequest } from "@/lib/auth"
import { revalidateTag } from "next/cache"
import { redirect } from "next/navigation"
import prisma from "@/server/prisma/db"

export const selectTest = async (formData: FormData) => {
  'use server'
  const rawFormData = {
    test_id: formData.get('test_id'),
  }

  redirect(`/dashboard/test/${rawFormData.test_id}`)
}

export const newTest = async () => {
  "use server";
  const { user } = await validateRequest();
  if (!user) return;

  const new_test_questions = await prisma.question.findManyRandom(10, { select: { id: true } });

  const new_test = await prisma.user_Tests.create({
    data: {
      user_id: user.id,
      generated_timestamp: new Date(),
      test_questions: { create: new_test_questions.map((test_question) => { return { question_id: test_question.id, answered: false } }) }
    }
  })

  revalidateTag("user_tests")
  redirect(`/dashboard/test/${new_test.id}`)
}

export const getUserTests = async () => {
  "use server";
  const { user } = await validateRequest();
  if (!user) return;

  const tests = await prisma.user_Tests.findMany({ where: { user_id: user.id }, include: { test_questions: true } })

  return tests
}
