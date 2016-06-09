from strabo import db, app
from strabo import geojson_wrapper
from strabo import database
from strabo import image_processing
from strabo import schema
from strabo import utils
from strabo.config_canyon import Layers
from strabo import private_helper
import shutil
import werkzeug
import os

#hackish and bad way of reinniting the postgres database
#only use for development
def recreate_postgres_db():
    os.system("dropdb strabo")
    os.system("rm strabo/static/uploads/*")
    os.system("rm strabo/static/thumbnails/*")
    os.system("createdb strabo")
    os.system("python initDB.py")

recreate_postgres_db()

class mock_flask_file_obj:
    def __init__(self,path,filename):
        self.filename = filename
        self.full_filename = os.path.join(path,filename)

    def save(self,new_file_path):
        shutil.copyfile(self.full_filename,new_file_path)

def make_interest_point(image_ids,form_title,form_body,form_geo_obj,form_layer):
    ip = schema.InterestPoints()
    db.session.add(ip)
    db.session.flush()
    private_helper.fill_interest_point(ip,image_ids,form_title,form_body,form_geo_obj,form_layer)
    db.session.commit()
    return ip

geo_obj1 = '{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-122.63034939765929,45.48205499198348]}}'
geo_obj2 = '{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-122.630397,45.481851]}}'

img1 = private_helper.make_image(mock_flask_file_obj("test_images","download.jpg"),"bird")
img2 = private_helper.make_image(mock_flask_file_obj("test_images","download1.jpg"),"flower")
img3 = private_helper.make_image(mock_flask_file_obj("test_images","download2.jpg"),"small flowers")
img4 = private_helper.make_image(mock_flask_file_obj("test_images","download3.jpg"),"beach")
img5 = private_helper.make_image(mock_flask_file_obj("test_images","image with space.jpg"),"canyon")
img6 = private_helper.make_image(mock_flask_file_obj("test_images","phone_testing.png"),"phone")

db.session.add(img1)
db.session.add(img2)
db.session.add(img3)
db.session.add(img4)
db.session.add(img5)
db.session.add(img6)

db.session.commit()

ip1 = make_interest_point([1,2,3],"Interest Point 1","This is a descriptions of something",geo_obj1,app.config['LAYER_FIELDS'][Layers.plant])
ip2 = make_interest_point([4],"Interest Point 2","This is a descriptions of something else",geo_obj2,app.config['LAYER_FIELDS'][Layers.animal])

db.session.commit()
