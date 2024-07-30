from . import db

class User(db.Model):
    __tablename__ = 'usuarios'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    favorite_team_id = db.Column(db.Integer, db.ForeignKey('teams.id'))
    
    favorite_team = db.relationship('Team', backref='users')

    def __repr__(self):
        return f'<User {self.name}>'
    
class Team(db.Model):
    __tablename__ = 'teams'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)

    def __repr__(self):
        return f'<Team {self.name}>'
