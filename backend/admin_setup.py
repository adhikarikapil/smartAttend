from app.extentions import db
from app.models import User

def create_admin():
    email = 'admin@gmail.com'
    password = 'root'

    existing = User.query.filter_by(role="admin", email=email).first()
    if existing:
        print('Admin already exists.')
        return
    
    admin = User(
        first_name='Admin',
        second_name='Root',
        email=email,
        password=password,
        role='admin'
    )
    db.session.add(admin)
    db.session.commit()
    print('Admin user created successfully')


if __name__ == '__main__':
    from app import create_app
    app = create_app()
    with app.app_context():
        create_admin()