import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import PixelGrid from './PixelGrid';
import ColorPicker from './ColorPicker';
import { COLORS } from '../constants';

const CanvasContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.lg};
  width: 100%;
  max-width: 800px;
`;

const GridWrapper = styled.div`
  background: linear-gradient(135deg, ${theme.colors.surface}, ${theme.colors.gray[50]});
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.lg};
  padding: ${theme.spacing.md};
  border: 1px solid ${theme.colors.border};
`;

interface PixelCanvasProps {
  grid: Uint8Array;
  onPixelClick: (x: number, y: number) => void;
  size: number;
  colors?: readonly string[];
  disabled?: boolean;
  loading?: boolean;
}

const PixelCanvas: React.FC<PixelCanvasProps> = ({
  grid,
  onPixelClick,
  size,
  colors = COLORS,
  disabled = false,
  loading = false,
}) => {
  const [selectedColor, setSelectedColor] = useState(0);

  const handlePixelClick = useCallback((x: number, y: number) => {
    if (!disabled && !loading) {
      onPixelClick(x, y);
    }
  }, [onPixelClick, disabled, loading]);

  return (
    <CanvasContainer>
      <ColorPicker
        selectedColor={selectedColor}
        onColorSelect={setSelectedColor}
        colors={colors}
        disabled={disabled || loading}
        showLabel={true}
        showSelectedInfo={true}
      />
      
      <GridWrapper>
        <PixelGrid
          grid={grid}
          onPixelClick={handlePixelClick}
          size={size}
          colors={colors}
          disabled={disabled}
          loading={loading}
        />
      </GridWrapper>
    </CanvasContainer>
  );
};

export default PixelCanvas; 