import { GoogleGenAI } from "@google/genai";
 import  fs from "fs";
const ai = new GoogleGenAI({});

export const analyzeImage = async(filePath: string) => {
   

const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

try {
    

const base64ImageFile = fs.readFileSync(filePath, {
  encoding: "base64",
});

const contents = [
  {
    inlineData: {
      mimeType: "image/jpeg",
      data: base64ImageFile,
    },
  },
  { text: "Caption this image." },
];

const config = {
    resposeMimeType: "application/json",
    responseJsonSchema: {
        type: "object",
        properties: {
            name: { type: "string" },
            calories: { type: "number" },
        },
        
    },
}
const response = await ai.models.generateContent({
  model: "gemini-2.5-flash",
  contents: contents,
  config
});
return JSON.parse(response.text);
}
catch (error) {
    console.error("Error analyzing image:", error);
    throw error;
}

}