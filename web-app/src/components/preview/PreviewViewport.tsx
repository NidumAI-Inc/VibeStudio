
import { forwardRef } from "react";
import { ViewMode } from "./ViewModeToggle";

interface PreviewViewportProps {
  previewUrl: string;
  viewMode: ViewMode;
  refreshKey: number;
  onLoad: () => void;
  onError: () => void;
}

const getViewportStyles = (mode: ViewMode) => {
  switch (mode) {
    case 'mobile':
      return { width: '375px', height: '667px' };
    case 'tablet':
      return { width: '768px', height: '1024px' };
    case 'desktop':
    default:
      return { width: '100%', height: '100%' };
  }
};

const PreviewViewport = forwardRef<HTMLIFrameElement, PreviewViewportProps>(
  ({ previewUrl, viewMode, refreshKey, onLoad, onError }, ref) => {
    const viewportStyles = getViewportStyles(viewMode);

    return (
      <div 
        className="flex items-center justify-center w-full h-full"
        style={{ 
          padding: viewMode !== 'desktop' ? '20px' : '0',
          backgroundColor: viewMode !== 'desktop' ? '#1a1a1a' : 'transparent'
        }}
      >
        <div
          className="bg-white rounded-lg overflow-hidden shadow-2xl"
          style={{
            ...viewportStyles,
            maxWidth: '100%',
            maxHeight: '100%',
            border: viewMode !== 'desktop' ? '1px solid #333' : 'none'
          }}
        >
          <iframe
            key={`iframe-${refreshKey}`}
            ref={ref}
            src={`${previewUrl}?t=${Date.now()}`}
            className="w-full h-full"
            title="App Preview"
            style={{ border: 'none' }}
            onError={onError}
            onLoad={onLoad}
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
          />
        </div>
      </div>
    );
  }
);

PreviewViewport.displayName = "PreviewViewport";

export default PreviewViewport;
