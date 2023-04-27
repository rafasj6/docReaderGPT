import { useEffect } from 'react'

interface InputFieldProps {
    width: number | string
    height?: number|string
    suffix?: string
    suffixOnClick?():void
    prefix?: string
    labelStyle?: string
    shouldCenterInput?: boolean
    type?:string,
    required?: boolean
    placeholder?:string
    disabled?: boolean
    formKey: string,
    value:any
    handleChange( key:string, value:any ): void,
    sectionTitle?: string 
}

export default function InputField(props:InputFieldProps){
    useEffect(()=>{
        function stopScrolling(){
            if(document.activeElement && (document.activeElement as any).type === "number"
             && document.activeElement.classList.contains("noscroll")){
                (document.activeElement as any).blur();
            }
        }
        document.addEventListener("wheel", stopScrolling);

        return () => {
            document.removeEventListener('wheel', stopScrolling)
        }
    })
  
    return (
        <div style={{width: props.width}}>
            <label className={props.labelStyle? props.labelStyle:" text-gray-700"}> {props.sectionTitle} </label>
            <div  className=" relative mt-1 rounded-md  yantramanav gap-2  flex  items-center justify-center">
                {props.prefix}
                <input 
                    value={props.value}
                    disabled={props.disabled}
                    onChange={event => props.handleChange(props.formKey, event.target.value)}
                    type={props.type? props.type: "text"} 
                    name="input-field" 
                    min={props.type == "number"? "0": undefined} 
                    required={props.required}
                    placeholder={props.placeholder}
                    id="company-website"
                    style={{ height: props.height? props.height: "30px",
                             textAlign: props.shouldCenterInput? "center": "left"}}
                    className={"pl-1  noscroll scrollbar-hide focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md  border border-gray-300"}
                />
                <span onClick={props.suffixOnClick} style={{cursor: props.suffixOnClick? "pointer":"default"}} className="flex h-full items-center absolute right-4">{props.suffix}</span>
            </div>
        </div>
    )
}