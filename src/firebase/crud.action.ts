import { collection, getDocs } from "firebase/firestore";
import { db } from "./client";
import { Question } from "../types/type";

export async function loadQuestions(): Promise<Question[]> {
  const snapshot = await getDocs(collection(db, 'questions'));
  console.log("Fetched docs:", snapshot.docs.length);

  return snapshot.docs.map((doc) => {
    console.log("Doc data:", doc.data());
    const data = doc.data();
    return {
      id: Number(doc.id), // Watch out if doc.id isn't numeric
      question: data.question,
      options: data.options,
      answerIndex: data.answerIndex,
      concept: data.concept,
    };
  });
}
