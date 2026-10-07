import fs from "fs";
import path from "path";
import { BlogPost } from "../components/BlogCard";
import { ProductItem } from "../components/ProductCard";

const blogsFilePath = path.join(process.cwd(), "data", "blogs.json");

export function getBlogs(): BlogPost[] {
  try {
    if (!fs.existsSync(blogsFilePath)) {
      return [];
    }
    const data = fs.readFileSync(blogsFilePath, "utf8");
    return JSON.parse(data) as BlogPost[];
  } catch (error) {
    console.error("Error reading blogs.json:", error);
    return [];
  }
}

export function saveBlogs(blogs: BlogPost[]): boolean {
  try {
    const dir = path.dirname(blogsFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(blogsFilePath, JSON.stringify(blogs, null, 2), "utf8");
    return true;
  } catch (error) {
    console.error("Error writing blogs.json:", error);
    return false;
  }
}

const productsFilePath = path.join(process.cwd(), "data", "products.json");

export function getProducts(): ProductItem[] {
  try {
    if (!fs.existsSync(productsFilePath)) {
      return [];
    }
    const data = fs.readFileSync(productsFilePath, "utf8");
    return JSON.parse(data) as ProductItem[];
  } catch (error) {
    console.error("Error reading products.json:", error);
    return [];
  }
}

export function saveProducts(products: ProductItem[]): boolean {
  try {
    const dir = path.dirname(productsFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2), "utf8");
    return true;
  } catch (error) {
    console.error("Error writing products.json:", error);
    return false;
  }
}


