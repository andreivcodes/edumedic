"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../ui/card";
import { test_questions_type } from "@/app/dashboard/test/[test_id]/page";
import { CheckCircle, CheckIcon, HelpCircle, Info, XCircle } from "lucide-react";
import { give_answers } from "@/app/dashboard/test/[test_id]/actions";

export const QuestionCard = ({ tq }: { tq: test_questions_type[0] }) => {

  return tq.answered ? <AnsweredQuestion tq={tq} /> : <NotAnsweredQuestion tq={tq} />
}


const AnsweredQuestion = ({ tq }: { tq: test_questions_type[0] }) => {

  const givenAnswers = tq.given_answers_ids.map((a) => a.answer_id);

  return (<Card>
    <CardHeader>
      <CardTitle>
        {tq.question.text}
      </CardTitle>
    </CardHeader>
    <CardContent className="flex flex-col aspect-square items-center justify-center p-6">

      <div className="flex flex-col gap-2 ">
        {tq.question.answers.map((ta) => (
          <Button
            key={ta.id}
            variant="outline"
            className={`gap-2 justify-start pointer-events-none text-wrap max-w-md h-auto ${ta.is_correct ? "bg-green-200" : "bg-red-200"}`}
          >
            <div>
              {givenAnswers.includes(ta.id) && ta.is_correct && <CheckCircle size={24} />}
              {givenAnswers.includes(ta.id) && !ta.is_correct && <XCircle size={24} />}
            </div>
            {ta.text}
          </Button>
        ))}
      </div>

    </CardContent>
    <CardFooter className="flex flex-col items-start gap-2">
      {tq.question.details && (<div>
        <div className="font-semibold text-xl">Detalii:</div>
        <div>{tq.question.details}</div>
      </div>)
      }

    </CardFooter>
  </Card>)
}


const NotAnsweredQuestion = ({ tq }: { tq: test_questions_type[0] }) => {

  const [showHint, setShowHint] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState(tq.given_answers_ids.map((a) => a.answer_id));


  const toggleAnswer = (answerId: string) => {
    setSelectedAnswers((prev) => {
      if (prev.includes(answerId)) {
        return prev.filter((id) => id !== answerId);
      } else {
        return [...prev, answerId];
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {tq.question.text}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col aspect-square items-center justify-center p-6">

        <div className="flex flex-col gap-2 ">
          {tq.question.answers.map((ta) => (
            <Button
              key={ta.id}
              variant="outline"
              className={`text-wrap max-w-md h-auto ${selectedAnswers.includes(ta.id) && "border-2 border-primary"}`}
              onClick={() => toggleAnswer(ta.id)}
            >
              {ta.text}
            </Button>
          ))}
        </div>

      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2">


        <Button className="w-full" disabled={selectedAnswers.length == 0} variant="default"
          onClick={async () => {
            await give_answers(selectedAnswers, tq.id)
          }}
        >
          Trimite raspuns
        </Button>


        {tq.question.hint && (
          showHint ? (<div>
            <div className="font-semibold text-xl">Indiciu:</div>
            <div>{tq.question.hint}</div>
          </div>) : (<div className="flex flex-row gap-2">
            <HelpCircle className="cursor-pointer" onClick={() => setShowHint(true)} />
            <div>Aceasta intrebare are indiciu </div>
          </div>))
        }

        {tq.question.details && (
          showDetails ? (<div>
            <div className="font-semibold text-xl">Detalii:</div>
            <div>{tq.question.details}</div>
          </div>) : (<div className="flex flex-row gap-2">
            <Info className="cursor-pointer" onClick={() => setShowDetails(true)} />
            <div>Aceasta intrebare are informatii aditionale</div>
          </div>))
        }

      </CardFooter>
    </Card>
  )
}
