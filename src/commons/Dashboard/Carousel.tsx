import Box from "@mui/material/Box";
import * as React from "react";
// import Paper from '@mui/material/Paper';
// import Typography from '@mui/material/Typography';
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import { XView } from "../../models/X";

function SwipeableTextMobileStepper(props: { baners: XView[] | undefined }) {
  const handleDragStart = (e: unknown) => {
    if (e instanceof Event) e.preventDefault();
  };

  const items: React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  >[] = [
    <img
      src="http://localhost:3001/uploads/istockphoto-5.jpg"
      onDragStart={handleDragStart}
      role="presentation"
    />,
    <img
      src="http://localhost:3001/uploads/istockphoto-3.jpg"
      onDragStart={handleDragStart}
      role="presentation"
    />,
    <img
      src="http://localhost:3001/uploads/istockphoto-4.jpg"
      onDragStart={handleDragStart}
      role="presentation"
    />,
  ];

  // States
  // const [activeStep, setActiveStep] = React.useState(0);
  const [banners] = React.useState<XView[] | undefined>(props.baners);

  // constants
  // const theme = useTheme();
  // const maxSteps = banners ? banners.length : 0;

  // const handleNext = () => {
  //   setActiveStep((prevActiveStep) => prevActiveStep + 1);
  // };

  // const handleBack = () => {
  //   setActiveStep((prevActiveStep) => prevActiveStep - 1);
  // };

  // const handleStepChange = (step: React.SetStateAction<number>) => {
  //   setActiveStep(step);
  // };

  return (
    <Box sx={{ maxWidth: "100%" }}>
      {banners && (
        <AliceCarousel
          items={items}
          autoPlay
          autoPlayInterval={2000}
        ></AliceCarousel>
      )}
      {/* <AutoPlaySwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={activeStep}
        onChangeIndex={handleStepChange}
        enableMouseEvents
      >
        {banners && (banners.length > 0) && banners.map((step: XView, index) => (
          <div key={step.uid}>
            {Math.abs(activeStep - index) <= 2 ? (
              <Box
                component="img"
                sx={{
                  height: 455,
                  display: 'block',
                  overflow: 'hidden',
                  width: '100%',
                  objectFit: 'cover',
                }}
                src={step.url}
                alt={step.url}
              />
            ) : null}
          </div>
        ))}
      </AutoPlaySwipeableViews> */}
      {/* <MobileStepper
        steps={maxSteps}
        position="static"
        activeStep={activeStep}
        nextButton={
          <Button
            size="small"
            onClick={handleNext}
            disabled={activeStep === maxSteps - 1}
          >
            Next
            {theme.direction === "rtl" ? (
              <KeyboardArrowLeft />
            ) : (
              <KeyboardArrowRight />
            )}
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            {theme.direction === "rtl" ? (
              <KeyboardArrowRight />
            ) : (
              <KeyboardArrowLeft />
            )}
            Back
          </Button>
        }
      /> */}
    </Box>
  );
}

export default SwipeableTextMobileStepper;
