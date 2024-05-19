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
  { img: arcMouseevents, link: '/charts/arc-diagrams/interactive-arc-diagram', title: 'Interactive Arc Diagram' },
  { img: bubbleScatter, link: '/charts/bubble-charts/scatter-chart', title: 'Bubble scatter plot' },
  { img: chordColored, link: '/charts/pie-charts/chord-chart', title: 'Chord chart' },
  { img: choroplethMap, link: '/charts/maps/choropleth', title: 'Choropleth map' },
  { img: contourDensity, link: '/charts/area-charts/contour-density', title: 'Contour Density' },
  { img: density, link: '/charts/area-charts/density', title: 'Density' },
  { img: donut, link: '/charts/pie-charts/donut-chart', title: 'Donut' },
  { img: dottedBar, link: '/charts/bar-charts/dotted-bar-chart', title: 'Dotted bar chart' },
  { img: heatmapTooltip, link: '/charts/heatmaps/interactive', title: 'Interactive Heatmap' },
  { img: forceBubbles, link: '/charts/bubble-charts/force-simulated-bubbles', title: 'Force Simulated Bubbles' },
  { img: hexbinDensity, link: '/charts/area-charts/hexbin-density', title: 'Hexbin density' },
  { img: histogramDouble, link: '/charts/histograms/double-histogram', title: 'Double Histogram' },
  { img: lineGradient, link: '/charts/line-charts/gradient', title: 'Line chart with gradient' },
  { img: lineMultiple, link: '/charts/line-charts/multi-line', title: 'Multi-line chart' },
  { img: PiePercDist, link: '/charts/pie-charts/percentage-distribution', title: 'Pie chart - Percentage distribution' },
  { img: scatter, link: '/charts/scatter-plots/basic', title: 'Scatter plot' },
  { img: sunburst, link: '/charts/pie-charts/sunburst-chart', title: 'Sunburst' },
  { img: treemap, link: '/charts/hierarchical/treemap-basic', title: 'Treemap' },
  { img: zoomableBubble, link: '/charts/bubble-charts/circular-packing-zoomable', title: 'Zoomable bubble chart' },
  { img: arcDiagram, link: '/charts/arc-diagrams/basic-arc-diagram', title: 'Basic Arc Diagram' },
]

const ImageCollage = () => {
  return (
    <div className='w-full columns-1 gap-4 md:columns-2 lg:columns-3 rounded-lg bg-zinc-700 p-4'>
      {imageList.map((image, i) => (
        <Link href={image.link} key={i}>
          <div className='mb-4 rounded-lg overflow-hidden relative group'>
            <Image src={image.img} alt={image.title}></Image>
            <div className="desc absolute top-0 w-full h-full backdrop backdrop-blur-[4px] opacity-0 group-hover:opacity-100 transition-all duration-200 ease-out bg-[#50678551] flex items-center justify-center">
              <p className='text-center translate-y-2 group-hover:translate-y-0 transition-transform duration-200 mx-2 my-auto text-2xl font-medium text-white font-sans'>
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