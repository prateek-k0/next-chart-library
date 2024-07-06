import React from 'react'
import Image, { StaticImageData } from 'next/image'
import Link from 'next/link'

// image-imports
import arcDiagram from '@/../public/chart-thumbnails/arc-diagram.png'
import bubbleScatter from '@/../public/chart-thumbnails/bubble-scatter.png'
import chordColored from '@/../public/chart-thumbnails/chord-colored.png'
import choroplethMap from '@/../public/chart-thumbnails/choropleth.png'
import contourDensity from '@/../public/chart-thumbnails/contour-density.png'
import heatmapTooltip from '@/../public/chart-thumbnails/heatmap-tooltip.png'
import hexbinDensity from '@/../public/chart-thumbnails/hexbin-density.png'
import histogramDouble from '@/../public/chart-thumbnails/histogram-double.png'
import lineGradient from '@/../public/chart-thumbnails/line-gradient.png'
import lineMultiple from '@/../public/chart-thumbnails/line-multiple.png'
import scatter from '@/../public/chart-thumbnails/scatter.png'
import treemap from '@/../public/chart-thumbnails/treemap.png'
import zoomableBubble from '@/../public/chart-thumbnails/zoomable-bubble.png'

const imageList: { img: StaticImageData, link: string, title: string }[] = [
  { img: bubbleScatter, link: '/charts/bubble-charts/scatter-chart', title: 'Bubble scatter plot' },
  { img: chordColored, link: '/charts/pie-charts/chord-chart', title: 'Chord chart' },
  { img: choroplethMap, link: '/charts/maps/choropleth', title: 'Choropleth map' },
  { img: contourDensity, link: '/charts/area-charts/contour-density', title: 'Contour Density' },
  { img: heatmapTooltip, link: '/charts/heatmaps/interactive', title: 'Interactive Heatmap' },
  { img: hexbinDensity, link: '/charts/area-charts/hexbin-density', title: 'Hexbin density' },
  { img: histogramDouble, link: '/charts/histograms/double-histogram', title: 'Double Histogram' },
  { img: lineGradient, link: '/charts/line-charts/gradient', title: 'Line chart with gradient' },
  { img: lineMultiple, link: '/charts/line-charts/multi-line', title: 'Multi-line chart' },
  { img: scatter, link: '/charts/scatter-plots/basic', title: 'Scatter plot' },
  { img: treemap, link: '/charts/hierarchical/treemap-basic', title: 'Treemap' },
  { img: zoomableBubble, link: '/charts/bubble-charts/circular-packing-zoomable', title: 'Zoomable bubble chart' },
  { img: arcDiagram, link: '/charts/arc-diagrams/basic-arc-diagram', title: 'Basic Arc Diagram' },
]

const ImageCollage = () => {
  return (
    <div className='w-full columns-1 gap-4 md:columns-2 lg:columns-3 rounded-lg bg-zinc-700 p-4'>
      {imageList.map((image, i) => (
        <Link href={image.link} key={i}>
          <div className='group mb-4 rounded-lg overflow-hidden relative group'>
            <Image src={image.img} alt={image.title} className=' transition-transform group-hover:scale-110'></Image>
            <div className="desc absolute top-0 w-full h-full backdrop backdrop-blur-[4px] opacity-0 group-hover:opacity-100 transition-all duration-200 ease-out bg-[#50678551] flex items-center justify-center">
              <p className='text-center translate-y-2 group-hover:translate-y-0 transition-transform mx-2 my-auto text-2xl font-medium text-white font-sans'>
                {image.title}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default ImageCollage
