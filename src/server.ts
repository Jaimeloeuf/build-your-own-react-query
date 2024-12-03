import express from "express";
import cors from "cors";
import { LoremIpsum } from "lorem-ipsum";

const loremIpsum = new LoremIpsum();

/**
 * Local "DB" with data to start with
 */
const posts: Record<
  number,
  { id: number; title: string; description: string; body: string }
> = {
  1: {
    id: 1,
    title: "Post 1",
    description: "this is the 1 blog post in a series of long blog posts",
    body: loremIpsum.generateParagraphs(5),
  },
  2: {
    id: 2,
    title: "Post 2",
    description: "this is the 2 blog post in a series of long blog posts",
    body: loremIpsum.generateParagraphs(5),
  },
};

express()
  // Since our frontend is on another port
  .use(cors())

  // Accept JSON/url encoded request bodies
  .use(express.json())
  .use(express.urlencoded({ extended: true }))

  /**
   * Simple middleware to simulate time consuming API calls
   */
  .use(async (_req, _res, next) => {
    await new Promise((res) => setTimeout(res, 500));
    // await new Promise((res) => setTimeout(res, 2000));
    next();
  })

  /**
   * Generate a single post and send it back to the client
   */
  .post("/post", (_, res) => {
    // Magical code to derive a new ascending ID
    const newPostID =
      parseInt(
        Object.keys(posts)
          .sort((a, b) => parseInt(a) - parseInt(b))
          .at(-1) ?? "0"
      ) + 1;

    const newPost = {
      id: newPostID,
      title: `Post ${newPostID}`,
      description: `this is the ${newPostID} blog post in a series of long blog posts`,
      body: loremIpsum.generateParagraphs(5),
    };

    // Save it into the "DB"
    posts[newPostID] = newPost;

    res.status(201).json(newPost);
  })

  /**
   * Get all the posts
   */
  .get("/posts", (_, res) => {
    const postsWithoutBody = Object.values(posts).map((post) => ({
      id: post.id,
      title: post.title,
      description: post.description,
    }));

    res.status(200).json(postsWithoutBody);
  })

  /**
   * Get a single post
   */
  .get("/post/:postID", (req, res) => {
    const postID = parseInt(req.params["postID"]);

    const post = posts[postID];

    res.status(200).json(post);
  })

  /**
   * Delete a single post
   */
  .delete("/post/:postID", (req, res) => {
    const postID = parseInt(req.params["postID"]);

    delete posts[postID];

    res.status(204).end();
  })

  .listen(3000, () => {
    console.log(`SDS Demo server listening on port ${3000}`);
  });
