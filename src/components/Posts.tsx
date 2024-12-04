import { Link } from "react-router-dom";
import { useQuery } from "../react-query-lite";
import { queryClient } from "../queryClient";
import PostsCount from "./PostsCount";

type Post = {
  id: number;
  title: string;
  description: string;
};

export default function Posts() {
  const { status, error, data, refetch } = useQuery<Array<Post>>({
    id: "posts",
    queryFn: () =>
      fetch("http://localhost:3000/posts").then((res) => res.json()),
  });

  // Whenever a post is deleted, both the 'posts' query and the specific 'post'
  // query are both out of date, so they are invalidated on successful deletion.
  async function deletePost(postID: number) {
    await fetch(`http://localhost:3000/post/${postID}`, { method: "DELETE" });
    queryClient.invalidateQuery("posts", `post/${postID}`);
  }

  // Create a new post and update posts query data using `refetch`.
  // This is the same as calling `queryClient.invalidateQuery("posts")` but
  // this intent is more explicit since we are saying we only want to refetch
  // this query's data.
  async function createNewPost() {
    await fetch(`http://localhost:3000/post`, { method: "POST" });
    refetch();
  }

  if (status === "loading") {
    return (
      <>
        <p className="pb-4 text-2xl">Posts</p>
        <hr className="pb-4" />
        <p className="text-3xl">...LOADING...</p>
      </>
    );
  }

  if (status === "error") {
    return (
      <>
        <p className="pb-4 text-2xl">Posts</p>
        <hr className="pb-4" />
        <div>An error happened: {error?.toString()}</div>
      </>
    );
  }

  if (status === "success") {
    return (
      <>
        <div className="pb-4 flex flex-row justify-between align-middle">
          <p className="text-2xl">
            Posts <PostsCount />
          </p>
          <button
            className="px-2 border border-green-600 text-green-600 rounded-lg"
            onClick={createNewPost}
          >
            Create New Post
          </button>
        </div>
        <hr className="pb-4" />

        {data!.map((post) => (
          <div key={post.id} className="mb-4 p-4 border rounded-lg">
            <Link to={`post/${post.id}`}>
              <p className="text-xl">{post.title}</p>
              <p>{post.description}</p>
            </Link>
            <button
              className="mt-4 px-2 border border-red-500 text-red-500 rounded-lg"
              onClick={() => deletePost(post.id)}
            >
              delete
            </button>
          </div>
        ))}
      </>
    );
  }
}
