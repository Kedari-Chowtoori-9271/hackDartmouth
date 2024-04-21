from flask import Flask, render_template, Response
import cv2
import mediapipe as mp
import numpy as np

mp_drawing = mp.solutions.drawing_utils
mp_pose = mp.solutions.pose

app = Flask(__name__)

down_dog = np.load('./baseline_poses/down_dog.npy')
warrior_arr = np.load('./baseline_poses/warrior_pose.npy')

all_ideal_poses = np.asarray([down_dog, warrior_arr])
cap = None

def calc_score(coords_x, coords_y):
  min_diff = np.inf
  ideal_count = 0

  for i in all_ideal_poses[1]:
    diff_x = np.linalg.norm(coords_x - i[0])
    diff_y = np.linalg.norm(coords_y - i[1])
    diff = (diff_x + diff_y) / 2
    if(diff<min_diff):
      min_diff = diff
      ideal_count = i

  score = np.ceil((1 - min_diff) * 100)
  # if(score>=80):
  #   score=100

  return score

def start_camera():
    global cap
    cap = cv2.VideoCapture(0)

def stop_camera():
    global cap
    if cap is not None:
        cap.release()

def detect_pose():
    # Load your pose detection logic here
    # This function should return the frame with pose overlays
    # For example:
    global cap
    with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
        while True:
            ret, frame = cap.read()
            if not ret:
                break

            # Your pose detection logic here
            # Example: perform pose detection on the frame
            # Replace this with your actual pose detection logic
            # For now, just displaying the raw frame
            # Recolor image to RGB
            image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            image.flags.writeable = False
            
            # Make detection
            results = pose.process(image)

            # Recolor back to BGR
            image.flags.writeable = True
            image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

            # Render drawings
            mp_drawing.draw_landmarks(image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS, 
                                        mp_drawing.DrawingSpec(color=(245, 117, 66), thickness=2, circle_radius=2),
                                        mp_drawing.DrawingSpec(color=(245, 66, 230), thickness=2, circle_radius=2))

            # frame = your_pose_detection_function(frame)
            try:
                coords_array = np.asarray(results.pose_landmarks.landmark)
            except:
                pass
            coords_x = []
            coords_y = []
            for i in coords_array:
                coords_x.append(i.x)
                coords_y.append(i.y)
            score = calc_score(coords_x, coords_y)
            # print(score)

            ret, buffer = cv2.imencode('.jpg', image)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n' +
                b'Content-Type: text/plain\r\n\r\n' + str(score).encode() + b'\r\n')
            # yield (b'--frame\r\n'
            #     b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route("/")
def index():
    return render_template("index.html")


@app.route('/start', methods=['POST'])
def start():
    start_camera()
    return 'Camera started'

@app.route('/stop', methods=['POST'])
def stop():
    stop_camera()
    return 'Camera stopped'

@app.route('/video_feed')
def video_feed():
    return Response(detect_pose(), mimetype='multipart/x-mixed-replace; boundary=frame')


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=80, debug=True)