import { Router } from "express";
import type { Events } from "../utils/types.js";
import { uuidv7 } from "uuidv7";
import supabase from "../utils/connectDB.js";

const eventsRouter: Router = Router();

eventsRouter.post("/", async (req, res) => {
  const { event_name, user_id, properties } = req.body;
  const userId = req.user;
  try {
    if (!event_name || !user_id || !properties)
      return res
        .status(400)
        .send({ status: "error", message: "Incomplete Details" });

    if (!userId)
      return res
        .status(400)
        .send({ status: "error", message: "Authenticaton Required!" });

    const newEvent: Events = {
      id: uuidv7(),
      tenant_id: userId,
      event_name,
      user_id,
      properties,
      occurred_at: new Date(),
    };

    const { data, error } = await supabase
      .from("events")
      .insert(newEvent)
      .select();

    if (error) return res.status(400).send({ status: "error", message: error });

    return res.status(201).send({ status: "success", message: data });
  } catch (error: unknown) {
    console.error(error);
  }
});

export default eventsRouter;
