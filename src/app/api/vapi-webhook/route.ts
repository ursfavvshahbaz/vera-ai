import { NextResponse } from 'next/server';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Vapi 'end-of-call-report' bhejta hai
    if (body.message.type === "end-of-call-report") {
      const callData = body.message.call;
      const analysis = body.message.analysis;

      // Firestore mein Admin Table ke liye data save karna
      await addDoc(collection(db, "interview_reports"), {
        userId: callData.customer?.number || "dummy-id",
        userName: callData.customer?.name || "Anonymous",
        userEmail: callData.customer?.extension || "N/A",
        role: callData.assistant?.name || "Technical Role",
        duration: `${Math.round(callData.duration)}s`,
        status: "Completed",
        score: analysis?.structuredData?.score || "0", // Dashboard sync
        transcript: analysis?.transcript || "",
        createdAt: serverTimestamp(),
      });
    }

    return NextResponse.json({ message: "Webhook received" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Webhook Error" }, { status: 500 });
  }
}