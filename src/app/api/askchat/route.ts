import query from "@/src/lib/queryApi";
import { NextRequest, NextResponse } from "next/server";
import admin from "firebase-admin";
import { Message } from "@/type";
import { adminDB } from "@/firabaseAdmin";

export const POST = async (req: NextRequest) => {
  const reqBody = await req.json();

  const { prompt, id, model, session } = await reqBody;

  try {
    if (!prompt) {
      return NextResponse.json(
        {
          message: "Please provide a propmt!",
        },
        { status: 400 }
      );
    }

    if (!id) {
      return NextResponse.json(
        {
          message: "Please provide a valid chat ID!",
        },
        { status: 400 }
      );
    }

    const response = await query(prompt, id, model);

    const message: Message = {
      text: response || "DedomenaLLM was unable to find an answer for that!",
      createdAt: admin.firestore.Timestamp.now(),
      user: {
        _id: "ChatGPT",
        name: "Dedomena",
        avatar:
          "https://pbs.twimg.com/profile_images/954494635153543169/OIYn9cYM_400x400.jpg",
      },
    };

    await adminDB
      .collection("users")
      .doc(session)
      .collection("chats")
      .doc(id)
      .collection("messages")
      .add(message);

    return NextResponse.json(
      {
        answer: message?.text,
        message: "Dedomena has responded!",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
};
