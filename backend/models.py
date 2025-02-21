from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    status = db.Column(db.Enum('待办', '进行中', '已完成'), default='待办')
    due_date = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.now)

def init_db():
    db.create_all()
    # 初始化示例任务
    if not Task.query.first():
        tasks = [
            Task(title='学习Vue', description='掌握Vue3核心语法'),
            Task(title='部署项目', status='进行中'),
            Task(title='编写文档', status='已完成', due_date=datetime(2024,3,1))
        ]
        db.session.bulk_save_objects(tasks)
        db.session.commit() 