import React from 'react';
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

let HeadingStyle = {backgroundColor: '#16161F', paddingTop: 10, paddingBottom: 10, marginBottom:0, textAlign:"center", display:"flex", paddingLeft:2, alignItems:"center", justifyContent:"center",}
let StagingFileStyle = {backgroundColor: '#696969', paddingTop:5, maxHeight: 140, minHeight: 140, overflow:"auto", marginTop:0, fontSize:14}
let CommitBoxStyle = {borderStyle:"solid", borderColor:"black", borderWidth:1, backgroundColor: '#696969',  paddingTop:5, marginBottom:20, maxHeight: 110, minHeight: 110, overflow:"none", marginTop:0}

function StagingBox({title, files, buttonTitle, buttonFunction}){
    let value = buttonTitle;
    return(
        <div style={{marginBottom:20}}>
            <div style={HeadingStyle}>{title} <Button style={{marginLeft:10}} onClick={() => {buttonFunction(value)}} variant="outlined" color="secondary">{buttonTitle}</Button></div>
            <div style={StagingFileStyle}>
                <ul style={{paddingTop:0, paddingLeft:20, marginTop:0}}>
                    {files.map(file => (
                        <li key={file.path}>{file.path}</li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

function CommitMessage(){
    const styles = {
        container: {
            display: 'flex',
            flexWrap: 'wrap',
        },
        textField: {
            width: 300,
            margin: 100,
        },
        //style for font size
        resize:{
          fontSize:50
        },
        }
    return(
        <div>
            <div style={CommitBoxStyle}>
                <input id="commit-message" maxLength="70" placeholder="Commit Message" 
                style={{fontSize: 18, width:"100%", border:"none", fontWeight: 15, outline:"none", color:'black', backgroundColor:"#696969", paddingLeft:7, paddingBottom:5}}/>
                <textarea id="commit-description" placeholder="Commit Description" 
                style={{fontSize: 15,width:"100%", height:"110px", overflow:"auto", resize: "none", fontFamily:"Arial", border:"none", paddingLeft:7, fontWeight: 15, outline:"none", color:'black', backgroundColor:"#696969", paddingLeft:5}}/>
            </div>
            <Button style={{width:"100%"}} variant="contained" color="primary"> Commit </Button>
        </div>
    )
}

function CommitModal({status, ButtonPress}){
    let stagedFiles = status.filter(status => status.isStaged);
    let unStagedFiles = status.filter(status => !status.isStaged);
    return(
        <div style={{width:"100%"}}>
            <StagingBox title="Unstaged Changes" files={unStagedFiles} buttonFunction={ButtonPress} buttonTitle="Stage All"/>
            <StagingBox title="Staged Changes"  files={stagedFiles} buttonFunction={ButtonPress} buttonTitle="Unstage All" />
            <CommitMessage/>
        </div>
    )
}

export default CommitModal;