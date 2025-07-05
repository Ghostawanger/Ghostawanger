import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Rect, Text as SvgText } from 'react-native-svg';
import { EdgeBanding } from '../types';

interface FurnitureDrawingProps {
  length: number;
  width: number;
  edgeBanding: EdgeBanding;
}

const FurnitureDrawing: React.FC<FurnitureDrawingProps> = ({ length, width, edgeBanding }) => {
  const screenWidth = Dimensions.get('window').width;
  const drawingWidth = screenWidth - 40;
  const drawingHeight = 200;
  
  // Proportional sizing
  const ratio = Math.min(drawingWidth / length, drawingHeight / width);
  const rectWidth = Math.max(length * ratio, 100);
  const rectHeight = Math.max(width * ratio, 60);
  
  // Center the rectangle
  const x = (drawingWidth - rectWidth) / 2;
  const y = (drawingHeight - rectHeight) / 2;
  
  const strokeWidth = 3;
  const edgeStrokeWidth = 8;

  return (
    <View style={styles.container}>
      <Svg width={drawingWidth} height={drawingHeight} viewBox={`0 0 ${drawingWidth} ${drawingHeight}`}>
        {/* Main rectangle */}
        <Rect
          x={x}
          y={y}
          width={rectWidth}
          height={rectHeight}
          fill="#f0f0f0"
          stroke="#333"
          strokeWidth={strokeWidth}
        />
        
        {/* Edge banding lines */}
        {/* Top edge */}
        {edgeBanding.top && (
          <Rect
            x={x}
            y={y - edgeStrokeWidth/2}
            width={rectWidth}
            height={edgeStrokeWidth}
            fill="#000"
          />
        )}
        
        {/* Right edge */}
        {edgeBanding.right && (
          <Rect
            x={x + rectWidth - edgeStrokeWidth/2}
            y={y}
            width={edgeStrokeWidth}
            height={rectHeight}
            fill="#000"
          />
        )}
        
        {/* Bottom edge */}
        {edgeBanding.bottom && (
          <Rect
            x={x}
            y={y + rectHeight - edgeStrokeWidth/2}
            width={rectWidth}
            height={edgeStrokeWidth}
            fill="#000"
          />
        )}
        
        {/* Left edge */}
        {edgeBanding.left && (
          <Rect
            x={x - edgeStrokeWidth/2}
            y={y}
            width={edgeStrokeWidth}
            height={rectHeight}
            fill="#000"
          />
        )}
        
        {/* Dimension labels */}
        <SvgText
          x={x + rectWidth/2}
          y={y - 15}
          textAnchor="middle"
          fontSize="12"
          fill="#666"
        >
          {length} cm
        </SvgText>
        
        <SvgText
          x={x - 15}
          y={y + rectHeight/2}
          textAnchor="middle"
          fontSize="12"
          fill="#666"
          transform={`rotate(-90, ${x - 15}, ${y + rectHeight/2})`}
        >
          {width} cm
        </SvgText>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default FurnitureDrawing;