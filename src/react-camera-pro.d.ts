// react-camera-pro.d.ts
declare module 'react-camera-pro' {
  import { ForwardRefExoticComponent, RefAttributes } from 'react';

  interface CameraProps extends RefAttributes<unknown> {
    aspectRatio?: number;
    facingMode?: 'user' | 'environment';
    onTakePhoto?: (dataUri: string) => void;
    idealFacingMode?: 'user' | 'environment';
    idealResolution?: { width: number; height: number };
    imageType?: 'png' | 'jpg';
    imageCompression?: number;
    isMaxResolution?: boolean;
    isImageMirror?: boolean;
    isDisplayStartCameraError?: boolean;
    sizeFactor?: number;
  }

  const Camera: ForwardRefExoticComponent<CameraProps>;
  export default Camera;
}
