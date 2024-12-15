"use client";
import { db } from "@/firebase";
import { Message } from "@/type";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { ImArrowUpRight2 } from "react-icons/im";
import { TbPaperclip } from "react-icons/tb";
import ModelSelection from "./ModelSelection";
import useSWR from "swr";

const ChatInput = ({ id }: { id?: string }) => {
  const chatId = id;
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(""); // State to hold the response from the backend

  const { data: model } = useSWR("model", {
    fallbackData: "gpt-4-turbo",
  });

  const userEmail = session?.user ? (session?.user?.email as string) : "unknown";
  const userName = session?.user ? (session?.user?.email as string) : "unknown";

  const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!prompt.trim()) {
      toast.error("Prompt cannot be empty.");
      return;
    }

    const input = prompt.trim();
    const message: Message = {
      text: input,
      createdAt: serverTimestamp(),
      user: {
        _id: userEmail,
        name: userName,
        avatar:
          session?.user?.image ||
          "https://avatarfiles.alphacoders.com/254/254096.png",
      },
    };

    try {
      setLoading(true);
      let chatDocumentId = chatId;

      // Create a new chat if no ID is provided
      if (!chatId) {
        const docRef = await addDoc(
          collection(db, "users", userEmail, "chats"),
          {
            userId: userEmail,
            createdAt: serverTimestamp(),
          }
        );
        chatDocumentId = docRef.id;
        router.push(`/chat/${chatDocumentId}`);
      }

      // Add the message to Firestore
      await addDoc(
        collection(
          db,
          "users",
          userEmail,
          "chats",
          chatDocumentId as string,
          "messages"
        ),
        message
      );
      setPrompt("");

      // Build and validate the payload
      const payload = {
        prompt: input,
        id: chatDocumentId,
        model: model || "gpt-4-turbo",
        session: userEmail,
      };

      console.log("Sending payload:", payload);

      if (!payload.prompt || !payload.id || !payload.model || !payload.session) {
        throw new Error("Invalid payload structure");
      }

      // Send request to backend API
      const response = await fetch("/api/askchat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data?.message || "Response received.");
        setResponse(data?.answer || "No answer received."); // Set the response from backend
      } else {
        console.error("API Error:", data);
        toast.error(data?.message || "Failed to process request.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center max-w-3xl mx-auto pt-3">
      <form
        onSubmit={sendMessage}
        className="bg-white/10 rounded-full flex items-center px-4 py-2.5 w-full"
      >
        <TbPaperclip className="text-2xl -rotate-45 text-primary-foreground" />
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Message ChatGPT"
          className="bg-transparent text-primary-foreground font-medium placeholder:text-primary-foreground/50 px-3 outline-none w-full"
          disabled={loading}
        />
        <button
          disabled={!prompt || loading}
          type="submit"
          className={`p-2.5 rounded-full text-black flex items-center justify-center transition-transform duration-200 bg-white disabled:bg-white/30`}
        >
          <ImArrowUpRight2 className="-rotate-45 text-sm text-primary/80" />
        </button>
      </form>

      {id && (
        <p className="text-xs mt-2 font-medium tracking-wide">
          ChatGPT can make mistakes. Check important info.
        </p>
      )}

      {response && (
        <div className="mt-4 text-lg font-semibold">
          <p>{response}</p> {/* Display response directly */}
        </div>
      )}

      <div className="w-full md:hidden mt-2">
        <ModelSelection />
      </div>
    </div>
  );
};

export default ChatInput;