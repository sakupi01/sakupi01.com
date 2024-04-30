import {} from "hono";

import "@hono/react-renderer";

type Head = {
  title?: string;
};

declare module "@hono/react-renderer" {
  interface Props {
    head?: Head;
  }
}