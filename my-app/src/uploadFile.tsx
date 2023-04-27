import  { useEffect, useRef, useState } from 'react';

interface UploadFileComponentProps {
    label: string
    acceptableFiles:string
    required?: boolean
     formKey: string,
    value:any
    handleChange( key:string, value:any ): void,
    sectionTitle?: string 
}  

export default function UploadFileComponent(props: UploadFileComponentProps){
    const drop = useRef(null);
    const [dragging, setDragging] = useState(false);

    useEffect(() => {
      if (drop?.current){
        (drop.current as any).addEventListener('dragover', handleDragOver);
        (drop.current as any).addEventListener('drop', handleDrop);
        (drop.current as any).addEventListener('dragenter', handleDragEnter);
        (drop.current as any).addEventListener('dragleave', handleDragLeave);
      }
      
    
      return () => {
        if (drop?.current){
          (drop.current as any).removeEventListener('dragover', handleDragOver);
          (drop.current as any).removeEventListener('drop', handleDrop);
          (drop.current as any).removeEventListener('dragenter', handleDragEnter);
          (drop.current as any).removeEventListener('dragleave', handleDragLeave);
        }
      };
    }, []);

    const handleDragEnter = (e:any) => {
      e.preventDefault();
      e.stopPropagation();
      
      setDragging(true);
    };
    
    const handleDragLeave = (e:any) => {
      e.preventDefault();
      e.stopPropagation();
      
      setDragging(false);
    };
    
    const handleDragOver = (e:any) => {
      e.preventDefault();
      e.stopPropagation();
    };
    
    const handleDrop = (e:any) => {
      e.preventDefault();
      e.stopPropagation();
      setDragging(false);
      const {files} = e.dataTransfer;
      console.log(files)
      //wrong file type check
      if (props.acceptableFiles && Array.from(files).some((file) => !props.acceptableFiles.split(",").some((format) => (file as any).name.toLowerCase().endsWith(format.toLowerCase())))) {
        console.log(`Only following file formats are acceptable: ${props.acceptableFiles}`);
        return;
      }

      if (files && files.length 
        ) {
        props.handleChange(props.formKey, 
          {
          preview: URL.createObjectURL(files[0]),
          file: files[0],
        });
      }
    };

    const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
      let files = (e.target as HTMLInputElement).files;
      if (files!= null && files.length ) {
        props.handleChange(props.formKey, 
          {
          preview: URL.createObjectURL(files[0]),
          file: files[0],
        });
      }
    };

  return (
    <div ref={drop}>
     <label className="block  text-gray-700 flex justify-center"> {props.label} </label>
        <div  style={{borderColor:dragging?"rgb(79 70 229)":"rgb(209 213 219)"}}
         className={"mt-2 px-2 justify-center border-2 border-gray-300 border-dashed rounded-md"}>
            {props.value.preview ?  <ComponentWithPreview/>  : <ComponentWithoutPreview/>
    }
    </div>
    </div>
  );

  function ComponentWithPreview(){
    return (
      <div className='max-h-24 h-24 flex flex-col justify-center items-center relative'>
          <label className="justify-center absolute top-0 opacity-0 w-24 h-full  flex relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 ">
              <input style={{opacity: "0", pointerEvents:"none", position: "fixed"}} 
                     accept={props.acceptableFiles}
                     id="file-upload" 
                     name="file-upload"
                     type="file"
                     src={props.value.preview}
                     className="sr-only"
                    onChange={handleChange}/>
          </label>
          <div className="w-24 flex justify-center overflow-hidden max-h-24 absolute z-[-1] text-indigo-600">
            {
              props.value.file.type.includes("image")?
                <img src={props.value.preview} alt={props.value.file.name}/>
              : <div className="text-center w-full overflow-hidden break-words max-h-24">
                  {props.value.file.name}
                </div>

            }
          </div>

      </div>
  )
  }

  function ComponentWithoutPreview(){
    return (
      <div className='max-h-24 h-24 flex flex-col justify-center'>
          <div>
            <label className="block text-gray-700"> {props.sectionTitle} </label>
            <div className="text-center">
              <div className="text-center">
              <svg className="mx-auto mt-2 h-8 w-8 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden={true}>
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              </div>
              <label className="cursor-pointer bg-white rounded-md  text-indigo-600 ">
                  <span>Upload file or Drag & Drop</span>
                  <input required={props.required} accept={props.acceptableFiles} id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleChange}/>
              </label>
            </div>
          </div>
      </div>
  )
    }
}