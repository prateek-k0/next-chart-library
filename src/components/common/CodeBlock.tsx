'use client';

import React from 'react'
import { CopyBlock, dracula } from 'react-code-blocks';

const CodeBlock = ({ scriptText }: { scriptText: string }) => {
  return (
    <div className="rounded-lg overflow-hidden code-block">
      <div className='max-h-[2880px] overflow-y-auto'>
        <CopyBlock 
          text={scriptText}
          language='jsx'
          showLineNumbers={true}
          wrapLongLines={true}
          theme={dracula}
        />
      </div>
    </div>
  )
}

export default CodeBlock