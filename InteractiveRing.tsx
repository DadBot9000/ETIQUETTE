import React from 'react';
import { WebView } from 'react-native-webview';
import { StyleSheet } from 'react-native';

interface Props {
  size: number;
}

export default function InteractiveRing({ size }: Props) {
  const html = `
    <!DOCTYPE html>
    <html>
      <body style="margin:0; overflow:hidden; background:transparent; display:flex; justify-content:center; align-items:center;">
        <canvas id="c"></canvas>
        <script>
          const canvas = document.getElementById('c');
          const ctx = canvas.getContext('2d');
          const size = ${size};
          canvas.width = size;
          canvas.height = size;
          
          let angle = 0;
          let spinning = false;

          function draw() {
            ctx.clearRect(0, 0, size, size);
            ctx.save();
            ctx.translate(size/2, size/2);
            ctx.rotate(angle);
            ctx.beginPath();
            ctx.arc(0, 0, size * 0.4, 0, Math.PI * 2);
            ctx.strokeStyle = '#D4AF37';
            ctx.lineWidth = 4;
            ctx.stroke();
            ctx.restore();
            
            if (spinning) {
              angle += 0.2;
              if (angle >= Math.PI * 2) { spinning = false; angle = 0; }
            }
            requestAnimationFrame(draw);
          }

          canvas.addEventListener('touchstart', () => { 
            spinning = true; 
            try { window.ReactNativeWebView.postMessage('RING_CLICKED'); } catch(e) {}
          });
          draw();
        </script>
      </body>
    </html>
  `;

  return (
    <WebView 
      source={{ html }} 
      style={{ backgroundColor: 'transparent', width: size, height: size }} 
      scrollEnabled={false}
      containerStyle={{ backgroundColor: 'transparent' }}
      originWhitelist={['*']}
    />
  );
}