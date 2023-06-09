import React, { Component } from 'react';
import * as faceapi from 'face-api.js';

function getLabeledFaceDescriptions() {
  const labels = ['Felipe', 'Messi', 'Data'];
  return Promise.all(
    labels.map(async (label) => {
      const descriptions = [];
      for (let i = 1; i <= 2; i++) {
        const img = await faceapi.fetchImage(`./labels/${label}/${i}.png`);
        const detections = await faceapi
          .detectSingleFace(img)
          .withFaceLandmarks()
          .withFaceDescriptor();
        descriptions.push(detections.descriptor);
      }
      return new faceapi.LabeledFaceDescriptors(label, descriptions);
    })
  );
}
const getDescriptors = async () => {
  const users = localStorage.getItem('users');
  return Promise.all(
    users.map(async (user) => {
      const descriptions = [];
      //cargar objeto img con la imagen en base64
      const img = await faceapi.fetchImage(user.photo);
      //detectar rostro
      const detections = await faceapi
        .detectSingleFace(img)
        .withFaceLandmarks()
        .withFaceDescriptor();
      descriptions.push(detections.descriptor);
      return new faceapi.LabeledFaceDescriptors(user.name, descriptions);
    })
  );
};

const faceRecognition = async () => {
  setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(viedoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptors();
    canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(
      viedoRef.current
    );
    faceapi.matchDimensions(canvasRef.current, viedoRef.current);
    const resizedDetections = faceapi.resizeResults(detections, {
      width: 320,
      height: 240,
    });
    faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
  }, 100);
};
