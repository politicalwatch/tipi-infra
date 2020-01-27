db.createUser(
  {
    user: "tipi",
    pwd: "tipi",
    roles: [
      {
        role: "readWrite",
        db: "tipidb"
      }
    ]
  }
);
