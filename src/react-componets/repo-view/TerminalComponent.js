import React, { Component, useEffect, useState } from 'react';
import Terminal, { ColorMode, LineType } from 'react-terminal-ui';
import  style from "./style.css"
const { ipcRenderer } = require('electron');

function TerminalComponent({ repoPath, currentCommand, setCommand }) {
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
  };


  useEffect(() => {
    let listener = ipcRenderer.rawListeners('terminal.incomingData').length
    if(listener == 0){
      ipcRenderer.on('terminal.incomingData', (event, data) => {
        console.log(data, listener);
        validateData(data)
      })
    }
    onDataEntry(`cd ${repoPath}`);
    onDataEntry(`git status`);
  }, []);

  useEffect(() => {}, [terminalLineData]);

  useEffect(() => {
    if(currentCommand != ''){
      onDataEntry(`git ${currentCommand}`);
    }
    setCommand('')
  }, [currentCommand]);

  let validateData = (data) => {
    console.log(ipcRenderer.rawListeners('terminal.incomingData').length)
    data = data.replace("[32m", "\n");
    data = data.replace("[m", "\n");
    data = data.replace(RegExp(String.fromCharCode(32)),"");
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
