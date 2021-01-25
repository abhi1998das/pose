// 1. Install dependencies DONE
// 2. Import dependencies DONE
// 3. Setup webcam and canvas DONE
// 4. Define references to those DONE
// 5. Load posenet DONE
// 6. Detect function DONE
// 7. Drawing utilities from tensorflow DONE
// 8. Draw functions DONE

import React, { useRef } from "react";
import { useState } from "react";
import "./App.css";
import * as tf from "@tensorflow/tfjs";
import * as posenet from "@tensorflow-models/posenet";
import Webcam from "react-webcam";

import { drawKeypoints, drawSkeleton } from "./utilities";

function find_angle(A, B, C) {
  var AB = Math.sqrt(Math.pow(B.x - A.x, 2) + Math.pow(B.y - A.y, 2));
  var BC = Math.sqrt(Math.pow(B.x - C.x, 2) + Math.pow(B.y - C.y, 2));
  var AC = Math.sqrt(Math.pow(C.x - A.x, 2) + Math.pow(C.y - A.y, 2));
  return Math.acos((BC * BC + AB * AB - AC * AC) / (2 * BC * AB));
}

var prev_angle = 86;
var squates = 0;
var prev_to_prev = 98;
function App() {
  const [squatcount, setsquatcount] = useState(0);
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  var flag = 0;

  //  Load posenet
  const runPosenet = async () => {
    const net = await posenet.load({
      inputResolution: { width: 640, height: 480 },
      scale: 0.5,
    });
    //
    setInterval(() => {
      detect(net);
    }, 600);
  };

  var detect = async (net) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Make Detections
      const pose = await net.estimateSinglePose(video);
      //console.log(pose["keypoints"]);
      //console.log(pose["keypoints"][11]["position"]);
      // console.log(pose["keypoints"][11]["position"]);
      // console.log(pose["keypoints"][12]["position"]);
      //console.log(pose["keypoints"][13]["position"]);
      //console.log(pose["keypoints"][15]["position"]);

      var current = 78;
      var temp =
        (find_angle(
          pose["keypoints"][12]["position"],
          pose["keypoints"][14]["position"],
          pose["keypoints"][16]["position"]
        ) *
          180) /
        Math.PI;

      if (temp < 75) {
        current = 1;
      } else {
        current = 0;
      }

      console.log(pose["keypoints"][12]["score"]);
      console.log(pose["keypoints"][14]["score"]);
      console.log(pose["keypoints"][16]["score"]);
      //console.log(temp2);
      // console.log(squates);

      //console.log(prev_to_prev);
      //console.log(prev_angle);
      console.log(current);
      if (
        pose["keypoints"][12]["score"] >= 0.5 &&
        pose["keypoints"][14]["score"] >= 0.5
      ) {
        console.log("yes");
        if (prev_angle == 1 && current == 0) {
          setsquatcount(squatcount + 1);

          squates += 1;

          //console.log(pose["keypoints"][12]["position"]);
          // console.log(pose["keypoints"][12]["position"]);
          //console.log(pose["keypoints"][14]["position"]);
          //console.log(pose["keypoints"][16]["position"]);
        }
        prev_to_prev = prev_angle;
        prev_angle = current;
      }
      prev_to_prev = prev_angle;
      prev_angle = current;
      //console.log("squat");
      //console.log(squates);
      // setsquatcount(squatcount + 1);
      //console.log("-----------------------------");

      drawCanvas(pose, video, videoWidth, videoHeight, canvasRef);
    }
  };

  const drawCanvas = (pose, video, videoWidth, videoHeight, canvas) => {
    const ctx = canvas.current.getContext("2d");
    canvas.current.width = videoWidth;
    canvas.current.height = videoHeight;

    drawKeypoints(pose["keypoints"], 0.6, ctx);
    drawSkeleton(pose["keypoints"], 0.7, ctx);
  };

  runPosenet();

  return (
    <div className="App">
      <header className="App-header">
        <Webcam
          ref={webcamRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />

        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />
      </header>

      <h1>{squatcount}</h1>
    </div>
  );
}

export default App;
