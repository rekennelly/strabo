'''
Currently only handles interest poing and image deletion.

In future versions, this will handle all database interactions,
including gets, sets, updates.
'''

import sqlalchemy

from strabo import schema
from strabo import file_writing

from strabo import db

def delete_ip(id):
    '''Deletes ip refrenced by id.

    All images associated with the ip are deleted!'''
    idquery = db.session.query(schema.InterestPoints).filter_by(id=id)
    ip = idquery.one()

    ip.images = []

    idquery.delete()
    db.session.commit()

def delete_image(id):
    '''Deletes the images and all files associated with it.'''
    idquery = db.session.query(schema.Images).filter_by(id=id)
    img = idquery.one()
    file_writing.delete_image_files(img.filename)
    idquery.delete()
    db.session.commit()


def jsonifyable_row(sql_row):
    return {col.name:getattr(sql_row,col.name) for col in sql_row.__class__.__table__.columns}

def jsonifyable_rows(sql_rows):
    return [jsonifyable_row(row) for row in sql_rows]

#helper functions, currently unused
'''
def get_row_by_id(table,id):
    return db.session.query(table).get(id)

#return all result objects of the table
def get_all_rows(table):
    return db.session.query(table).all()

def store_item(row_obj):
    db.session.add(row_obj)
    db.session.commit()
'''
