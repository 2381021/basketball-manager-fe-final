import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from "react-router-dom";
import BaseLayout from "./layouts/BaseLayout";
import RootLayout from "./layouts/RootLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PrivateRoute from "./utils/PrivateRoute";
import PublicRoute from "./utils/PublicRoute";
import { AuthProvider } from "./utils/AuthProvider";
import Player from "./pages/Player";
import AddPlayer from "./pages/AddPlayer";
import EditPlayer from "./pages/EditPlayer";
import PlayerDetail from "./pages/PlayerDetail";
import Comments from "./pages/Comments";
import AddComment from "./pages/AddComment";
import Game from "./pages/Game";
import AddGame from "./pages/AddGame";
import GameDetail from "./pages/GameDetail";
import EditGame from "./pages/EditGame";
import Settings from "./pages/Settings";
import CommentDetail from "./pages/CommentDetail";

const queryClient = new QueryClient();
function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route path="/" element={<BaseLayout />}>
          <Route
            path="login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
        </Route>
        <Route path="/" element={<RootLayout />}>
          <Route
            index
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="players"
            element={
              <PrivateRoute>
                <Player />
              </PrivateRoute>
            }
          />
          <Route
            path="players/add"
            element={
              <PrivateRoute>
                <AddPlayer />
              </PrivateRoute>
            }
          />
          <Route
            path="players/:id"
            element={
              <PrivateRoute>
                <PlayerDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="players/:id/edit"
            element={
              <PrivateRoute>
                <EditPlayer />
              </PrivateRoute>
            }
          />
          <Route
            path="comments"
            element={
              <PrivateRoute>
                <Comments />
              </PrivateRoute>
            }
          />
          <Route
            path="comments/add"
            element={
              <PrivateRoute>
                <AddComment />
              </PrivateRoute>
            }
          />
          <Route
            path="games"
            element={
              <PrivateRoute>
                <Game />
              </PrivateRoute>
            }
          />
          <Route
            path="games/add"
            element={
              <PrivateRoute>
                <AddGame />
              </PrivateRoute>
            }
          />
          <Route
            path="games/:id"
            element={
              <PrivateRoute>
                <GameDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="games/:id/edit"
            element={
              <PrivateRoute>
                <EditGame />
              </PrivateRoute>
            }
          />
          <Route
            path="settings"
            element={
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            }
          />
          <Route
            path="comments/:id"
            element={
              <PrivateRoute>
                <CommentDetail />
              </PrivateRoute>
            }
          />
        </Route>
      </Route>
    )
  );
  return (
    <>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </AuthProvider>
    </>
  );
}

export default App;
