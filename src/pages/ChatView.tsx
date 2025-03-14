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
  useIonLoading,
  IonAlert,
  IonItem,
  IonLabel,
  useIonRouter,
} from "@ionic/react";
import { refresh, sendOutline } from "ionicons/icons";
import React, { useEffect, useRef, useState } from "react";
import "../styles/chat-view.css";
import { Link, RouteComponentProps } from "react-router-dom";
import MessageInput from "@/components/ChatView/MessageInput";
import { getShadowColors } from "./Quiz";
import { CapacitorHttp, HttpResponse } from "@capacitor/core";
import { Directory, Filesystem } from "@capacitor/filesystem";
import { b64toBlob } from "@/components/GenerateQuiz/GenerateQuizForm";
import { getFileExtension } from "./NoteInput";
import { Network } from "@capacitor/network";
import { truncateText } from "@/utils/text-utils";

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
    content_text: "",
    note_name: "",
    content_pdf_url: "",
    note_id: 0,
  });

  const [isInitError, setIsInitError] = useState(false);

  const contentRef = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [limit] = useState(5);
  const [offset, setOffset] = useState(0);
  const [present, dismiss] = useIonLoading();
  const [isRefresh, setIsRefresh] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const router = useIonRouter();
  useIonViewWillEnter(() => {
    const fetchMessages = async () => {
      await present({ message: "Analyzing Notes..." });

      const conversationId = Number(match.params.id);

      setConversationId(conversationId);

      const note = await storageServ.noteRepo.getNoteByConversationId(
        conversationId
      );
      setBotColor(getShadowColors());
      setPersonColor(getShadowColors());
      setNoteData({
        content_text: note.content_text,
        note_name: note.note_name,
        content_pdf_url: note.content_pdf_url,
        note_id: note.note_id,
      });

      const messages =
        await storageServ.conversationRepo.getMessagesForConversation(
          conversationId
        );

      if (messages.length === 0) {
        // Create a FormData object and append necessary fields
        try {
          const networkStatus = await Network.getStatus();
          if (!networkStatus.connected) {
            await storageServ.conversationRepo.deleteConversation(
              conversationId
            );
            await dismiss();
            setIsError(true);
            setErrMsg(
              "No internet connection. Please check your network settings."
            );
            return;
          }
          let fileBlob: Blob | null = null;
          let filename: string | null = null;

          if (note.content_pdf_url) {
            let filePath = note.content_pdf_url;
            const fileResult = await Filesystem.readFile({
              path: note.content_pdf_url, // Relative path (e.g., folderName/file.name)
              directory: Directory.Data,
            });
            const base64Data = fileResult.data as any; // Base64 encoded string

            // Determine the file extension and MIME type
            const fileExtension = getFileExtension(
              note.note_name
            ).toLowerCase();
            const mimeType =
              fileExtension === "pdf"
                ? "application/pdf"
                : "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

            // Convert the Base64 string to a Blob.
            fileBlob = b64toBlob(base64Data, mimeType);
            filename = filePath.split("/").pop() || "uploadfile";
          }

          const formData = new FormData();
          if (fileBlob && filename) {
            formData.append("file", fileBlob, filename);
          }
          formData.append("message", note.content_text || "");
          formData.append("messageHistory", JSON.stringify([]));

          // If you have a file to send, append it like so:
          // formData.append("file", selectedFile);

          // Make the HTTP request

          const res = await fetch(
            "https://test-backend-9dqr.onrender.com/chat",
            {
              method: "POST",
              body: formData,
            }
          );

          if (!res.ok) {
            await storageServ.conversationRepo.deleteConversation(
              conversationId
            );
            await dismiss();
            const data = await res.json();
            setIsInitError(true);
            setIsError(true);
            setErrMsg(
              data?.message || data[0].message || "Chat Operation Error"
            );
            return;
          }
          console.log(res);
          const data = await res.json();

          const user_msg = await storageServ.conversationRepo.addMessage(
            conversationId,
            "PERSON",
            null
          );
          const bot_msg = await storageServ.conversationRepo.addMessage(
            conversationId,
            "BOT",
            data.response
          );
          messages.push(bot_msg);

          setMessages(messages);
        } catch (error) {
          console.log(error);
          setIsError(true);
          setErrMsg("Chat Operation Error");
        } finally {
          await dismiss();
        }
        await dismiss();
      } else {
        setMessages(messages.slice(1));
        await dismiss();
      }
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
    const networkStatus = await Network.getStatus();
    if (!networkStatus.connected) {
      setIsError(true);
      setErrMsg("No internet connection. Please check your network settings.");
      setIsSending(false);

      return;
    }
    let user_msg: iMessage;

    try {
      // Immediately add the user message to the messages array
      user_msg = await storageServ.conversationRepo.addMessage(
        conversationId,
        "PERSON",
        message
      );
      setMessages([...messages, user_msg]);
      setMessage("");
      let fileBlob: Blob | null = null;
      let filename: string | null = null;
      let messageHistory = messages;
      // If a file path exists, read the file using Capacitor Filesystem.
      if (noteData.content_pdf_url) {
        // Remove any "file://" prefix if present.
        let filePath = noteData.content_pdf_url;
        if (filePath.startsWith("file://")) {
          filePath = filePath.replace("file://", "");
        }
        // Read the file from Directory.Documents (adjust if needed)
        const fileResult = await Filesystem.readFile({
          path: filePath, // Relative path (e.g., folderName/file.name)
          directory: Directory.Data,
        });
        const base64Data = fileResult.data as any; // Base64 encoded string

        // Determine MIME type based on file extension
        let mimeType = "application/octet-stream";
        if (filePath.toLowerCase().endsWith(".pdf")) {
          mimeType = "application/pdf";
        } else if (filePath.toLowerCase().endsWith(".docx")) {
          mimeType =
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        }

        // Convert the Base64 string to a Blob.
        fileBlob = b64toBlob(base64Data, mimeType);
        filename = filePath.split("/").pop() || "uploadfile";
      } else {
        messageHistory.unshift({
          conversation_id: conversationId,
          message_content: noteData.content_text,
          sender_type: "PERSON",
        });
      }

      // Create a FormData object and append necessary fields
      const formData = new FormData();
      if (fileBlob && filename) {
        formData.append("note", fileBlob, filename);
      }
      formData.append("message", message);
      formData.append("messageHistory", JSON.stringify(messageHistory));

      const res = await fetch("https://test-backend-9dqr.onrender.com/chat", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        await storageServ.conversationRepo.deleteMessage(
          user_msg.message_id as number
        );
        // Also remove it from the UI state
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => msg.message_id !== user_msg.message_id)
        );
        setIsError(true);
        setErrMsg("Send Failed");
        setIsSending(false);

        return;
      }
      const data = await res.json();

      const bot_msg = await storageServ.conversationRepo.addMessage(
        conversationId,
        "BOT",
        data.response
      );
      setMessages((prevMessages) => [...prevMessages, bot_msg]);
      setIsSending(false);
    } catch (error) {
      setIsError(true);
      setErrMsg("Send Failed");
      console.log("Error sending message:", error);
      setIsSending(false);
    }
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };
  const handleRefreshChat = async () => {
    // Create a FormData object and append necessary fields
    try {
      await present({ message: "Analyzing Notes..." });

      const networkStatus = await Network.getStatus();
      if (!networkStatus.connected) {
        await storageServ.conversationRepo.deleteConversation(conversationId);
        await dismiss();
        setIsError(true);
        setErrMsg(
          "No internet connection. Please check your network settings."
        );
        return;
      }
      let fileBlob: Blob | null = null;
      let filename: string | null = null;

      if (noteData.content_pdf_url) {
        let filePath = noteData.content_pdf_url;
        const fileResult = await Filesystem.readFile({
          path: noteData.content_pdf_url, // Relative path (e.g., folderName/file.name)
          directory: Directory.Data,
        });
        const base64Data = fileResult.data as any; // Base64 encoded string

        // Determine the file extension and MIME type
        const fileExtension = getFileExtension(
          noteData.note_name
        ).toLowerCase();
        const mimeType =
          fileExtension === "pdf"
            ? "application/pdf"
            : "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

        // Convert the Base64 string to a Blob.
        fileBlob = b64toBlob(base64Data, mimeType);
        filename = filePath.split("/").pop() || "uploadfile";
      }

      const formData = new FormData();
      if (fileBlob && filename) {
        formData.append("file", fileBlob, filename);
      }
      formData.append("message", noteData.content_text || "");
      formData.append("messageHistory", JSON.stringify([]));

      // If you have a file to send, append it like so:
      // formData.append("file", selectedFile);

      // Make the HTTP request

      const res = await fetch("https://test-backend-9dqr.onrender.com/chat", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        await storageServ.conversationRepo.deleteConversation(conversationId);
        await dismiss();
        const data = await res.json();
        setIsInitError(true);
        setIsError(true);
        setErrMsg(data?.message || data[0].message || "Refresh Failed");
        return;
      }
      console.log(res);
      const data = await res.json();

      await storageServ.conversationRepo.deleteMessagesExceptFirstTwo(
        conversationId
      );
      const bot_msg = await storageServ.conversationRepo.addMessage(
        conversationId,
        "BOT",
        data.response
      );
      setMessages(() => [bot_msg]);
    } catch (error) {
      console.log(error);
      setIsError(true);
      setErrMsg("Refresh Failed");
    } finally {
      await dismiss();
    }
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
        // height: "100vh",
      }}
    >
      <IonContent
        style={{
          display: "flex",
          flexDirection: "column",
          // height: "100vh",
          overflow: "hidden",
        }}
      >
        <Header
          backRoute={"/chats"}
          nameComponent={
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "20px",
                gap: 5,
              }}
            >
              <button
                className="refresh-chat-btn"
                onClick={() => {
                  setIsRefresh(true);
                }}
              >
                <IonIcon icon={refresh}></IonIcon>
              </button>
              <Link
                to={`/note/${noteData.note_id}`}
                style={{
                  alignSelf: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textDecoration: "underline",
                  color: "black",
                }}
              >
                {truncateText(noteData.note_name, 15, 15)}
              </Link>
            </div>
          }
        />
        <IonAlert
          isOpen={isRefresh}
          header="Do you want to RESET this chat?"
          buttons={[
            { text: "No", role: "cancel" },
            {
              cssClass: "alert-button-confirm",
              text: "Yes",
              role: "confirm",
              handler: handleRefreshChat,
            },
          ]}
          onDidDismiss={() => {
            setIsRefresh(false);
          }}
        ></IonAlert>
        <section
          ref={contentRef}
          style={{
            height: isSending ? "70%" : "78%",
            display: "flex",
            flexDirection: "column", // Allow for child elements to stack vertically
            padding: "10px",
            overflowY: "scroll",
          }}
        >
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

        {isSending && (
          <IonItem>
            <IonSpinner name="dots" />
          </IonItem>
        )}

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
      <IonAlert
        isOpen={isError}
        header={errMsg}
        buttons={[
          {
            text: "Okay",
            role: "cancel",
            handler: () => {
              if (isInitError) {
                router.goBack();
                setIsInitError(false);
              }
            },
          },
        ]}
        onDidDismiss={() => setIsError(false)}
      ></IonAlert>
    </IonPage>
  );
};

export default ChatView;
