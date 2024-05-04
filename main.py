from flask import Flask, render_template, jsonify, request
from board import Board
from solver import solve_equations

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/toggle', methods=['POST'])
def toggle_square():
    row = int(request.form['row'])
    col = int(request.form['col'])
    board.toggle_square(row, col)
    return jsonify({'board': board.board.tolist()})

if __name__ == '__main__':
    board = Board(5)
    app.run(debug=True)