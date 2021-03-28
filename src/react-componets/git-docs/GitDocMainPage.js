import React, {useState} from 'react';
import GitNavigation from './GitNavigation'

function GitDocMainPage(){
    const [currentDocument, setCurrentDocument] = useState('What is Git?');

    return(
        <div>
            <GitNavigation />
            {currentDocument}
        </div>
    )
}
export default GitDocMainPage;