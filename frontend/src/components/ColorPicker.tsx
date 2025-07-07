import React, { useCallback } from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { COLORS, ARIA_LABELS } from '../constants';

interface ColorPickerProps {
  selectedColor: number;
  onColorSelect: (color: number) => void;
  colors?: readonly string[];
  disabled?: boolean;
  showLabel?: boolean;
  showSelectedInfo?: boolean;
}

const ColorPickerContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.md};
  background-color: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.md};
  max-width: 400px;
  margin: 0 auto;
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.sm};
    gap: ${theme.spacing.xs};
  }
`;

const ColorButton = styled.button<{ isSelected: boolean; color: string }>`
  width: 3rem;
  height: 3rem;
  border: 3px solid ${({ isSelected }) => 
    isSelected ? theme.colors.textPrimary : theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  transition: ${theme.transitions.fast};
  background-color: ${({ color }) => color};
  outline: none;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: ${theme.shadows.lg};
  }
  
  &:focus {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 2px;
  }
  
  &:active {
    transform: scale(1.05);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    width: 2.5rem;
    height: 2.5rem;
    border-width: 2px;
  }
`;

const ColorPickerLabel = styled.label`
  font-size: ${theme.fontSizes.md};
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.textPrimary};
  margin-bottom: ${theme.spacing.sm};
  display: block;
  text-align: center;
`;

const ColorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  margin-top: ${theme.spacing.sm};
  padding: ${theme.spacing.sm};
  background-color: ${theme.colors.gray[50]};
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.textSecondary};
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.fontSizes.xs};
  }
`;

const SelectedColorIndicator = styled.div<{ color: string }>`
  width: 1.5rem;
  height: 1.5rem;
  border-radius: ${theme.borderRadius.sm};
  background-color: ${({ color }) => color};
  border: 1px solid ${theme.colors.border};
`;

const ColorPicker = React.memo<ColorPickerProps>(({ 
  selectedColor, 
  onColorSelect, 
  colors = COLORS,
  disabled = false,
  showLabel = true,
  showSelectedInfo = true 
}) => {
  const handleColorSelect = useCallback((colorIndex: number) => {
    if (!disabled) {
      onColorSelect(colorIndex);
    }
  }, [onColorSelect, disabled]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent, colorIndex: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleColorSelect(colorIndex);
    }
  }, [handleColorSelect]);

  return (
    <div>
      {showLabel && (
        <ColorPickerLabel>
          Choose a color for your pixel
        </ColorPickerLabel>
      )}
      
      <ColorPickerContainer>
        {colors.map((color, index) => (
          <ColorButton
            key={index}
            color={color}
            isSelected={index === selectedColor}
            onClick={() => handleColorSelect(index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            disabled={disabled}
            aria-label={`${ARIA_LABELS.COLOR_PICKER} ${index + 1}: ${color}`}
            aria-pressed={index === selectedColor}
            title={`Color ${index + 1}: ${color}`}
          />
        ))}
      </ColorPickerContainer>
      
      {showSelectedInfo && (
        <ColorInfo>
          <SelectedColorIndicator color={colors[selectedColor]} />
          <span>
            Selected: Color {selectedColor + 1} ({colors[selectedColor]})
          </span>
        </ColorInfo>
      )}
    </div>
  );
});

ColorPicker.displayName = 'ColorPicker';

export default ColorPicker; 