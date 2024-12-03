import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClientContextProvider } from "../react-query-lite/index.ts";
import { queryClient } from "../queryClient.ts";
import Posts from "./Posts.tsx";
import Post from "./Post.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Posts />,
  },
  {
    path: "/post/:postID",
    element: <Post />,
  },
]);

/**
 * Root component, that wraps the whole app to provide the Query Client, and to
 * display the current page view using the router.
 */
export default function App() {
  return (
    <QueryClientContextProvider client={queryClient}>
      <div className="p-8">
        <p className="text-4xl pb-8">Build your own React/TanStack Query!</p>
        <RouterProvider router={router} />
      </div>
    </QueryClientContextProvider>
  );
}
