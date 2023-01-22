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



function App() {

  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.auth.currentUser);
  const darkmode = useSelector((state) => state.darkmode)
  const user = useSelector((state) => state.profile.pathnameUserId)

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      dispatch(checkAuth())
    }
  }, [])


  // REACT ROUTER loaders

  const authLoader = () => {
    setTimeout(() => { dispatch(setStatusAndError({ status: "", error: "" })) }, 0)
    return null
  }

  const feedLaoder = ({ params }) => {

    dispatch(setFolder(params.folder))
    document.dispatchEvent(new Event("feedIsOpened"))

    return null
  }

  const profileLaoder = ({ params }) => {
    dispatch(setPathnameUserId(params.userId))
    dispatch(setFolder("profile"))
    document.dispatchEvent(new Event("feedIsOpened"))

    return null
  }

  const usersLaoder = () => {

    document.dispatchEvent(new Event("usersIsOpened"))

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
      <div className={"app-wrapper "}>
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
          element: <Feed />,
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
      loader: authLoader,
      element:
        <ProtectedRouteLogin>
          <Auth />
        </ProtectedRouteLogin>
    },
    {
      path: "/login",
      loader: authLoader,
      element:
        <ProtectedRouteLogin>
          <Auth />
        </ProtectedRouteLogin>
    },
  ])

  return (
    <div className={(darkmode.darkmode ? "brightMode" : "darkMode")} >
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
