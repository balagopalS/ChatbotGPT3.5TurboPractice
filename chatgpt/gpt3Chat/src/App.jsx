//this is packaged with vite so keep that in mind while cloning
import { useState } from "react";
import "./App.css";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
  Avatar,
  ConversationHeader,
} from "@chatscope/chat-ui-kit-react";

const API_KEY = "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";
const avatarIco =
  "https://chatscope.io/storybook/react/static/media/zoe.e31a4ff8.svg";

function App() {
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      message: "Hellooo!!!",
      sender: "GPT3.5Turbo",
    },
  ]);

  const handleSend = async (message) => {
    const newMessage = {
      message: message,
      sender: "user",
      direction: "outgoing",
    };

    const newMessages = [...messages, newMessage];
    setMessages(newMessages);

    setTyping(true);
    //calling with newmessages instead of messages becasue react would'nt have updated the states yet
    await processMessageTogpt3(newMessages);
  };

  async function processMessageTogpt3(chatMessages) {
    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "GPT3.5Turbo") {
        role = "assistant";
      } else role = "user";
      console.log("Your Message : ", messageObject.message);
      return { role: role, content: messageObject.message };
    });

    //sytemmessage config edit this for context change
    const systemMessage = {
      role: "system",
      content:
        "I will call you Ryuko, You are a personal assistant named Ryuko, help out with whatever query you are given",
    };

    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [...apiMessages],
    };

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        // console.log(data);
        console.log("Reply from Ruko: ", data.choices[0].message.content);
        setMessages([
          ...chatMessages,
          {
            message: data.choices[0].message.content,
            sender: "GPT3.5Turbo",
          },
        ]);
        setTyping(false);
      });
  }

  return (
    <div className="App">
      <div
        style={{
          postion: "relative",
          height: "900px",
          width: "1080px",
          borderRadius: "30px",
          color: "white",
          padding: "30px",
        }}
      >
        <MainContainer>
          <ChatContainer>
            <ConversationHeader>
              <ConversationHeader.Content
                userName="Ryuko / ChatGPT3.5Turbo"
                info="Ask her anything..."
              />
            </ConversationHeader>
            <MessageList
              scrollBehavior="smooth"
              typingIndicator={
                typing ? <TypingIndicator content="Ryuko is typing..." /> : null
              }
            >
              {messages.map((message, i) => {
                return (
                  <Message key={i} model={message}>
                    {message.sender === "GPT3.5Turbo" ? (
                      <Avatar src={avatarIco} name={"Zoe"} status="available" />
                    ) : null}
                  </Message>
                );
              })}
            </MessageList>
            <MessageInput placeholder="Type Message" onSend={handleSend} />
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  );
}

export default App;
