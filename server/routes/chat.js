import { Router } from "express";
import Thread from "../models/Thread.js";
import getOpenRouterAPIResponse from "../utils/openai.js";
import auth from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/thread", auth,  async (req, res) => {
    try {
        const response = await Thread.find({user: req.user.id}).sort({ updatedAt: -1 });
        res.json(response);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

router.get("/thread/:threadId", auth,  async (req, res) => {
    const { threadId } = req.params;

    try {
        const thread = await Thread.findOne({ threadId });

        if (!thread) {
            return res.status(404).json({ error: "Thread not found" });
        }

        res.json(thread.messages);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
});

router.delete("/thread/:threadId", auth,  async (req, res) => {
    const { threadId } = req.params;

    try {
        const thread = await Thread.findOneAndDelete({ threadId, user: req.user.id });

        if (!thread) {
            return res.status(404).json({ error: "Thread not found" });
        }

        res.status(200).json({ success: "Thread deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
});

router.post("/chat", auth,  async (req, res) => {
    const { threadId, message } = req.body;

    if (!threadId || !message) {
        return res.status(400).json({ error: "missing required fields" });
    }

    try {
        let thread = await Thread.findOne({ threadId });

        if (!thread) {
            thread = new Thread({
                threadId,
                title: message,
                user: req.user.id,
                messages: [{ role: "user", content: message }]
            });
        } else {
            thread.messages.push({ role: "user", content: message })
        }

        const assistantReply = await getOpenRouterAPIResponse(message);

        thread.messages.push({role: "assistant", content: assistantReply});
        thread.updatedAt = new Date();

        await thread.save();
        res.json({reply: assistantReply});
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
})

export { router as chatRouter };