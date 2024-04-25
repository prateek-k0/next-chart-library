'use client';
import React from 'react'
import { ChartDataType } from '@/utils/fetchChartsUtils'
import LinkAccordian from './common/LinkAccordian';

const SideBar = ({ fileData, onClose }: { fileData: ChartDataType[], onClose: () => void }) => {
  return (
    <div className='absolute top-16 left-0 w-full flex overflow-hidden z-10' style={{ height: 'calc(100vh - 64px)'}}>
      <div className="sidebar w-96 col-span-1 bg-zinc-700 overflow-x-hidden overflow-y-auto">
        {
          fileData.map((chart) => <LinkAccordian linkData={chart} key={chart.chartType} />)
        }
      </div>
      <div className="backdrop col-span-3 backdrop-blur-sm flex-grow cursor-pointer" onClick={onClose}></div>
    </div>
  )
}

export default SideBar