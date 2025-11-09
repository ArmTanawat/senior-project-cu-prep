"use client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import FormField from "./FormField";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { useRouter } from "next/navigation";
import { generateQuestions } from "@/lib/actions/general.action";


const preInterviewFormSchema = z.object({
  type: z.string().min(2).max(100),
  role: z.string().min(2).max(100),
  level: z.string().min(2).max(100),
  techstack: z.string().min(2).max(100),
  amount: z.number().min(1),
  userid: z.string().min(2).max(100),
});

const PreInterviewForm = () => {
    const rounter = useRouter();
    const formSchema = preInterviewFormSchema;
      // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "",
      role: "",
      level: "",
      techstack: "",
      amount: 0,
      userid: "",
    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try{
        const { type, role, level, techstack, amount} = values;
        const userid = await getCurrentUser();
        if(!userid){
            toast.error("User not found. Please log in again.");
            rounter.push('/auth/sign-in');
            return;
        }
        const result = await generateQuestions({
            type,
            role,
            level,
            techstack,
            amount,
            userid: userid.id
        });
        if(!result){
            toast.error("There was an error generating questions. Please try again.");
            rounter.refresh();
            return;
        }
        toast.success("Questions generated successfully!");
        rounter.push('/');

    }catch(error){
        console.log(error);
        toast.error(`There was an error: ${error}`);
    }
  }
  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 mt-4 form"
          >

            <FormField
              control={form.control}
              name="type"
              label="Type"
              placeholder="Your email address"
              type="type"
            />

            <FormField
              control={form.control}
              name="role"
              label="role"
              placeholder="Enter your role here"
              type="role"
            />

            <FormField
              control={form.control}
              name="level"
              label="Level"
              placeholder="Enter your level here"
              type="level"
            />
            <FormField
              control={form.control}
              name="techstack"
              label="Tech Stack"
              placeholder="Enter your tech stack here"
              type="techstack"
            />
            <FormField
              control={form.control}
              name="amount"
              label="Amount"
              placeholder="Enter your amount here"
              type="amount"
            />

            <Button className="btn" type="submit">
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default PreInterviewForm 