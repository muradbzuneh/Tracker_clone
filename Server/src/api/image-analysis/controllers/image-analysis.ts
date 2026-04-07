import { Context } from "koa";
import { analyzeImage } from "../services/gemini";

export default {
  async analyze(ctx: Context) {
    const file = ctx.request.files?.image as any;

    if (!file) {
      return ctx.badRequest("No image file provided.");
    }

    try {
      const result = await analyzeImage(file.path);
      return ctx.send(result);
    } catch (error: any) {
      return ctx.internalServerError("Error analyzing image", {
        error: error.message,
      });
    }
  },
};