'use client';

import React from 'react'
import { CopyBlock, dracula } from 'react-code-blocks';

const CodeBlock = ({ scriptText }: { scriptText: string }) => {
  return (
    <div className="rounded-lg overflow-hidden">
      <CopyBlock 
        text={scriptText}
        language='jsx'
        showLineNumbers={true}
        wrapLongLines={true}
        theme={dracula}
      />
    </div>
  )
}

export default CodeBlock