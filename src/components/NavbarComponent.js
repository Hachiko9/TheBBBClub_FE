import React, {useState} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import {makeStyles} from '@material-ui/core/styles';
import SearchComponent from "./SearchComponent";
import {logout} from "../services/UserService";
import {Link, Redirect} from "react-router-dom";
import {getLastMovieId, getMovie} from "../services/MoviesService";
import {Button} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: '#07131f',
        position: 'sticky',
        top: -146,
    },
    rootSmall: {
        backgroundColor: 'rgba(0, 0, 0,0.8)',
        position: 'absolute',
        top: -150,
        width: '100%'
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    toolbar: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingTop: theme.spacing(1),
        textShadow: '2px 2px 1px black'
    },
    actionsContainer: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    link: {
        fontSize: 24,
        paddingRight: 20
    },
    linkFromBtn: {
        fontSize: 24,
        paddingRight: 20,
        textTransform: 'none',
        textShadow: '2px 2px 1px black',
        '&:hover': {
            color: theme.palette.primary.main
        }
    }
}));

const NavbarComponent = ({path, user}) => {
    const classes = useStyles();
    const [randomId, setRandomId] = useState(0);
    const isMovieDetailPage = (/(movie-details)/gi).test(path);
    const isProfilePage = (/(profile)/gi).test(path);
    const isSmall = isMovieDetailPage || isProfilePage;
    const isProtectedState = user && Object.keys(user).length > 0;

    const handleLogout = () => {
        logout(user._id).then(() => {
            document.location.reload()
        }).catch(err => console.log(err));
    }

    const getRandomMovieId = () => {
        getLastMovieId().then(lastMovie => {
            const randomId = Math.floor(Math.random() * lastMovie);
            getMovie(randomId)
                .then((movie) => (movie.backdrop_path && !movie.adult) ? setRandomId(movie.id) : getRandomMovieId())
                .catch(() => getRandomMovieId());
        });
    }

    return (
        <div className={isSmall ? classes.rootSmall : classes.root} >
            <AppBar position="static" color={'transparent'} elevation={0}>
                <Toolbar className={classes.toolbar}>
                    <Link to={'/'}>
                        <img height={140} src={'/logo.png'} alt=""/>
                    </Link>
                    <div className={classes.actionsContainer}>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            {isSmall &&
                            <Link to={'/'}>
                                <img height={140} src={'/logo-mini.png'} alt="" style={{height: 80, marginRight: 30}}/>
                            </Link>
                                }
                            <Link to="/now-playing" className={classes.link}>
                                Now playing
                            </Link>
                            <Link to="/all-movies" className={classes.link}>
                                All movies
                            </Link>
                            <Button className={classes.linkFromBtn} onClick={getRandomMovieId}>
                                Random movie
                            </Button>
                            {randomId > 0 &&
                                <Redirect to={`/movie-details/${randomId}`}/>
                            }
                            {isProtectedState && (
                                <Link to="/profile" className={classes.link}>
                                    Profile
                                </Link>
                            )}
                        </div>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            {isProtectedState && (
                                <IconButton className={classes.linkFromBtn} aria-label="display more actions" edge="end" color="inherit" onClick={handleLogout}>
                                    Logout
                                </IconButton>
                            )}
                            {!isProtectedState && (
                                <div>
                                    <Link to="/login" className={classes.link}>
                                        Login
                                    </Link>
                                    <Link to="/signup" className={classes.link}>
                                        Signup
                                    </Link>
                                </div>
                            )}
                            <IconButton aria-label="search" color="inherit">
                                <SearchComponent />
                            </IconButton>
                        </div>
                    </div>
                </Toolbar>
            </AppBar>
        </div>
    );
}

export default NavbarComponent;