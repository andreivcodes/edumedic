import { getUserTests, newTest, selectTest } from "@/app/dashboard/actions";
import { Button } from "@/components/ui/button"
import { BookCheck } from "lucide-react";
import moment from "moment"

export default async function SideNav() {
  const userTests = await getUserTests();

  return <div className="h-screen w-72 border-r flex flex-col p-4 gap-4">
    <form action={newTest} className="w-full">
      <Button type="submit" className="w-full">Incepe test nou</Button >
    </form>

    <div className="flex flex-col divide-y">
      {userTests?.map((test) =>
      (
        <form className="py-1" key={test.id} action={selectTest}>
          <Button type="submit" name="test_id" value={test.id} variant="ghost" className={`w-full justify-between ${test.passed ? "bg-green-300" : "bg-red-300"}`}>
            {moment(test.generated_timestamp).format('MMM Do YY, h:mm')}
            {test.finished && <BookCheck />}
          </Button>
        </form>
      ))}
    </div>
  </div >
}
