import SendIcon from '@mui/icons-material/Send';
import UploadIcon from '@mui/icons-material/Upload';
import { Card, CardContent, IconButton, List, ListItem, ListItemText, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import React, { ChangeEvent } from "react";
import FileUploadChatBot from "../../../commons/Dialogues/FileUploadChatBot";
import { BLANK } from "../../../types/enums";
import { FileInfo } from "../../../types/types";


type USER = "ai" | "me";

interface Message {
  user: USER;
  text: string;
}

function ChatInterface() {

  const [messages, setMessages] = React.useState<Message[]>([]);
  const [prompt, setPrompt] = React.useState<string>(BLANK);
  const [isOpenUpload, setIsOpenUpload] = React.useState(false);


  const addMessage = () => {
    setMessages([...messages, { text: prompt, user: 'me' }]);
  };

  const onClose = () => {
    setIsOpenUpload(false);
  };

  return (
    <>
      <FileUploadChatBot
        isOpen={isOpenUpload}
        onClose={onClose}
        onUpload={(data: FileInfo | undefined) => {
          if (data) {
            alert(data.filename);
          }
        }}
        onSave={onClose}
      ></FileUploadChatBot>
      <Box>
        <Card >
          <CardContent  style={{ height: 'calc(100vh - 15rem)', overflow: 'auto' }}>
            <>
              <List>
                {messages.map((message, index) => (
                  <ListItem key={index} sx=
                    {{
                      display: "flex",
                      textAlign: message.user === "ai" ? "left" : "right"
                    }}
                  >
                    <ListItemText primary={message.text} secondary={message.user} />
                  </ListItem>
                ))}
              </List>
            </>
          </CardContent>
        </Card>
      </Box>
      <Box sx={{ marginTop: 4 }}>
        <Card>
          <CardContent>
            <TextField sx={{ display: 'flex', maxWidth: '80vw' }} label="Type your message here" value={prompt} onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
              setPrompt(e.target.value);
            }} />
            <div style={{ display: 'flex' }}>
              <IconButton onClick={() => addMessage()}>
                <SendIcon sx={{ color: 'black' }} />
              </IconButton>
              <IconButton onClick={() => setIsOpenUpload(true)}>
                <UploadIcon sx={{ color: 'black' }} />
              </IconButton>
            </div>

          </CardContent>
        </Card>
      </Box>
    </>
  );
}
export default ChatInterface;
