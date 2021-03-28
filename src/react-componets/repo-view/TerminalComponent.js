import React, { Component, useEffect, useState } from 'react';
import Terminal, { ColorMode, LineType } from 'react-terminal-ui';
import  style from "./style.css"
const { ipcRenderer } = require('electron');

function TerminalComponent({ repoPath }) {
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
    ipcRenderer.on('terminal.incomingData', (event, data) => {
      validateData(data)
    })
    
  };

  useEffect(() => {
    onDataEntry(`cd ${repoPath}`);
    onDataEntry(`git status`);
    let terminalDiv = document.getElementsByClassName('re')
  }, []);

  useEffect(() => {}, [terminalLineData]);

  let validateData = (data) => {
    let bashIndex = data.indexOf('bash-3.2$'); // specifc to macbook
    if (bashIndex == -1) {
      data = data;
    } else {
      data = data.substring(0, bashIndex);
    }

    if (!(data == '' || data == '\n' || data == '\r')) {
      let previousValue = terminalLineData[terminalLineData.length - 1].value;
      if (data != previousValue) {
        if(data.includes('\n')){
           let dataLines = data.split('\n');
           for(let i = 0; i < dataLines.length; i++){
            let newArray = terminalLineData;
            newArray.push({ type: 1, value: dataLines[i] });
            setTerminalLineData(newArray);
           }
        }else{
            let newArray = terminalLineData;
            newArray.push({ type: 1, value: data });
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
