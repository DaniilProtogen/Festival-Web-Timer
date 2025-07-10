from flask import Flask, render_template, request, jsonify, redirect
import time
import sys

app = Flask(__name__)

timer_start = None
timer_duration = None

@app.route('/')
def index():
    if timer_start and timer_duration:
        return redirect('/timer')
    return render_template('index.html')

@app.route('/timer')
def timer():
    global timer_start, timer_duration
    h = request.args.get('h')
    m = request.args.get('m')
    s = request.args.get('s')

    if h and m and s:
        timer_duration = int(h) * 3600 + int(m) * 60 + int(s)
        timer_start = time.time()

    if not (timer_start and timer_duration):
        return redirect('/')
    return render_template('timer.html')

@app.route('/api/now')
def get_timer_state():
    if not (timer_start and timer_duration):
        return jsonify({'status': 'not_started'}), 400
    return jsonify({
        'start': timer_start,
        'duration': timer_duration,
        'now': time.time()
    })

if __name__ == '__main__':
    host = '0.0.0.0'
    port = 5000
    if len(sys.argv) > 1:
        host = sys.argv[1]
    if len(sys.argv) > 2:
        try:
            port = int(sys.argv[2])
        except:
            pass
    print(f"Запуск на {host}:{port}")
    app.run(host=host, port=port)
