import { createFileRoute } from "@tanstack/react-router";
import authClient from "~/lib/auth/auth-client";
import { AddMemberForm } from './members'
import { MedicineForm, MedicineScheduleForm } from "./medicines";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from '~/components/ui/button';
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/app/_app/")({
  component: RouteComponent,
});

//TODO: Create User Onboarding here 
//Add Member -> Add Medicine -> Add Medicine Schedule

function RouteComponent() {

  const { data: session } = authClient.useSession();


  const [currentStep, setCurrentStep] = useState(0);


  const content = useMemo(() => {
    switch (currentStep) {
      case 0:
        return <AddMemberForm />
      case 1:
        return <div className="w-md -z-0">
          <MedicineForm mode="card" />

        </div>
      case 2:
        return <div className="w-md -z-0">
          <MedicineScheduleForm mode="card" />

        </div>

    }
  }, [currentStep])


  return <div className="p-4">
    <div className="flex w-full justify-between px-4">


      <div className="flex flex-col gap-2 px-6 items-center">


        <h1 className="text-xl font-bold ">Welcome, {session?.user?.name}</h1>
        <p>
          Let's start the FamCare Journey
        </p>
      </div>
      <Button asChild>
        <Link to='/app/home'>
          Skip
        </Link>

      </Button>
    </div>

    <div className="flex flex-col justify-center items-center  w-full gap-2 mt-10 overflow-hidden">

      <div className="flex gap-2 w-full max-w-md justify-between items-center ">
        <Button
          className="secondary-button"
          disabled={currentStep === 0}
          onClick={() => {
            if (currentStep === 0) {
              return;
            }
            setCurrentStep((prev) => prev - 1);
          }}
          title="back"
        >
          <ArrowLeft />
        </Button>
        <div className=" text-2xl ">
          Onboarding
        </div>
        <Button
          className="primary-button"
          disabled={currentStep === 2}
          onClick={() => {
            if (currentStep === 2) {

              setCurrentStep(0);
              return;
            }
            setCurrentStep((prev) => prev + 1);
          }}
          title="continue"

        >
          <ArrowRight />
        </Button>
      </div>
      <AnimatePresence

        mode="popLayout" initial={false}>
        <motion.div
          className=" w-full h-full flex justify-center overflow-hidden "
          key={currentStep}
          initial={{ y: "0%", opacity: 0 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ y: "10%", opacity: 0 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
        >
          {
            content
          }
        </motion.div>
      </AnimatePresence>



    </div>

  </div>
}
