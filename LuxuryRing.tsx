import React from 'react';
import { WebView } from 'react-native-webview';
import { StyleSheet, View } from 'react-native';

export default function LuxuryRing({ size }: { size: number }) {
  const html = `
    <!DOCTYPE html>
    <html>
      <body style="margin:0; overflow:hidden; background:transparent; display:flex; justify-content:center; align-items:center;">
        <canvas id="c"></canvas>
        <script>
          const canvas = document.getElementById('c');
          const ctx = canvas.getContext('2d');
          const size = 300; 
          canvas.width = size; canvas.height = size;
          let angle = 0;
          function draw() {
            ctx.clearRect(0,0, size, size);
            ctx.save();
            ctx.translate(size/2, size/2);
            ctx.rotate(angle);
            ctx.beginPath();
            ctx.arc(0, 0, 100, 0, Math.PI * 2);
            ctx.strokeStyle = '#D4AF37';
            ctx.lineWidth = 15;
            ctx.stroke();
            ctx.restore();
            angle += 0.05;
            requestAnimationFrame(draw);
          }
          draw();
        </script>
      </body>
    </html>
  `;
  return (
    <View style={{ width: size, height: size }}>
      <WebView source={{ html }} style={{ backgroundColor: 'transparent' }} originWhitelist={['*']} />
    </View>
  );
}