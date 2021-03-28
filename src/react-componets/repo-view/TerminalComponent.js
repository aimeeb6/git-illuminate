import React, { Component, useEffect, useState } from 'react';
import Terminal, { ColorMode, LineType } from 'react-terminal-ui';
import  style from "./style.css"
const { ipcRenderer } = require('electron');

function TerminalComponent({ repoPath }) {
  let needListener = true;
  const [terminalLineData, setTerminalLineData] = useState([
    {
      type: LineType.Output,
      value:
        'This is a terminal emulator. It can interact with the git repository',
    },
    { type: LineType.Input, value: 'Enter you input below' },
  ]);

  let onDataEntry = (terminalInput) => {
    setTerminalLineData([
      ...terminalLineData,
      { type: LineType.Input, value: terminalInput },
    ]);
    console.log(terminalLineData);
    ipcRenderer.send('terminal.keystroke', terminalInput);
    ipcRenderer.send('terminal.keystroke', '\n');
    createlistener();
  };

  let createlistener = () =>{
    if(needListener){
      ipcRenderer.on('terminal.incomingData', (event, data) => {
        console.log(data);
        validateData(data)
        needListener = !needListener;
      })
    }
  }

  useEffect(() => {
    onDataEntry(`cd ${repoPath}`);
    onDataEntry(`git status`);
  }, []);

  useEffect(() => {}, [terminalLineData]);

  let validateData = (data) => {
    console.log(ipcRenderer.rawListeners('terminal.incomingData').length)
    let bashIndex = data.indexOf('bash-3.2$'); // specifc to macbook
    if (bashIndex == -1) {
      let dataLines = data.split('\n');
      for(let i = 0; i < dataLines.length; i++){
       let newArray = terminalLineData;
       if(newArray == terminalLineData[terminalLineData.length - 1]){

       }else{
       newArray.push({ type: 1, value: dataLines[i] });
       setTerminalLineData(newArray);
      }
    }
  }
}

  return (
      <Terminal
      className={style}
        name="Terminal"
      colorMode={ColorMode.Dark} lineData={terminalLineData} 
      onInput={(terminalInput) => onDataEntry(terminalInput)}
      />
  );
}

export default TerminalComponent;
