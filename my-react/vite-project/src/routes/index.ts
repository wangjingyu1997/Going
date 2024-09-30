import { createBrowserRouter, RouterProvider, Route, Link } from "react-router-dom";
import Hellow from "../pages/Hellow";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Hellow />,
  },
]);
export default routes