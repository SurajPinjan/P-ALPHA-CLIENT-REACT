import Button from "@mui/material/Button";
import React from "react";
import MediaGallary from "../Dialogues/MediaGallaryDialogue";

interface MediaGridWrapperProps {}

const MediaGridWrapper: React.FC<MediaGridWrapperProps> = () => {
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
      <MediaGallary
        url={entityId.toString()}
        isOpen={isOpen}
        onClose={onClose}
      ></MediaGallary>
      <Button type="button" onClick={onShow}>
        {" "}
        SHOW
      </Button>
      {/* <Formik
        initialValues={{
          entityId: -1,
        }}
        onSubmit={(
          values: { entityId: number },
          { setSubmitting }: FormikHelpers<{ entityId: number }>
        ) => {
          setEntityId(values.entityId);
          setSubmitting(false);
        }}
        render={({ submitForm }) => {
          return (
            <React.Fragment>
              <Form>
                <FormControl variant="standard" sx={{ minWidth: "100%" }}>
                  <Field
                    as={TextField}
                    name="entityId"
                    type="number"
                    style={{ width: "100%" }}
                    label="Entity Id"
                    variant="standard"
                  />
                  <ErrorMessage
                    component="div"
                    className="error"
                    name="selectedOption"
                  />
                </FormControl>
                <Button type="button" onChange={submitForm}>
                  Change
                </Button>
              </Form>
            </React.Fragment>
          );
        }}
      ></Formik> */}
    </>
  );
};

export default MediaGridWrapper;
