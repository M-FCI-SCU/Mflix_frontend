import * as React from 'react';
import Moment from 'react-moment';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
//import CardMedia from '@mui/material/CardMedia';
//import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
//import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import { ThumbUp, Comment, Share, Delete } from '@mui/icons-material';
import { imageNotFound } from "../utils/images"
import { Avatar, Collapse, Divider, Grid, Paper, TextField, Box, IconButton } from '@mui/material';
import { deepOrange, deepPurple } from '@mui/material/colors';
import { gql, useMutation, useSubscription } from '@apollo/client';
import { useAuth } from "../context/AuthContext"
// Define mutation
const CREATE_COMMENT = gql`
  mutation CreateCommentQuery($content: CommentPayload) {
    createComment(content: $content){
      name
    }
  }
`;

const DELETE_COMMENT = gql`
mutation DeleteCommentQuery($movieId: String, $commentId: String) {
  deleteComment(movieId: $movieId, commentId: $commentId){
    _id
    movie_id
  }
}
`;

export default function MediaCard({ movie, openAlertDialog }) {
  const [createComment] = useMutation(CREATE_COMMENT);
  const [deleteComment, { data, error }] = useMutation(DELETE_COMMENT);
  const [poster, setPoster] = React.useState(null)
  const [commentText, setCommentText] = React.useState("")
  const [commentToggle, setCommentToggle] = React.useState(false)
  const { user } = useAuth()
  React.useEffect(() => {
    async function fetchData() {
      try {
        if (movie.poster == null) return
        await fetch(movie.poster)
        setPoster(movie.poster)
      } catch (error) {
        //console.log(error)
      }
    }
    fetchData();

  }, [])

  const checkCommentEnterHandler = (event) => {
    if (event.key != 'Enter') {
      return
    } else if (event.key == 'Enter' && event.shiftKey) {
      return
    }
    event.preventDefault()
    let comment = commentText
    setCommentText("")
    createComment({
      variables:
      {
        content:
          { text: comment, movie_id: movie._id, name: user.email, email: user.email }
      }
    })
  }
  const deleteCommentHandler = async (comment) => {
    try {
      await deleteComment({ variables: { movieId: movie._id, commentId: comment._id } })
    } catch (err) {
      console.log(err.message)
      openAlertDialog(err.message)
    }
  }

  return (
    <Card sx={{ marginBottom: '20px' }}>
      <div
        style={{
          position: 'relative',
          backgroundImage: `url(${poster ? poster : imageNotFound})`,
          width: '100%',
          height: '350px',
          backgroundSize: '100% 100%',
        }}
        alt="green iguana"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {movie.title} ({movie.year})
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {movie.fullplot}
        </Typography>
      </CardContent>
      <Divider />
      <CardActions>
        <Button fullWidth startIcon={<ThumbUp />}>
          Like
        </Button>
        <Button fullWidth startIcon={<Comment />} onClick={() => setCommentToggle(!commentToggle)}>
          Comment
        </Button>
        <Button fullWidth startIcon={<Share />}>
          Share
        </Button>
      </CardActions>
      <Divider />
      <Collapse in={commentToggle} timeout="auto" unmountOnExit>
        <CardActions>
          <Avatar sx={{ bgcolor: deepPurple[500], width: 56, height: 56 }}>OP</Avatar>
          <TextField
            id="outlined-textarea"
            placeholder="Comment"
            multiline
            size="small"
            fullWidth
            onKeyPress={checkCommentEnterHandler}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
        </CardActions>
        {movie.comments.length ? <CardContent>
          {movie.comments.map(comment => <div style={{ marginBottom: '14px' }} key={comment._id}>
            <Grid container>
              <Grid item xs={1} >
                <Avatar>{comment.name.substring(0, 1).toUpperCase()}</Avatar>
              </Grid>
              <Grid item xs={10}>
                <span style={{
                  wordBreak: 'break-all',
                  display: 'inline-block',
                  backgroundColor: '#F0F2F5',
                  padding: '5px 15px 15px 15px',
                  borderRadius: '12px'
                }}>
                  <Box sx={{
                    display: 'flex', justifyContent: 'space-between'
                  }}>
                    <Typography variant="h6" component="div">{comment.name}</Typography>
                    {(user.email == comment.email) && <IconButton onClick={() => deleteCommentHandler(comment)} color="primary" aria-label="delete comment" component="span"><Delete></Delete></IconButton>}
                  </Box>
                  {comment.text}
                </span>
                <Typography sx={{ml:'10px'}} variant="caption" display={"block"}>  <Moment interval={1000} fromNow ago>{new Date(parseInt(comment.date)).toISOString()}</Moment></Typography>
              </Grid>
            </Grid>
          </div>)}
        </CardContent> : <CardContent sx={{ textAlign: 'center' }}><Typography variant="h6" component="div">No comments</Typography></CardContent>}
      </Collapse>
    </Card >
  );
}
