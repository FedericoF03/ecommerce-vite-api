import expres from "express";
import {
  items,
  itemQuestions,
  itemDescription,
  itemOpinions,
  itemsVisits,
} from "./functions.js";
import { filter } from "../../utils/filter.js";

const router = expres.Router();

router.get("/items", filter, items);
router.get("/items/visits", filter, itemsVisits);
router.get("/item/questions", filter, itemQuestions);
router.get("/item/description", itemDescription);
router.get("/item/opinions", filter, itemOpinions);
export default router;
