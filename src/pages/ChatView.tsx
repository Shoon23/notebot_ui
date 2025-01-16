import MessageCard from "@/components/ChatView/MessageCard";
import Header from "@/components/Header";
import useStorageService from "@/hooks/useStorageService";
import { iMessage } from "@/repository/ConversationRepository";
import {
  IonPage,
  IonContent,
  IonIcon,
  useIonViewWillEnter,
  IonSpinner,
} from "@ionic/react";
import { sendOutline } from "ionicons/icons";
import React, { useEffect, useRef, useState } from "react";
import "../styles/chat-view.css";
import { RouteComponentProps } from "react-router-dom";
import MessageInput from "@/components/ChatView/MessageInput";
import { getShadowColors } from "./Quiz";
import { CapacitorHttp, HttpResponse } from "@capacitor/core";

const greetings: string[] = [
  "Good day! How can I assist you with your class notes today?",
  "Hello! Feel free to upload your notes, and let me know what you’d like help with.",
  "Hi there! I’m here to help you with any questions you have about your class materials.",
  "Greetings! If you have any questions regarding your notes, I’m ready to assist.",
  "Hello! Let’s dive into your notes—how can I help you today?",
];

interface ChatViewProp
  extends RouteComponentProps<{
    id: string;
  }> {}

const ChatView: React.FC<ChatViewProp> = ({ match }) => {
  const storageServ = useStorageService();
  const [messages, setMessages] = useState<iMessage[]>([]);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [personColor, setPersonColor] = useState("");
  const [botColor, setBotColor] = useState("");
  const [conversationId, setConversationId] = useState(0);
  const [noteData, setNoteData] = useState({
    note: "",
    note_name: "",
  });

  const contentRef = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [limit] = useState(5);
  const [offset, setOffset] = useState(0);
  useIonViewWillEnter(() => {
    const fetchMessages = async () => {
      const conversationId = Number(match.params.id);

      setConversationId(conversationId);

      const note = await storageServ.noteRepo.getNoteByConversationId(
        conversationId
      );

      setBotColor(getShadowColors());
      setPersonColor(getShadowColors());
      setNoteData({
        note: note.content_text,
        note_name: note.note_name,
      });

      const messages =
        await storageServ.conversationRepo.getMessagesForConversation(
          conversationId
        );

      if (messages.length === 0) {
        const randomIndex = Math.floor(Math.random() * greetings.length);
        const greeting = greetings[randomIndex];

        const save_ms = await storageServ.conversationRepo.addMessage(
          conversationId,
          "BOT",
          greeting
        );
        messages.push(save_ms);
      }

      setMessages(messages);
    };
    fetchMessages();
  }, []);
  // Fetch messages with pagination
  const fetchMessages = async (newOffset: number) => {
    try {
      setIsLoading(true);
      const olderMessages =
        await storageServ.conversationRepo.getMessagesForConversation(
          conversationId,
          limit,
          newOffset
        );
      if (olderMessages.length > 0) {
        setMessages((prevMessages) => [...olderMessages, ...prevMessages]);
        setOffset((prevOffset) => prevOffset + olderMessages.length);
      }
    } catch (error) {
      console.error("Error fetching older messages:", error);
    } finally {
      setIsLoading(false);
    }
  };
  // Scroll event listener
  const handleScroll = () => {
    if (contentRef.current && contentRef.current.scrollTop === 0) {
      // fetchMessages(offset);
    }
  };
  // Attach scroll listener
  useEffect(() => {
    const section = contentRef.current;
    if (section) {
      section.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (section) {
        section.removeEventListener("scroll", handleScroll);
      }
    };
  }, [offset, isLoading]);

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSending(true);
    try {
      // Immediately add the user message to the messages array

      const user_msg = await storageServ.conversationRepo.addMessage(
        conversationId,
        "PERSON",
        message
      );
      setMessages([...messages, user_msg]);
      setMessage("");

      // Prepare the request options
      const options = {
        url: "https://test-backend-9dqr.onrender.com/chat",
        headers: {
          "Content-Type": "application/json", // Set the content type to JSON
        },
        data: {
          message: message, // Send the user message
          messageHistory: messages.slice(1), // Send all messages
          note: noteData.note, // Additional data like note if needed
        },
      };

      // Make the HTTP request
      const response: HttpResponse = await CapacitorHttp.post(options);
      const data = response.data;

      const bot_msq = await storageServ.conversationRepo.addMessage(
        conversationId,
        "BOT",
        data.response
      );

      setTimeout(() => {
        setMessages((prevMessages) => [...prevMessages, bot_msq]);
      }, 1000); // Simulate a 1-second delay per chunk
      setIsSending(false);
    } catch (error) {
      console.log("Error sending message:", error);
    }
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [messages]);
  return (
    <IonPage
      style={{
        overflow: "hidden",
        height: "100vh",
      }}
    >
      <IonContent
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <Header
          backRoute={"/chats"}
          nameComponent={
            <h1
              style={{
                alignSelf: "center",
                marginTop: "60px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {}
            </h1>
          }
        />

        <section
          ref={contentRef}
          style={{
            height: "80%",
            display: "flex",
            flexDirection: "column", // Allow for child elements to stack vertically
            padding: "10px",
            overflowY: "scroll",
          }}
        >
          {isLoading && (
            <div
              style={{
                alignSelf: "center",
                marginBottom: "10px",
              }}
            >
              <IonSpinner></IonSpinner>
            </div>
          )}

          {messages.map((msg, index) => {
            return (
              <MessageCard
                key={index}
                data={msg}
                shadowColors={{
                  personColor,
                  botColor,
                }}
              />
            );
          })}
        </section>

        <form
          onSubmit={handleSendMessage}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: 10,
            gap: 10,
          }}
        >
          <MessageInput
            value={message}
            handleOnChangeName={handleOnChange}
            placeHolder={"Ask Here"}
            label={""}
          />
          <button className="send-msg-btn" disabled={isSending}>
            <IonIcon
              slot="icon-only"
              icon={sendOutline}
              style={{
                fontSize: "30px",
              }}
            ></IonIcon>
          </button>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default ChatView;
