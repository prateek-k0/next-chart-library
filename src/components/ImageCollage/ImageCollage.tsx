import React from 'react'
import Image, { StaticImageData } from 'next/image'
import Link from 'next/link'

// image-imports
import arcDiagram from '@/../public/chart-thumbnails/arc-diagram.png'
import arcMouseevents from '@/../public/chart-thumbnails/arc-mouseevents.png'
import bubbleScatter from '@/../public/chart-thumbnails/bubble-scatter.png'
import chordColored from '@/../public/chart-thumbnails/chord-colored.png'
import choroplethMap from '@/../public/chart-thumbnails/choropleth.png'
import contourDensity from '@/../public/chart-thumbnails/contour-density.png'
import density from '@/../public/chart-thumbnails/density.png'
import donut from '@/../public/chart-thumbnails/donut.png'
import dottedBar from '@/../public/chart-thumbnails/dotted-bar.png'
import heatmapTooltip from '@/../public/chart-thumbnails/heatmap-tooltip.png'
import hexbinDensity from '@/../public/chart-thumbnails/hexbin-density.png'
import histogramDouble from '@/../public/chart-thumbnails/histogram-double.png'
import lineGradient from '@/../public/chart-thumbnails/line-gradient.png'
import lineMultiple from '@/../public/chart-thumbnails/line-multiple.png'
import PiePercDist from '@/../public/chart-thumbnails/pie-perc-distribution.png'
import scatter from '@/../public/chart-thumbnails/scatter.png'
import sunburst from '@/../public/chart-thumbnails/sunburst.png'
import treemap from '@/../public/chart-thumbnails/treemap.png'
import zoomableBubble from '@/../public/chart-thumbnails/zoomable-bubble.png'
import forceBubbles from '@/../public/chart-thumbnails/force-simulated-bubbles.png'

const imageList: { img: StaticImageData, link: string, title: string }[] = [
  { img: arcMouseevents, link: '/arc-diagrams/interactive-arc-diagram', title: 'Interactive Arc Diagram' },
  { img: bubbleScatter, link: '/bubble-charts/scatter-chart', title: 'Bubble scatter plot' },
  { img: chordColored, link: '/pie-charts/chord-chart', title: 'Chord chart' },
  { img: choroplethMap, link: '/maps/choropleth', title: 'Choropleth map' },
  { img: contourDensity, link: '/area-charts/contour-density', title: 'Contour Density' },
  { img: density, link: '/area-charts/density', title: 'Density' },
  { img: donut, link: '/pie-charts/donut-chart', title: 'Donut' },
  { img: dottedBar, link: '/bar-charts/dotted-bar-chart', title: 'Dotted bar chart' },
  { img: heatmapTooltip, link: '/heatmaps/interactive', title: 'Interactive Heatmap' },
  { img: forceBubbles, link: '/bubble-charts/force-simulated-bubbles', title: 'Force Simulated Bubbles' },
  { img: hexbinDensity, link: '/area-charts/hexbin-density', title: 'Hexbin density' },
  { img: histogramDouble, link: '/histograms/double-histogram', title: 'Double Histogram' },
  { img: lineGradient, link: '/line-charts/gradient', title: 'Line chart with gradient' },
  { img: lineMultiple, link: '/line-charts/multi-line', title: 'Multi-line chart' },
  { img: PiePercDist, link: '/pie-charts/percentage-distribution', title: 'Pie chart - Percentage distribution' },
  { img: scatter, link: '/scatter-plots/basic', title: 'Scatter plot' },
  { img: sunburst, link: '/pie-charts/sunburst-chart', title: 'Sunburst' },
  { img: treemap, link: '/treemaps/basic', title: 'Treemap' },
  { img: zoomableBubble, link: '/bubble-charts/circular-packing-zoomable', title: 'Zoomable bubble chart' },
  { img: arcDiagram, link: '/arc-diagrams/basic-arc-diagram', title: 'Basic Arc Diagram' },
]

const ImageCollage = () => {
  return (
    <div className='w-full columns-1 gap-4 md:columns-2 lg:columns-3 rounded-lg bg-zinc-700 p-4'>
      {imageList.map((image, i) => (
        <Link href={image.link} key={i}>
          <div className='mb-4 rounded-lg overflow-hidden relative group'>
            <Image src={image.img} alt={image.title}></Image>
            <div className="desc absolute w-full h-full backdrop backdrop-blur-sm top-full group-hover:top-0 transition-all duration-200 ease-out bg-[#1c131330] opacity-0 group-hover:opacity-100 flex items-center justify-center">
              <p className='text-center mx-2 my-auto text-2xl font-medium text-white font-sans'>
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