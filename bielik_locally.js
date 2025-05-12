import OpenAI from 'openai';
import pdf from 'pdf-parse/lib/pdf-parse.js'
import fs from 'fs';

const client = new OpenAI({
  baseURL: 'http://localhost:1234/v1',
  apiKey: ''
});

async function loadPdfText(filePath) {

    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);

    return data.text;

}

function buildPrompt(pdfText, userQuestion) {

    return `
        KONTEKST DOKUMENTU:
        ${pdfText.substring(0, 3000)}  <!-- max 3k znaków  -->
        
        PYTANIE UŻYTKOWNIKA:
        ${userQuestion}
        
        ODPOWIEDZ TYLKO NA PODSTAWIE TEGO KONTEKSTU.
        `;

}

async function askBielik(prompt) {
    
    let response = null;

    try {

        response = await client.chat.completions.create({
        model: "bielik-11b-v2.3-instruct",
        messages: [
        { role: "system", content: "Odpowiadaj jak prawnik." },
        { role: "user", content: prompt }
        ]

    });

    } catch (error) {

    console.error('Error:', error);

    }

    return response.choices[0].message.content ?? "Nie udało się uzyskać odpowiedzi.";

}

const main = async () => {

    const pdfText = await loadPdfText(`./docs/pozew-wzor.pdf`);
    const userQuestion = "O czym jest ten dokument?";
  
    const prompt = buildPrompt(pdfText, userQuestion);
    const answer = await askBielik(prompt);
  
    console.log("\PYTANIE:\n", userQuestion);
    console.log("\nODPOWIEDŹ MODELU:\n", answer);
    
};
  
  main();
