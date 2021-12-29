import { Grid } from "@mui/material";
import React, { useState, useEffect } from "react";
import AppBar from "../components/AppBar"
import CircularProgress from '@mui/material/CircularProgress';
import InfiniteScroll from "react-infinite-scroll-component";
import MediaCard from "../components/MediaCard";
import { styled } from '@mui/material/styles';
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
  subscription OnCommentAdded($moviesIds: [String]) {
    commentCreated(moviesIds: $moviesIds) {
      _id
      text
      movie_id
      email
      name
    }
  }
`;

function LandingPage() {

    let [movies, setMovies] = useState([])
    const { data: new_comment_payload } = useSubscription(
        COMMENTS_SUBSCRIPTION,
        { variables: { moviesIds: movies.map(movie => movie._id) } }
    );//new_comment_payload.commentCreated.name
    React.useEffect(() => {
        if (new_comment_payload) {
            let index = movies.findIndex(movie => movie._id == new_comment_payload.commentCreated.movie_id)
            if (index != -1) {
                let containerMovies = [...movies]
                let movie = { ...movies[index] }
                let comments = [...movie.comments, new_comment_payload.commentCreated]
                movie.comments = comments
                containerMovies[index] = movie
                setMovies(prev=>{
                    return [...containerMovies]
                })
            }
        }
    }, [new_comment_payload])
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
            setMovies([...movies, ...data.findMovies])
            setSkip(prev => {
                return prev + data.findMovies.length
            })
        }
    }, [data])

    return (
        <React.Fragment>
            <AppBar />
            <MainContainer>
                <Grid container spacing={2} justifyContent="center">
                    <Grid item xs={3}>

                    </Grid>
                    <Grid item xs={5}>
                        {/* {loading ?<Box sx={{textAlign: 'center'}}><CircularProgress sx={{textAlign: 'center'}} /></Box> : movies.map(movie=> <MediaCard  key={movie._id} movie={movie} />) } */}
                        <InfiniteScroll
                            dataLength={movies.length}
                            next={() => fetchMoreDataHandler()}
                            hasMore={hasMore}
                            loader={<Box sx={{ textAlign: 'center', overflow: 'hidden' }}><CircularProgress sx={{ textAlign: 'center' }} /></Box>}
                            endMessage={
                                <p style={{ textAlign: "center" }}>
                                    <b>Yay! You have seen it all</b>
                                </p>
                            }
                        >

                            {movies.map((movie) => <MediaCard key={movie._id} movie={movie} />)}
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
