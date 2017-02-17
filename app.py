#!flask/bin/python
import datetime
from flask import Flask, jsonify, json, render_template
from flask import abort
from flask import make_response
from flask import request
# from flask import url_for
# from flask_httpauth import HTTPBasicAuth
import pymongo



app = Flask(__name__)

# app = Flask(__name__, static_url_path='/static')


@app.route('/index.html', methods=['GET'])
@app.route('/index', methods=['GET'])
@app.route('/', methods=['GET'])
def show():
    return render_template('index.html')


@app.route('/show', methods=['GET'])
@app.route('/showdetail.html', methods=['GET'])
def showdetail():
    return render_template('showdetail.html')

@app.route('/about', methods=['GET'])
@app.route('/about.html', methods=['GET'])
def showaboutl():
    return render_template('about.html')
# @app.route('/<path:url>', methods=['GET'])
# def show3(url):
#     return app.send_static_file(url)


@app.route('/errorpage', methods=['GET'])
@app.route('/errorpage.html', methods=['GET'])
def showerr():
    return render_template('errorpage.html')

@app.route('/count', methods=['GET'])
def count():
    collection = connectDB()
    max = collection.find().count()
    return jsonify({'count': max})


@app.route('/api/v1.0/peoples/<int:start>/<int:stop>', methods=['GET'])
# @auth.login_required
def get_peoples(start, stop):
    #print request.args.get('callback')
    if request.args.get('callback'):
        return request.args.get('callback') + '(' + get_peoples_group(start, stop) + ')'
    else:
        return get_peoples_group(start, stop)



@app.route('/api/v1.0/people/<name>', methods=['GET'])
def get_people(name):
    collection = connectDB()
    people = collection.find_one_and_update({'name': name}, {'$inc': {'search_count': 1}}, projection={'_id': False})
    if not (people):
        abort(404)
    return jsonify(people)

@app.route('/show', methods=['GET'])
def mainshow():
    collection = connectDB()
    # max = collection.find().count()
    # if start < 0 or stop > max:
    #     abort(404)
    peoples = collection.find(projection={'_id': False})[1:31]
    count = collection.find().count()
    data = []
    for people in peoples:
        data.append(people)
    return render_template('index.html', DBcount=count, peoples=data)



@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found'}), 404)


def add_count_fields(name):
    try:
        collection.update_one({'name': name}, {'$inc': {'search_count': 1}})
    except Exception, e:
        print "fail to add counts", e


def connectDB():
    client = pymongo.MongoClient('mongodb://localhost:27017')
    db = client['SpiderData']
    collection = db['data']
    return collection


def get_peoples_group(start, stop):
    collection = connectDB()
    max = collection.find().count()
    if start < 0 or stop > max:
        abort(404)
    peoples = collection.find(projection={'_id': False})[start:stop]
    data = []
    for people in peoples:
        data.append(people)
    return json.dumps(data, ensure_ascii=False)



if __name__ == '__main__':
    app.run(debug=True)
