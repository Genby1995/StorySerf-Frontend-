//CSS
import './App.css';
//REDUX
import { useDispatch, useSelector } from 'react-redux';

//React Components
import Header from "./components/Header/Header";
import Users from './components/Users/Users';
import SideMenu from "./components/SideMenu/SideMenu";
import Feed from "./components/Feed/Feed";
import MessengerContainer from "./components/Messenger/MessengerContainer";
import PostMaker from "./components/PostMaker/PostMaker";
import Auth from "./components/Auth/Auth";
//REACT ROUTER DOM
import { Outlet, createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import Profile from './components/Profile/Profile';
import { useEffect } from 'react';
import { checkAuth, setStatusAndError } from './redux/authSlice';
import { fetchUser, setPathnameUserId } from './redux/profileSlice';
import { clearPosts, setFolder, setPosts, setSection } from './redux/feedSlice';
import { setMobileMode as setMobileMode_AC } from './redux/visualModeSlice';

function App() {

  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.auth.currentUser);
  const darkmode = useSelector((state) => state.visualMode.darkmode)
  const mobileMode = useSelector((state) => state.visualMode.mobileMode)
  const user = useSelector((state) => state.profile.pathnameUserId)

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      dispatch(checkAuth())
    }
    window.addEventListener('resize', handleResize);
    window.dispatchEvent(new Event("resize"))
    return function () {
      window.removeEventListener('resize', handleResize);
    }
  }, [])

  // Handlers
  const handleResize = () => {
    dispatch(setMobileMode_AC(document.documentElement.clientWidth))
  } 

  // REACT ROUTER loaders

  const feedLaoder = ({ params }) => {
    setTimeout(() => {
      dispatch(setFolder(params.folder));
      document.dispatchEvent(new Event("feedIsOpened"))
    }, 0)
    setTimeout(() => { document.dispatchEvent(new Event("feedIsOpened")) }, 0);
    return null
  }

  const profileLaoder = ({ params }) => {
    setTimeout(() => {
      dispatch(setPathnameUserId(params.userId))
      dispatch(clearPosts({ folder: "profile" }))
      dispatch(setFolder("profile"));
      document.dispatchEvent(new Event("feedIsOpened"))
    }, 0);
    setTimeout(() => { document.dispatchEvent(new Event("feedIsOpened")) }, 0);
    return null
  }

  const usersLaoder = () => {
    document.dispatchEvent(new Event("usersIsOpened"))
    setTimeout(() => { document.dispatchEvent(new Event("usersIsOpened")) }, 0);
    return null
  }

  // REACT ROUTER creating ProtectedRoutes

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />
    }
    return children;
  }

  const ProtectedRouteLogin = ({ children }) => {
    if (currentUser) {
      return <Navigate to="/feed/fresh" />
    }
    return children;
  }

  // REACT ROUTER creating BrowserRouter

  const Layout = () => {
    return (
      <div className="app-wrapper ">
        <Header />
        <div className='content-wrapper'>
          <Outlet />
          <SideMenu />
        </div>
      </div>
    )
  }

  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: '/profile/:userId',
          loader: profileLaoder,
          element:
            <div className="profile-wrapper">
              <Profile />
              <Feed folder="profile" />
            </div>
        },
        {
          path: '/feed/:folder',
          element: <Feed folder="best" />,
          loader: feedLaoder,
        },
        {
          path: '/messenger/*',
          element: <MessengerContainer />
        },
        {
          path: '/users',
          loader: usersLaoder,
          element: <Users />
        },
        {
          path: '/add/*',
          element: <PostMaker />
        }
      ]
    },
    {
      path: '/register',
      element:
        <ProtectedRouteLogin>
          <Auth />
        </ProtectedRouteLogin>
    },
    {
      path: "/login",
      element:
        <ProtectedRouteLogin>
          <Auth />
        </ProtectedRouteLogin>
    },
  ])

  return (
    <div className={(darkmode ? "brightMode" : "darkMode")} >
      <RouterProvider router={router} />
    </div>
  );
}

export default App;

// SVG VARs

var svg_like = "M504.9,233.325c7.649-7.65,11.475-19.125,11.475-32.513c0-21.038-13.388-38.25-30.6-43.987c7.649-7.65,11.475-19.125,11.475-32.513c0-26.775-21.037-47.812-47.812-47.812C455.175,68.85,459,59.288,459,47.812C459,21.038,437.963,0,411.188,0H328.95h-61.2L153,38.25H38.25C17.212,38.25,0,55.462,0,76.5v210.375c0,21.037,17.212,38.25,38.25,38.25H153c0,0,55.462,5.737,86.062,61.2C269.662,443.7,229.5,535.5,306,535.5s86.062-114.75,66.938-210.375h114.75c26.775,0,47.812-21.037,47.812-47.812C535.5,256.275,522.112,239.062,504.9,233.325zM487.688,306h-137.7C372.938,411.188,367.2,516.375,306,516.375c-55.462,0-21.037-82.237-49.725-139.612C227.587,319.388,162.562,306,162.562,306H38.25c-11.475,0-19.125-7.65-19.125-19.125V76.5c0-11.475,7.65-19.125,19.125-19.125H153l114.75-38.25h72.675h70.763c15.3,0,28.688,13.388,28.688,28.688S426.487,76.5,411.188,76.5H382.5v19.125h66.938c15.3,0,28.688,13.388,28.688,28.688S464.737,153,449.438,153h-47.812v19.125h66.938c15.3,0,28.688,13.388,28.688,28.688S483.862,229.5,468.562,229.5H420.75v19.125h66.938c15.3,0,28.688,13.388,28.688,28.688S502.987,306,487.688,306z"
