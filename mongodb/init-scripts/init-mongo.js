db = db.getSiblingDB('admin');

const user = db.getUser('root');

if (!user) {
  db.createUser({
    user: 'root',
    pwd: 'root',
    roles: [{ role: 'root', db: 'admin' }],
  });
}

db = db.getSiblingDB('safer');
db.createCollection('accidents');
