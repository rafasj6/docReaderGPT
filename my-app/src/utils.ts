import axios from 'axios';
const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js");

export async function convertPdfToText(file: File): Promise<string> {
    // Set workerSrc to load the required worker file
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.5.141/pdf.worker.min.js';
  
    // Create a Promise to handle the asynchronous operation
    return new Promise<string>((resolve, reject) => {
      // Read the PDF file as an ArrayBuffer
      const fileReader = new FileReader();
      fileReader.onload = async function(event) {
        if (event !=null && event.target) {
          const arrayBuffer = event!.target.result;
  
          // Load the PDF document
          const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  
          // Extract text from each page
          let fullText = '';
          for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
            const page = await pdfDoc.getPage(pageNum);
            const textContent = await page.getTextContent();
  
            // Join the text items into a single string
            const pageText = textContent.items.map((item:any) => item.str).join(' ');
            fullText += pageText + '\n\n';
          }
          
  
          // Resolve the Promise with the full text content
          resolve(fullText);
        }
      };
      
      // Handle any errors that occur during the asynchronous operation
      fileReader.onerror = function(event) {
        reject(event.target?.error);
      };
  
      fileReader.readAsArrayBuffer(file);
    });
  }
export function splitTextIntoChunks(text: string): any[] {
    const words = text.split(/\s+/); // split text into words
    const chunkSize = 2000;
    const numChunks = Math.ceil(words.length / chunkSize); // calculate number of chunks needed
    const chunks: string[] = [];
  
    for (let i = 0; i < numChunks; i++) {
      const start = i * chunkSize;
      const end = start + chunkSize;
      const chunkWords = words.slice(start, end);
      chunks.push(chunkWords.join(" "));
    }
  
    return chunks;
  }

export async function getSummary(text:string,summaryStrategy:string="summarize important points in bullet point form."){
    let chunks = splitTextIntoChunks(text)
    let summaries = await Promise.all(chunks.map((chunk,i )=>
    summarizeChunk(chunk,i+1,summaryStrategy)))
    console.log(summaries)
    return summaries.join("\\n\\n")
}

export async function summarizeChunk(text:string, i:number,summaryStrategy:string){

    let data = JSON.stringify({
        "model": "gpt-3.5-turbo",
        "messages": [{"role": "user", "content": text},{"role": "user", "content": summaryStrategy} ],
        "max_tokens":500,
        "n":1,
      });
      console.log(process.env)
      
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://api.openai.com/v1/chat/completions',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
        },
        data : data
      };
    
      
      return axios.request(config)
      .then((response:any) => {
        console.log(response.data.choices)
        return (`Summary of Section ${i}:\\n`+ JSON.stringify(response.data.choices[response.data.choices.length-1].message.content));
      })
      .catch((error:any) => {
        console.log(error);
        return null;
      });
}