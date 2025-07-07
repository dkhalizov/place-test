import React, { useRef, useState, useEffect, useCallback } from 'react';
import { INITIAL_ZOOM, MAX_ZOOM, MIN_ZOOM } from '../constants';

interface PixelGridProps {
  grid: Uint8Array;
  onPixelClick: (x: number, y: number) => void;
  size: number;
  colors: readonly string[];
  connectedClients?: number;
  disabled?: boolean;
  loading?: boolean;
}

interface CanvasPosition {
  x: number;
  y: number;
}

const PixelGrid = React.memo<PixelGridProps>(({ 
  grid, 
  onPixelClick, 
  size, 
  colors, 
  connectedClients = 0,
  disabled = false,
  loading = false
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [zoom, setZoom] = useState(INITIAL_ZOOM);
    const [offset, setOffset] = useState<CanvasPosition>({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [hoveredPixel, setHoveredPixel] = useState<CanvasPosition | null>(null);
    const lastMousePosRef = useRef<CanvasPosition>({ x: 0, y: 0 });

    const drawGrid = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        const canvasSize = Math.min(canvas.width, canvas.height);
        const scaleFactor = canvasSize / size;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        ctx.scale(zoom, zoom);
        ctx.translate(-offset.x, -offset.y);

        // Draw pixels
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const index = y * size + x;
                const colorIndex = grid[index];
                ctx.fillStyle = colors[colorIndex];
                ctx.fillRect(x * scaleFactor, y * scaleFactor, scaleFactor, scaleFactor);
            }
        }

        // Draw grid lines
        ctx.strokeStyle = 'rgba(200, 200, 200, 0.5)';
        ctx.lineWidth = 0.5 / zoom;
        for (let x = 0; x <= size; x++) {
            ctx.beginPath();
            ctx.moveTo(x * scaleFactor, 0);
            ctx.lineTo(x * scaleFactor, size * scaleFactor);
            ctx.stroke();
        }
        for (let y = 0; y <= size; y++) {
            ctx.beginPath();
            ctx.moveTo(0, y * scaleFactor);
            ctx.lineTo(size * scaleFactor, y * scaleFactor);
            ctx.stroke();
        }

        ctx.restore();

        // Highlight hovered pixel
        if (hoveredPixel) {
            const { x, y } = hoveredPixel;
            ctx.save();
            ctx.scale(zoom, zoom);
            ctx.translate(-offset.x, -offset.y);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.lineWidth = 2 / zoom;
            ctx.strokeRect(
                x * scaleFactor,
                y * scaleFactor,
                scaleFactor,
                scaleFactor
            );
            ctx.restore();
        }
    }, [grid, size, colors, zoom, offset, hoveredPixel, connectedClients]);

    useEffect(() => {
        drawGrid();
    }, [drawGrid]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const updateCanvasSize = () => {
            const containerWidth = canvas.parentElement?.clientWidth || 1000;
            const containerHeight = canvas.parentElement?.clientHeight || 1000;
            const canvasSize = Math.min(containerWidth, containerHeight);
            canvas.width = canvasSize;
            canvas.height = canvasSize;
            drawGrid();
        };

        updateCanvasSize();
        window.addEventListener('resize', updateCanvasSize);

        return () => {
            window.removeEventListener('resize', updateCanvasSize);
        };
    }, [drawGrid]);

    const handleWheel = useCallback((event: WheelEvent) => {
        event.preventDefault();
        const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1;
        setZoom((prevZoom) => {
            const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, prevZoom * zoomFactor));
            const canvasRect = canvasRef.current?.getBoundingClientRect();
            if (!canvasRect) return prevZoom;
            
            const mouseX = event.clientX - canvasRect.left;
            const mouseY = event.clientY - canvasRect.top;

            setOffset((prevOffset) => {
                const newOffsetX = mouseX / prevZoom + prevOffset.x - mouseX / newZoom;
                const newOffsetY = mouseY / prevZoom + prevOffset.y - mouseY / newZoom;
                
                // Calculate the maximum allowed offset
                const maxOffsetX = size - size / newZoom;
                const maxOffsetY = size - size / newZoom;
                
                return {
                    x: Math.max(0, Math.min(newOffsetX, maxOffsetX)),
                    y: Math.max(0, Math.min(newOffsetY, maxOffsetY))
                };
            });

            return newZoom;
        });
    }, [size]);

    const handleMouseDown = useCallback((event: React.MouseEvent) => {
        if (disabled || loading) return;
        setIsDragging(true);
        lastMousePosRef.current = { x: event.clientX, y: event.clientY };
    }, [disabled, loading]);

     const handleMouseMove = useCallback((event: React.MouseEvent) => {
         if (isDragging) {
             const dx = event.clientX - lastMousePosRef.current.x;
             const dy = event.clientY - lastMousePosRef.current.y;

             setOffset((prevOffset) => {
                 const newOffsetX = prevOffset.x - dx / zoom;
                 const newOffsetY = prevOffset.y - dy / zoom;

                 // Calculate the maximum allowed offset
                 const maxOffsetX = size - size / zoom;
                 const maxOffsetY = size - size / zoom;

                 // Clamp the offset values
                 return {
                     x: Math.max(0, Math.min(newOffsetX, maxOffsetX)),
                     y: Math.max(0, Math.min(newOffsetY, maxOffsetY))
                 };
             });

             lastMousePosRef.current = { x: event.clientX, y: event.clientY };
         } else {
             const canvas = canvasRef.current;
             if (!canvas) return;

             const rect = canvas.getBoundingClientRect();
             const canvasSize = rect.width;
             const scaleFactor = canvasSize / size;
                  // Calculate pixel coordinates relative to the grid
                  const mouseX = event.clientX - rect.left;
                  const mouseY = event.clientY - rect.top;
                  const x = Math.floor(mouseX / (scaleFactor * zoom) + offset.x);
                  const y = Math.floor(mouseY / (scaleFactor * zoom) + offset.y);
     
             if (x >= 0 && x < size && y >= 0 && y < size) {
                 setHoveredPixel({ x, y });
             } else {
                 setHoveredPixel(null);
             }
         }
     }, [isDragging, zoom, size, offset]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setIsDragging(false);
        setHoveredPixel(null);
    }, []);

    const handleClick = useCallback((event: React.MouseEvent) => {
        if (disabled || loading) return;
        
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const canvasSize = rect.width;
        const scaleFactor = canvasSize / size;
        const x = Math.floor((event.clientX - rect.left) / (scaleFactor * zoom) + offset.x);
        const y = Math.floor((event.clientY - rect.top) / (scaleFactor * zoom) + offset.y);

        if (x >= 0 && x < size && y >= 0 && y < size) {
            onPixelClick(x, y);
        }
    }, [onPixelClick, size, zoom, offset, disabled, loading]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.addEventListener('wheel', handleWheel, { passive: false });
        return () => {
            canvas.removeEventListener('wheel', handleWheel);
        };
    }, [handleWheel]);

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%', aspectRatio: '1 / 1' }}>
            <canvas
                width={1000}
                height={1000}
                ref={canvasRef}
                onClick={handleClick}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                style={{
                    cursor: isDragging ? 'grabbing' : (hoveredPixel ? 'crosshair' : 'grab'),
                    opacity: loading ? 0.7 : 1,
                    pointerEvents: disabled ? 'none' : 'auto',
                }}
            />
        </div>
    );
});

PixelGrid.displayName = 'PixelGrid';

export default PixelGrid;