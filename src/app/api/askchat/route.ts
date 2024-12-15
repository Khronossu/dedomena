import { NextRequest, NextResponse } from "next/server";
import query from "@/src/lib/queryApi";

export const POST = async (req: NextRequest) => {
  try {
    const reqBody = await req.json();
    const { prompt, id, model } = reqBody;

    console.log("Received payload:", reqBody);

    // Directly query the model and return the response
    const response = await query(prompt, id, model);

    if (!response) {
      return NextResponse.json(
        {
          error: "Failed to get a valid response from ChatGPT.",
          message: "No response was generated due to an error.",
        },
        { status: 500 }
      );
    }

    // Return the response directly without Firestore logic
    return NextResponse.json(
      {
        answer: response,
        message: "ChatGPT has responded.",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      {
        error: "An unexpected error occurred.",
        message: error.message || "Unknown error.",
      },
      { status: 500 }
    );
  }
};