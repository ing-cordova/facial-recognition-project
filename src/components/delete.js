import * as faceapi from 'face-api.js';
import React, { useEffect } from 'react';

import '../styles/global.js';

const Delete = () => {
  const viedoRef = React.useRef(null);
  const canvasRef = React.useRef(null);

  useEffect(() => {
    startVideo();
    loadModels();
  });

  //inicio de la camara
  const startVideo = () => {
    navigator.getUserMedia(
      { video: {} },
      (stream) => (viedoRef.current.srcObject = stream),
      (err) => console.error(err)
    );
  };

  //cargar los modelos
  const loadModels = async () => {
    const MODEL_URL = '/models';
    Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
    ]).then(() => {
      faceMyDetector();
    });
  };

  const faceMyDetector = async () => {
    const labeledFaceDescriptors = await getDescriptors();
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors);

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

      ///***********
      const results = resizedDetections.map((d) => {
        return faceMatcher.findBestMatch(d.descriptor);
      });
      results.forEach((result, i) => {
        const box = resizedDetections[i].detection.box;
        const drawBox = new faceapi.draw.DrawBox(box, {
          label: result,
        });
        if (result._label === 'unknown') {
          console.log('desconocido');
        } else {
          console.log('conocido');
        }
        drawBox.draw(canvasRef.current);
      });
    }, 100);
  };

  ////********************************************************  */
  const getDescriptors = async () => {
    const users = JSON.parse(localStorage.getItem('data'));
    return Promise.all(
      users.map(async (user) => {
        const descriptions = [];
        //cargar objeto img con la imagen en base64
        const img = await faceapi.fetchImage(user.imagenPerfil);
        //detectar rostro
        const detections = await faceapi
          .detectSingleFace(img)
          .withFaceLandmarks()
          .withFaceDescriptor();
        descriptions.push(detections.descriptor);
        return new faceapi.LabeledFaceDescriptors(user.nombre, descriptions);
      })
    );
  };

  return (
    <div className="main">
      <div className="appface">
        <div className="video">
          <video
            crossOrigin="anonymous"
            ref={viedoRef}
            autoPlay
            width={320}
            height={240}
          ></video>
        </div>
        <div className="canva">
          <canvas ref={canvasRef} width={320} height={240} id="canva1"></canvas>
        </div>
      </div>
    </div>
  );
};

export default Delete;
