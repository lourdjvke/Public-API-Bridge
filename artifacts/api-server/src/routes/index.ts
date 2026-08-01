import { Router, type IRouter } from "express";
import healthRouter from "./health";
import breacherRouter from "./breacher";

const router: IRouter = Router();

router.use(healthRouter);
router.use(breacherRouter);

export default router;
