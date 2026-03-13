import React from 'react';
import { WebView } from 'react-native-webview';
import { View } from 'react-native';

export default function PremiumRing({ size }: { size: number }) {
  const html = `
    <html>
      <body style="margin:0; overflow:hidden; background:transparent;">
        <canvas id="c"></canvas>
        <script>
          const canvas = document.getElementById('c');
          const ctx = canvas.getContext('2d');
          const size = 300;
          canvas.width = size; canvas.height = size;
          
          function draw() {
            ctx.clearRect(0, 0, size, size);
            // Gradient złoty
            const g = ctx.createLinearGradient(0, 0, size, size);
            g.addColorStop(0, '#8a5008');
            g.addColorStop(0.5, '#ffd23c');
            g.addColorStop(1, '#8a5008');
            
            ctx.beginPath();
            ctx.arc(size/2, size/2, 100, 0, Math.PI * 2);
            ctx.strokeStyle = g;
            ctx.lineWidth = 12;
            ctx.shadowColor = '#FFD700';
            ctx.shadowBlur = 20;
            ctx.stroke();
            requestAnimationFrame(draw);
          }
          draw();
        </script>
      </body>
    </html>
  `;
  return (
    <View style={{ width: size, height: size }}>
      <WebView 
        source={{ html }} 
        style={{ backgroundColor: 'transparent' }} 
        originWhitelist={['*']} 
        transparent={true}
      />
    </View>
  );
}