import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/home/HomePage";
import App from "../App";
import ProductDetail from "../pages/product/ProductDetail";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,
    children: [
      {
        path: "/",
        element: <HomePage></HomePage>,
      },
      {
        path: "/product",
        element: <ProductDetail />,
      },
    ],
  },
]);
