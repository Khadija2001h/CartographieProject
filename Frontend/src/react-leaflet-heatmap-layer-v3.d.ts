// src/react-leaflet-heatmap-layer-v3.d.ts

declare module 'react-leaflet-heatmap-layer-v3' {
    import { FC } from 'react';
    import { LayerProps } from 'react-leaflet';
    import { HeatmapOptions } from 'leaflet';
  
    interface CustomHeatmapLayerProps extends HeatmapLayerProps {
      points: Array<[number, number, number]>; // Add the points property explicitly
      longitudeExtractor: (point: [number, number, number]) => number;
      latitudeExtractor: (point: [number, number, number]) => number;
      intensityExtractor: (point: [number, number, number]) => number;
      fitBoundsOnLoad?: boolean;
      fitBoundsOnUpdate?: boolean;
      radius?: number;
      blur?: number;
      max?: number;
      minOpacity?: number;
    }
  
    const HeatmapLayer: FC<CustomHeatmapLayerProps>;
    export default HeatmapLayer;
  }
  
  
  