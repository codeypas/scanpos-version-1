// import { OpenAIStream, StreamingTextResponse } from "ai"
// import OpenAI from "openai"

// export async function POST(req: Request) {
//   try {
//     // Check if API key is available
//     if (!process.env.OPENAI_API_KEY) {
//       return new Response(
//         JSON.stringify({
//           error: "OpenAI API key is missing. Please add it to your environment variables.",
//         }),
//         { status: 500, headers: { "Content-Type": "application/json" } },
//       )
//     }

//     const { messages } = await req.json()

//     // Create an OpenAI API client (that's already configured with your API key)
//     const openai = new OpenAI({
//       apiKey: process.env.OPENAI_API_KEY,
//     })

//     // Request the OpenAI API for the response
//     const response = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo", // Using a more widely available model
//       stream: true,
//       messages: [
//         {
//           role: "system",
//           content: `You are a helpful assistant for ScanPOS, a point of sale system. 
//           Help users with questions about:
//           - How to create invoices
//           - How to manage inventory
//           - How to use the barcode scanner
//           - How to generate reports
//           - How to manage customers
//           - How to customize invoices
//           - How to set up payment methods
          
//           Be concise, friendly, and helpful. If you don't know the answer to a question, suggest contacting support.`,
//         },
//         ...messages,
//       ],
//     })

//     // Convert the response into a friendly text-stream
//     const stream = OpenAIStream(response)

//     // Respond with the stream
//     return new StreamingTextResponse(stream)
//   } catch (error: any) {
//     console.error("Error in chat API:", error)

//     // Return a more detailed error message
//     return new Response(
//       JSON.stringify({
//         error: "Failed to process chat request",
//         details: error.message || "Unknown error",
//         hint: "Check that your OpenAI API key is valid and has sufficient credits.",
//       }),
//       { status: 500, headers: { "Content-Type": "application/json" } },
//     )
//   }
// }






// import { OpenAIStream, StreamingTextResponse } from "ai"
// import OpenAI from "openai";


// import connectToDatabase from "@/lib/mongodb" // ✅ Import MongoDB connection

// export async function POST(req: Request) {
//   try {
//     // ✅ Connect to MongoDB
//     await connectToDatabase()

//     // Check if API key is available
//     if (!process.env.OPENAI_API_KEY) {
//       return new Response(
//         JSON.stringify({
//           error: "OpenAI API key is missing. Please add it to your environment variables.",
//         }),
//         { status: 500, headers: { "Content-Type": "application/json" } },
//       )
//     }

//     const { messages } = await req.json()

//     // Create an OpenAI API client (that's already configured with your API key)
//     const openai = new OpenAI({
//       apiKey: process.env.OPENAI_API_KEY,
//     })

//     // Request the OpenAI API for the response
//     const response = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       stream: true,
//       messages: [
//         {
//           role: "system",
//           content: `You are a helpful assistant for ScanPOS, a point of sale system. 
//           Help users with questions about:
//           - How to create invoices
//           - How to manage inventory
//           - How to use the barcode scanner
//           - How to generate reports
//           - How to manage customers
//           - How to customize invoices
//           - How to set up payment methods
          
//           Be concise, friendly, and helpful. If you don't know the answer to a question, suggest contacting support.`,
//         },
//         ...messages,
//       ],
//     })

//     // Convert the response into a friendly text-stream
//     const stream = OpenAIStream(response)

//     return new StreamingTextResponse(stream)
//   } catch (error: any) {
//     console.error("Error in chat API:", error)

//     return new Response(
//       JSON.stringify({
//         error: "Failed to process chat request",
//         details: error.message || "Unknown error",
//         hint: "Check that your OpenAI API key is valid and has sufficient credits.",
//       }),
//       { status: 500, headers: { "Content-Type": "application/json" } },
//     )
//   }
// }





import OpenAI from "openai";
import connectToDatabase from "@/lib/mongodb"; // ✅ Import MongoDB connection

export async function POST(req: Request) {
  try {
    // ✅ Connect to MongoDB
    await connectToDatabase();

    // Check if API key is available
    if (!process.env.OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "OpenAI API key is missing." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const { messages } = await req.json();

    // Create an OpenAI API client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Request OpenAI API for a response
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
    });

    return new Response(JSON.stringify(response), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error in chat API:", error);

    return new Response(
      JSON.stringify({
        error: "Failed to process chat request",
        details: error.message || "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

