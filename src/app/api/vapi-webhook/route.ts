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
      await addDoc(collection(db, "admin_logs"), {
        userName: callData.customer?.name || "Anonymous",
        userEmail: callData.customer?.extension || "N/A",
        role: callData.assistant?.name || "Technical Role",
        duration: `${Math.round(callData.duration)}s`,
        status: "Completed",
        score: analysis?.structuredData?.score || "N/A", // Dashboard sync
        transcript: analysis?.transcript || "",
        timestamp: serverTimestamp(),
      });
    }

    return NextResponse.json({ message: "Webhook received" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Webhook Error" }, { status: 500 });
  }
}