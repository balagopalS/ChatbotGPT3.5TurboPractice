// This is packaged with Vite, so keep that in mind while cloning

// Importing useState hook from the React library
import { useState } from "react";

// Importing CSS files
import "./App.css";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";

// Importing components from the Chat UI Kit library
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

// API key for OpenAI, replace with yours
const API_KEY = "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";

// URL for the avatar icon
const avatarIco =
  "https://chatscope.io/storybook/react/static/media/zoe.e31a4ff8.svg";

// Main component
function App() {
  // State variables
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      message: "Hellooo!!! ask me anything",
      sender: "GPT3.5Turbo",
    },
  ]);

  // Function to handle sending a message
  const handleSend = async (message) => {
    // Creating a new message object
    const newMessage = {
      message: message,
      sender: "user",
      direction: "outgoing",
    };

    // Updating the messages state with the new message
    const newMessages = [...messages, newMessage];
    setMessages(newMessages);

    // Set typing state to true
    setTyping(true);

    // Calling the function to process the message using GPT-3.5 Turbo
    // Using newMessages instead of messages because React wouldn't have updated the state yet
    await processMessageToGpt3(newMessages);
  };

  // Function to process messages using GPT-3.5 Turbo
  async function processMessageToGpt3(chatMessages) {
    // Transforming the chat messages into a format suitable for the OpenAI API
    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "GPT3.5Turbo") {
        role = "assistant";
      } else {
        role = "user";
      }
      console.log("Your Message : ", messageObject.message);
      return { role: role, content: messageObject.message };
    });

    // System message configuration, can be edited for different contexts
    const systemMessage = {
      role: "system",
      content:
        "You are a personal assistant, you can answer any question or queries",
    };

    // Building the request body for the OpenAI API
    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [...apiMessages],
    };

    // Sending a POST request to the OpenAI API
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
        // Logging the response from the GPT-3.5 Turbo model
        console.log("Reply from gpt3: ", data.choices[0].message.content);

        // Updating the messages state with the response from the model
        setMessages([
          ...chatMessages,
          {
            message: data.choices[0].message.content,
            sender: "GPT3.5Turbo",
          },
        ]);

        // Set typing state to false
        setTyping(false);
      });
  }

  // Rendering the UI components
  return (
    <div className="App">
      <div
        style={{
          position: "relative",
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
                userName="ChatGPT3.5Turbo"
                info="Ask anything..."
              />
            </ConversationHeader>
            <MessageList
              scrollBehavior="smooth"
              typingIndicator={
                typing ? <TypingIndicator content="gpt3 is typing..." /> : null
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
