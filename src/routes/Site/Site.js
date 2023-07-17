import expres from "express";
import {
  currency,
  categories,
  categorieData,
  categoryAttributes,
  trends,
  trendsCategory,
  trendsHighlights,
} from "./functions.js";

const router = expres.Router()
.get("/currency", currency)
.get("/categories", categories)
.get("/categories/:site", categorieData)
.get("/categories/attributes/:site", categoryAttributes)
.get("/trends", trends)
.get("/trends/:category", trendsCategory)
.get("/trends/top/:category", trendsHighlights)
export default router;
