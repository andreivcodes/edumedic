import { QuestionCard } from "@/components/test/question-card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import prisma from "@/server/prisma/db"

export default async function TestPage({ params }: { params: { test_id: string } }) {

  const test_questions = await get_test_questions(params.test_id);


  return (<div className="w-full flex flex-col items-center justify-center pt-24">
    <Carousel className="w-full max-w-md">
      <CarouselContent>
        {test_questions.map((tq) => (
          <CarouselItem key={tq.id}>
            <QuestionCard tq={tq} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>


  </div>)
}


const get_test_questions = async (test_id: string) => {

  const user_test = await prisma.user_Tests.findFirst({ where: { id: test_id }, include: { test_questions: { include: { given_answers_ids: true } }, } });

  const questions = await prisma.testQuestion.findMany({ where: { testId: user_test?.id }, include: { question: { include: { answers: true } }, given_answers_ids: true } })

  return questions;
}

type AsyncReturnType<T extends (...args: any) => Promise<any>> = T extends (
  ...args: any
) => Promise<infer R>
  ? R
  : any;

export type test_questions_type = AsyncReturnType<typeof get_test_questions>;
