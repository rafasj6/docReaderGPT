import { Button } from "@mui/material";

interface StandardButtonProps{
 isDisabled?:boolean
 onClick():void
 text:string
 width?:string
}

export default function StandardButton(props:StandardButtonProps){
    const backgroundColor = "#FFFFFF"
    const contrastColor = "#000000"
    return  <Button
        variant ="contained"
        disabled= {props.isDisabled}
        sx={{"&:hover": {
            backgroundColor:"#1864c4",
            color:"#FFFFFF"
        },
        width:props.width?props.width:"100%",
        backgroundColor: props.isDisabled?"" :backgroundColor,
        color:props.isDisabled?"" :contrastColor,
        borderRadius:"8px",
        paddingY:"8px",
        paddingX:"36px",
        }}
        onClick={props.onClick}>
            {props.text}
    </Button>
}