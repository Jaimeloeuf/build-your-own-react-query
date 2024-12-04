import { useQuery } from "../react-query-lite";

export default function Posts() {
  const { status, data } = useQuery<Array<unknown>>({
    id: "posts",
    queryFn: () =>
      fetch("http://localhost:3000/posts").then((res) => res.json()),
  });

  if (status === "success") {
    return <span>{data?.length}</span>;
  }
}
