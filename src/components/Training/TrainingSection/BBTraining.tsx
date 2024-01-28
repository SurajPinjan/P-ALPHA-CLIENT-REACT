import { Card, CardContent, Grid, Typography } from "@mui/material";

interface VideoCardData {
    title: string,
    videoLink: string
}

function BBTraining() {

    const videoData: VideoCardData[] = [
        {
            title: 'What is Lean',
            videoLink: 'https://drive.google.com/file/d/11bm0qufXQPNIcr2vA_hSmT3dTEwSe_jM/preview'
        },
        {
            title: 'Boeing Assembly',
            videoLink: 'https://drive.google.com/file/d/17DytzxRCJvrrjk1g37LuhK2Xpu9_6CNN/preview'
        },
        {
            title: 'TPS',
            videoLink: 'https://drive.google.com/file/d/1V01tw-UfoAo0WyFEjEh0fCJgoCUrYbHI/preview'
        },
        {
            title: 'Formula 1 Pit Stops 1950 & 2013',
            videoLink: 'https://drive.google.com/file/d/10FEX7VaX8g2YQX57wclgyqkPlyhKpj3P/preview'
        }
    ];

    return (
        <>
            <Grid container spacing={2}>
                {getGridItem(videoData[0])}
                {getGridItem(videoData[1])}
                {getGridItem(videoData[2])}
                {getGridItem(videoData[3])}
            </Grid>
        </>
    );

    function getGridItem(videoData: VideoCardData) {
        return <Grid item xs={4}>
            <Card>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div" style={{ color: '#115E6E', fontSize: 18 }}>{videoData.title} </Typography>
                    <iframe src={videoData.videoLink} width={'100%'} allow="autoplay"></iframe>
                </CardContent>
            </Card>
        </Grid>;
    }
}
export default BBTraining;