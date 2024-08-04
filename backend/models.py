from . import db

class User(db.Model):
    __tablename__ = 'usuarios'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    favorite_team_id = db.Column(db.Integer, db.ForeignKey('teams.id'))
    family_id = db.Column(db.Integer, db.ForeignKey('families.id'))

    favorite_team = db.relationship('Team', backref='users')
    family_members = db.relationship('Family', backref='user', foreign_keys='Family.user_id')

    def __repr__(self):
        return f'<User {self.name}>'

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "favorite_team": self.favorite_team.serialize() if self.favorite_team else None
        }

class Team(db.Model):
    __tablename__ = 'teams'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)

    def __repr__(self):
        return f'<Team {self.name}>'
    
    def serialize(self):
        return {
            "id": self.id,
            "name": self.name
        }

class Family(db.Model):
    __tablename__ = 'families'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    type = db.Column(db.String(50), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'))

    def __init__(self, name, type, user_id):
        valid_types = ['hermano', 'hermana', 'papá', 'mamá', 'mascota']
        if type not in valid_types:
            raise ValueError(f'Invalid type: {type}')
        self.name = name
        self.type = type
        self.user_id = user_id

    def __repr__(self):
        return f'<Family {self.name}>'
    
    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "type": self.type,
            "user_id": self.user_id
        }
