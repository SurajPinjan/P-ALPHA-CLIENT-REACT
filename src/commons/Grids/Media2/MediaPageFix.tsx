import Button from "@mui/material/Button";
import React from "react";
import MediaGallaryFix from "../../Dialogues/MediaGallaryDialogueFix";

interface MediaGridFixWrapperProps {}

const MediaGridFixWrapper: React.FC<MediaGridFixWrapperProps> = () => {
  // constants

  // states
  const [entityId] = React.useState<number>(13);
  const [isOpen, setIsOpen] = React.useState(false);
  // constants

  // data operations
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
    </>
  );
};

export default MediaGridFixWrapper;
