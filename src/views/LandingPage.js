import { Button, Grid } from "@mui/material";
import React, { useState, useEffect, useReducer } from "react";
import AppBar from "../components/AppBar"
import CircularProgress from '@mui/material/CircularProgress';
import InfiniteScroll from "react-infinite-scroll-component";
import MediaCard from "../components/MediaCard";
import AlertDialog from "../components/Alert";
import { styled } from '@mui/material/styles';
import UploadButton from "../components/UploadButton"
import {
    useSubscription,
    useLazyQuery,
    gql,
} from "@apollo/client";
import { Box } from "@mui/system";
const MainContainer = styled('main')(({ theme }) => {
    return {
        marginTop: theme.mixins.toolbar.minHeight,
    }
});

const SNAPSHOT = gql`
  query createSnapshotsQuery{
    createSnapshots
  }
`

const GETMOVIES = gql`
  query findMoviesQuer($skip: Int, $limit: Int){
    findMovies(skip: $skip, limit: $limit){
        _id
        poster
        plot
        genres
        runtime
        cast
        num_mflix_comments
        title
        fullplot
        countries
        released
        directors
        rated
        awards{
            wins
            nominations
            text
        }
        lastupdated
        year
        type
        comments{
          _id
          name
          email
          text
          date
        }

    }
  }
`
const COMMENTS_SUBSCRIPTION = gql`
  subscription OnCommentActions($moviesIds: [String]) {
    CommentsSubscribe(moviesIds: $moviesIds) {
      _id
      text
      movie_id
      email
      name
      date
      action
    }
  }
`;

function LandingPage() {
    const [createSnapshot] = useLazyQuery(SNAPSHOT)
    const MoviesReducer = (state, { type, payload }) => {
        switch (type) {
            case 'NEW_MOVIES_ADDED':
                return { ...state, movies: [...state.movies, ...payload] }
            case 'COMMENT_CREATED':
                let index = state.movies.findIndex(movie => movie._id == payload.movie_id)
                if (index != -1) {
                    let containerMovies = [...state.movies]
                    let movie = { ...state.movies[index] }
                    let comments = [...movie.comments, payload]
                    movie.comments = comments
                    containerMovies[index] = movie
                    return { ...state, movies: containerMovies }
                } else {
                    return state
                }
            case 'COMMENT_DELETED':
                let index2 = state.movies.findIndex(movie => movie._id == payload.movie_id)
                if (index2 != -1) {
                    let containerMovies = [...state.movies]
                    let movie = { ...state.movies[index2] }
                    let comments = [...movie.comments]
                    movie.comments = comments.filter(comment => comment._id != payload._id)
                    containerMovies[index2] = movie
                    return { ...state, movies: containerMovies }
                }
                return state
            default:
                return state
        }
    }
    const [state, distpatch] = useReducer(MoviesReducer, {
        movies: [],
    })
    const [open, setOpen] = useState(false);
    const [error_msg, setError_msg] = React.useState("")
    const openAlertDialog = (message) => {
        setOpen(true);
        setError_msg(message)
    };
    const handleClose = () => {
        setOpen(false);
    };
    const { data: comment_action } = useSubscription(
        COMMENTS_SUBSCRIPTION,
        { variables: { moviesIds: state.movies.map(movie => movie._id) } }
    );
    React.useEffect(() => {
        // console.log('comment_action')
        // console.log(comment_action)
        if (comment_action && comment_action.CommentsSubscribe._id) {
            if (comment_action.CommentsSubscribe.action == "COMMENT_CREATED") {
                distpatch({ type: 'COMMENT_CREATED', payload: comment_action.CommentsSubscribe })
            } else if (comment_action.CommentsSubscribe.action == "COMMENT_DELETED") {
                distpatch({ type: 'COMMENT_DELETED', payload: comment_action.CommentsSubscribe })
            }
        }
    }, [comment_action])
    let [hasMore, setHasMore] = useState(true)
    const [skip, setSkip] = useState(0)
    const [fetchMoreData, { data }] = useLazyQuery(GETMOVIES)
    const fetchMoreDataHandler = () => {
        fetchMoreData({ variables: { skip: skip, limit: 20 } })
    }
    useEffect(() => {
        fetchMoreDataHandler()
    }, [])
    useEffect(() => {
        if (data && data.findMovies.length == 0) {
            setHasMore(false);
            return;
        }
        if (data && data.findMovies) {
            // setMovies([...movies, ...data.findMovies])
            distpatch({ type: 'NEW_MOVIES_ADDED', payload: data.findMovies })
            setSkip(prev => {
                return prev + data.findMovies.length
            })
        }
    }, [data])

    return (
        <React.Fragment>
            {/* <Button onClick={()=>createSnapshot()}>Snapshot</Button> */}
            <UploadButton />
            <AlertDialog message={error_msg} handleClose={handleClose} open={open} />
            <AppBar />
            <MainContainer>
                <Grid container spacing={2} justifyContent="center">
                    <Grid item xs={3}>

                    </Grid>
                    <Grid item xs={5}>
                        {/* {loading ?<Box sx={{textAlign: 'center'}}><CircularProgress sx={{textAlign: 'center'}} /></Box> : movies.map(movie=> <MediaCard  key={movie._id} movie={movie} />) } */}
                        <InfiniteScroll
                            dataLength={state.movies.length}
                            next={() => fetchMoreDataHandler()}
                            hasMore={hasMore}
                            loader={<Box sx={{ textAlign: 'center', overflow: 'hidden' }}><CircularProgress sx={{ textAlign: 'center' }} /></Box>}
                            endMessage={
                                <p style={{ textAlign: "center" }}>
                                    <b>Yay! You have seen it all</b>
                                </p>
                            }
                        >

                            {state.movies.map((movie) => <MediaCard key={movie._id} movie={movie} openAlertDialog={openAlertDialog} />)}
                        </InfiniteScroll>
                        {/* <button onClick={() => fetchMoreDataHandler()}>Looad</button> */}
                    </Grid>
                    <Grid item xs={3}>
                    </Grid>

                </Grid>
            </MainContainer>
        </React.Fragment>
    );
}

export default LandingPage
