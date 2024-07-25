import Button from "@mui/material/Button";
import React from "react";
import MediaGallaryFix from "../../Dialogues/MediaGallaryDialogueFix";
import { HttpMailRequestBody, HttpRequestData, HttpResponseGetAll } from "../../../types/httpTypes";
import { ENTITY_NAME, HTTP_METHOD, OPERATION } from "../../../types/enums";
import { makeHttpCall } from "../../../services/ApiService";
import { useNavigate } from "react-router-dom";
import store from "../../../services/GlobalStateService";

interface MediaGridFixWrapperProps { }

const MediaGridFixWrapper: React.FC<MediaGridFixWrapperProps> = () => {
  // constants
  const navigate = useNavigate();
  // states
  const [entityId] = React.useState<number>(13);
  const [isOpen, setIsOpen] = React.useState(false);
  // constants

  // data operations
  const sendMail = React.useCallback(async () => {
    const requestData: HttpRequestData<HttpMailRequestBody> = {
      entityName: ENTITY_NAME.MAIL,
      method: HTTP_METHOD.POST,
      operation: OPERATION.SEND_MAIL,
      body: {
        subject: 'TESTING THE MAILING API',
        text: 'MAIL SENT OK',
        to: ['surajbpinjan92@gmail.com'],
      },
    };

    makeHttpCall<HttpResponseGetAll<{ empty: string }>, HttpMailRequestBody>(
      requestData,
      store,
      navigate
    );

  }, [navigate]);


  // anonymous functions

  // event handlers
  const onClose = () => {
    setIsOpen(false);
  };

  const onShow = () => {
    setIsOpen(!isOpen);
  };

  // hooks

  //   useEffect(() => {
  //     if (entityId !== -1) setIsOpen(true);
  //   }, [entityId]);

  //   useEffect(() => {
  //     setEntityId(2);
  //   }, []);

  // dom

  return (
    <>
      <MediaGallaryFix
        url={entityId.toString()}
        isOpen={isOpen}
        onClose={onClose}
      ></MediaGallaryFix>
      <Button type="button" onClick={onShow}>
        {" "}
        SHOW
      </Button>
      <Button type="button" onClick={sendMail}>
        {" "}
        SEND MAIL
      </Button>
    </>
  );
};

export default MediaGridFixWrapper;
