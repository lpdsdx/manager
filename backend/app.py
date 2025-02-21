from flask import Flask, jsonify, request
from flask_restful import Api, Resource
from models import db, init_db, Task
from datetime import datetime

app = Flask(__name__)
app.config.from_pyfile('config.py')
api = Api(app)

# 初始化数据库
db.init_app(app)
with app.app_context():
    init_db()

class TaskResource(Resource):
    def get(self, task_id=None):
        if task_id:
            task = Task.query.get_or_404(task_id)
            return jsonify({
                'id': task.id,
                'title': task.title,
                'description': task.description,
                'status': task.status,
                'due_date': task.due_date.isoformat() if task.due_date else None
            })
        tasks = Task.query.all()
        return jsonify([{
            'id': t.id,
            'title': t.title,
            'status': t.status,
            'due_date': t.due_date.isoformat() if t.due_date else None
        } for t in tasks])

    def post(self):
        data = request.get_json()
        task = Task(
            title=data['title'],
            description=data.get('description'),
            status=data.get('status', '待办'),
            due_date=datetime.fromisoformat(data['due_date']) if data.get('due_date') else None
        )
        db.session.add(task)
        db.session.commit()
        return jsonify({'message': '任务创建成功', 'id': task.id}), 201

    def put(self, task_id):
        task = Task.query.get_or_404(task_id)
        data = request.get_json()
        task.title = data.get('title', task.title)
        task.description = data.get('description', task.description)
        task.status = data.get('status', task.status)
        if 'due_date' in data:
            task.due_date = datetime.fromisoformat(data['due_date']) if data['due_date'] else None
        db.session.commit()
        return jsonify({'message': '任务更新成功'})

    def delete(self, task_id):
        task = Task.query.get_or_404(task_id)
        db.session.delete(task)
        db.session.commit()
        return jsonify({'message': '任务已删除'})

api.add_resource(TaskResource, '/api/tasks', '/api/tasks/<int:task_id>')

if __name__ == '__main__':
    app.run(debug=True) 