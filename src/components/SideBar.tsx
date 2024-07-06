'use client';
import React from 'react'
import { ChartDataType } from '@/utils/fetchChartsUtils'
import LinkAccordian from './common/LinkAccordian';

const SideBar = ({ fileData, onClose }: { fileData: ChartDataType[], onClose: () => void }) => {
  return (
    <div className='absolute top-16 left-0 w-full flex overflow-hidden z-10' style={{ height: 'calc(100vh - 64px)'}}>
      <div className="sidebar w-96 col-span-1 absolute top-0 z-10 left-0 my-4 mx-4 rounded-lg border-2 border-zinc-500 overflow-hidden" style={{ height: 'calc(100vh - 96px)'}}>
        <div className='overflow-x-hidden overflow-y-auto h-full box-content bg-zinc-700'>
          {
            fileData.map((chart) => <LinkAccordian linkData={chart} key={chart.chartType} />)
          }
        </div>
      </div>
      <div className="backdrop col-span-3 backdrop-blur-sm flex-grow cursor-pointer" onClick={onClose}></div>
    </div>
  )
}

export default SideBar