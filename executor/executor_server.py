import json
from flask import Flask
from flask import jsonify
from flask import request
import executor_utils as eu

app = Flask(__name__)

@app.route('/')
def hello():
    return 'hello world'

@app.route('/results', methods=['POST'])
def getResults():
    print("getResults")
    data = request.get_json()
    if 'code' not in data or 'lang' not in data:
        return 'You should provide "code and "lang"'
    code = data['code']
    lang = data['lang']
    print("api got called with code: %s in %s" % (code, lang))
    result = eu.build_and_run(code, lang)
    return jsonify(result)

if __name__ == '__main__':
    eu.load_image()
    app.run(host='0.0.0.0', port=7000)
