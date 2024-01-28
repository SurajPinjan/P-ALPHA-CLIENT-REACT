import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import { CardProps } from '../../types/types';
const cardStyle = {
  maxWidth: '100%'
};


export default function ActionAreaCard(props: CardProps) {
  return (
    <Card style={cardStyle} >
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image={props.url}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div" style={{ color: '#115E6E', fontSize: 18 }}>
            {props.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {props.description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}