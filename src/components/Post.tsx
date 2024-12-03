import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery } from "../react-query-lite";
import { queryClient } from "../queryClient";

type Post = {
  id: number;
  title: string;
  description: string;
  body: string;
};

export default function Post() {
  const navigate = useNavigate();
  const { postID } = useParams();

  const { status, error, data } = useQuery<Post>({
    id: `post/${postID}`,
    queryFn: () =>
      fetch(`http://localhost:3000/post/${postID}`).then((res) => res.json()),
  });

  async function deletePost() {
    await fetch(`http://localhost:3000/post/${postID}`, { method: "DELETE" });
    queryClient.invalidateQuery("posts", `post/${postID}`);
    navigate("/");
  }

  if (status === "loading") {
    return <p className="text-3xl">...LOADING...</p>;
  }

  if (status === "error") {
    return <div>An error happened: {error?.toString()}</div>;
  }

  if (status === "success") {
    return (
      <>
        <div className="pb-4 flex flex-row justify-between align-middle">
          <p className="text-2xl">{data?.title}</p>
          <div className="flex flex-row justify-between gap-4">
            <button
              className="px-2 border border-red-500 text-red-500 rounded-lg"
              onClick={() => deletePost()}
            >
              delete
            </button>
            <Link
              to="/"
              className="px-2 pt-0.5 border border-gray-600 text-gray-600 rounded-lg"
            >
              Back
            </Link>
          </div>
        </div>
        <hr className="pb-4" />

        <p className="pb-4">{data?.description}</p>
        <p>{data?.body}</p>
      </>
    );
  }
}
