import cv2
import subprocess
from PIL import Image, ImageEnhance, ImageTk
import os.path
import datetime
import util
import sys
import tkinter as tk
import numpy as np

class App:
    def __init__(self):
        # ------ Main Window ------
        self.main_window = tk.Tk()
        self.main_window.title("Face Login")
        self.main_window.geometry("1200x520+200+100")

        # ------ Login and Register Button ------
        self.login_button_main_window = util.get_button(self.main_window, 'login', 'green', self.login)
        self.login_button_main_window.place(x=750, y=300)

        self.register_new_user_button_main_window = util.get_button(self.main_window, 'register new user', 'gray', self.register_new_user, fg='black')
        self.register_new_user_button_main_window.place(x=750, y=400)

        # ------ Add Webcam ------
        self.webcam_label = util.get_img_label(self.main_window)
        self.webcam_label.place(x=10, y=0, width=700, height=500)
        self.add_webcam(self.webcam_label)

        # ------ Add photos in directory ------
        self.db_dir = './db'
        if not os.path.exists(self.db_dir):
            os.mkdir(self.db_dir)

        # ------ Login logs ------
        self.log_path = './log.txt'

    def add_webcam(self, label):
        if 'cap' not in self.__dict__:
            self.cap = cv2.VideoCapture(0)

        self._label = label
        self.process_webcam()

    def process_webcam(self):
        ret, frame = self.cap.read()

        # Apply additional preprocessing to enhance image quality in low light
        frame, gray = self.preprocess_frame(frame)

        # Detect faces using Haar Cascades on grayscale image
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

        # Rectangle box around faces.
        for (x, y, w, h) in faces:
            cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 0, 255), 2)

        self.most_recent_capture_arr = frame  # Use the processed frame for face recognition
        img_ = cv2.cvtColor(self.most_recent_capture_arr, cv2.COLOR_BGR2RGB)
        self.most_recent_capture_pil = Image.fromarray(img_)
        imgtk = ImageTk.PhotoImage(image=self.most_recent_capture_pil)
        self._label.imgtk = imgtk
        self._label.configure(image=imgtk)

        self._label.after(20, self.process_webcam)

    def preprocess_frame(self, frame):
        # Convert frame to grayscale for face detection
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        # Apply histogram equalization to grayscale image
        gray = cv2.equalizeHist(gray)

        # Adjust brightness, contrast, and sharpness on the color frame
        frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        img_pil = Image.fromarray(frame)

        enhancer = ImageEnhance.Brightness(img_pil)
        factor = 1.5  
        frame = np.array(enhancer.enhance(factor))

        enhancer = ImageEnhance.Contrast(img_pil)
        factor = 1.5  
        frame = np.array(enhancer.enhance(factor))

        enhancer = ImageEnhance.Sharpness(img_pil)
        factor = 2.0 
        frame = np.array(enhancer.enhance(factor))

        # Convert back to BGR format
        frame = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)

        return frame, gray
    def login(self):
        status = ''
        unknown_img_path = './.tmp.jpg'
        cv2.imwrite(unknown_img_path, self.most_recent_capture_arr)

        # Use the enhanced frame for face recognition
        output = str(subprocess.check_output(['face_recognition', self.db_dir, unknown_img_path]))
        name = output.split(',')[1][:-5]

        if name in ['unknown_person', 'no_persons_found']:
            util.msg_box('Oops...', 'Unknown user. Please register a new user or try again.')
            status = 'Fail'
            print(status)
            sys.stdout.flush()
        else:
            util.msg_box('Welcome back!', 'Welcome, {}.'.format(name))
            status = 'Pass'
            print(status)
            sys.stdout.flush()
            self.main_window.destroy()
            with open(self.log_path, 'a') as f:
                f.write('{},{}\n'.format(name, datetime.datetime.now()))
                f.close()

    def register_new_user(self):
        self.register_new_user_window = tk.Toplevel(self.main_window)
        self.register_new_user_window.geometry("1200x520+230+120")

        self.accept_button_register_new_user_window = util.get_button(self.register_new_user_window, 'Accept', 'green', self.accept_register_new_user)
        self.accept_button_register_new_user_window.place(x=750, y=300)

        self.try_again_button_register_new_user_window = util.get_button(self.register_new_user_window, 'Try again', 'red', self.try_again_register_new_user)
        self.try_again_button_register_new_user_window.place(x=750, y=400)

        self.capture_label = util.get_img_label(self.register_new_user_window)
        self.capture_label.place(x=10, y=0, width=700, height=500)
        self.add_img_to_label(self.capture_label)

        self.entry_text_register_new_user = util.get_entry_text(self.register_new_user_window)
        self.entry_text_register_new_user.place(x=750, y=150)

        self.text_label_register_new_user = util.get_text_label(self.register_new_user_window, 'Please, \ninput username:')
        self.text_label_register_new_user.place(x=750, y=70)

    def add_img_to_label(self, label):
        imgtk = ImageTk.PhotoImage(image=self.most_recent_capture_pil)
        label.imgtk = imgtk
        label.configure(image=imgtk)

        self.register_new_user_capture = self.most_recent_capture_arr.copy()

    def accept_register_new_user(self):
        name = self.entry_text_register_new_user.get(1.0, "end-1c")
        cv2.imwrite(os.path.join(self.db_dir, '{}.jpg'.format(name)), self.register_new_user_capture)

        util.msg_box('Success!', 'User was registered successfully!')
        self.register_new_user_window.destroy()

    def try_again_register_new_user(self):
        self.register_new_user_window.destroy()

    def start(self):
        self.main_window.mainloop()

if __name__ == "__main__":
    app = App()
    app.start()