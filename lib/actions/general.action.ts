"use server";

import { db } from "@/firebase/admin";
import { generateText} from "ai";
import { google } from "@ai-sdk/google";

export async function getInterviewsByUserId(
  userId: string
): Promise<Interview[] | null> {
  const logInterview = await db.collection("interviews").where("userId", "==", userId).get();
  
  console.log("log interview by id size",logInterview.size)
  logInterview.docs.forEach(doc => console.log(doc.id, doc.data()));

  const interviews = await db
    .collection("interviews")
    .where("userId", "==", userId)
    .orderBy("createAt", "desc")
    .get();
  console.log("interview by id size",interviews.size)
  interviews.docs.forEach(doc => console.log(doc.id, doc.data()));

  return interviews.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Interview[];
}

export async function getLatesetInverviews(params: GetLatestInterviewsParams): Promise<Interview[]| null> {
  const {userId, limit = 20} = params;
  const interviews = await db
    .collection('interviews')
    .orderBy('createAt', 'desc')
    .where('finalized','==',true)
    .where('userId','!=',userId)
    .limit(limit)
    .get();
    
  return interviews.docs.map((doc)=>({
    id:doc.id,
    ...doc.data()
  })) as Interview[]
}

export async function getInverviewsByID(id:string ): Promise<Interview| null> {
  const interviews = await db
    .collection('interviews')
    .doc(id)
    .get();
    
  return interviews.data() as Interview|null;
}

export async function generateQuestions(params: InterviewRequest){
    const { type, role, level, techstack, amount,userid}=params;

    try{
        const {text:questions} = await generateText({
            model: google('gemini-2.0-flash-001'),
            prompt: `Prepare questions for a job interview.
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techstack}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions required is: ${amount}.
        Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        Return the questions formatted like this:
        ["Question 1", "Question 2", "Question 3"]
        
        Thank you! <3
        `,
        });

        const interview = {
            role,type,level,
            techstack: techstack.split(','),
            questions: JSON.parse(questions),
            userId: userid,
            finalized: true,
            createAt: new Date().toISOString()
        }

        await db.collection("interviews").add(interview);

        return true;
    }catch(error){
        console.error(error);
        return false;
    }
}