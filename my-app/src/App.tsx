import { useState } from 'react';

import './App.css';
 
import UploadFileComponent from './uploadFile';
import { convertPdfToText, getSummary } from './utils';
import StandardButton from './standardButton';
import InputField from './inputField';

function App() {
  const [pdfText, setPdfText]= useState<string|undefined>(undefined)
  const [summary, setSummary]= useState<string|null>(null)
  const [isFetching, setIsFetching]= useState(false)
  const [summaryStrategy, setSummaryStrategy] = useState<string|undefined>(undefined)
  const [currentFile, setCurrrentFile] = useState({
    preview: undefined,
    file:undefined,
  })
  return (
    <div className="w-screen mt-[10rem] h-max flex justify-center items-center	">
    <div className='flex flex-col items-center gap-6 text-center'>
     
      <InputField 
        shouldCenterInput
        sectionTitle='Section Summary Strategy:'
        width={'30rem'} formKey={''} 
        placeholder={"summarize important points in bullet point form."} value={summaryStrategy}
        handleChange={(_,value)=>{setSummaryStrategy(value)}} />

      <UploadFileComponent 
        label={'Upload PDF:'} acceptableFiles={'.pdf'} formKey={''} 
        value={currentFile} 
        handleChange={async (_, value)=>{
          setPdfText(await convertPdfToText(value.file)); setCurrrentFile(value)}}/>
      <StandardButton width="min" 
        text={'Get Summary'}
        onClick={async ()=>{
          setIsFetching(true); 
          if (pdfText){
            setSummary(await getSummary(pdfText,summaryStrategy))
          } else{
            setSummary("Please upload PDF first")
          }
          setIsFetching(false)} 
        }/>
      <div className='mb-[10rem] flex flex-col gap-6 justify-center items-center rounded-sm border w-[60rem]'> 
          <h1 className='font-bold'>Summary:</h1>
      {isFetching? "Loading...": summary?.split("\\n").map((line, index)=>
              <div key={index}>{line}</div>
              
      )}
      </div>
      </div>

   
    </div>
  );
}

export default App;
