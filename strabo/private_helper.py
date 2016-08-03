'''
Assigns entries in the table accoring to text input from the admin interface.
'''
import datetime
import copy

from strabo import schema
from strabo import image_processing
from strabo import file_writing

from strabo import db
from strabo import straboconfig

def make_interest_point(form_ip_id,images,form_title,form_body,form_geo_obj,form_layer,form_icon):

    ip = db.session.query(schema.InterestPoints).get(form_ip_id) if form_ip_id != "" else schema.InterestPoints()

    ip.title = form_title
    ip.descrip_body = form_body
    ip.geojson_object = form_geo_obj
    ip.layer = straboconfig["REVERSE_LAYER_FIELDS"][form_layer]
    ip.icon = form_icon
    ip.images = images
    return ip

def make_date(form_year,form_month):
    '''
    :param string form_year: Year value passed in from form. Is a string decimal
        representation of a year or en empty string if that part of the form was
        left empty.

    :param string form_month: Month value, follows same format as year.

    If month and year are valid values,returns date with specied month and year.

    If not, then it uses today's date as a default.
    '''
    default_day = 1
    year = int(form_year) if form_year else datetime.date.today().year
    month = int(form_month) if form_month else datetime.date.today().month

    return  datetime.date(year,month,default_day)

def make_image(ip_idx,form_image_id,form_file_obj,form_descrip,form_year,form_month):
    '''
    If a flask.files object is passed in, then
    '''
    image = db.session.query(schema.Images).get(form_image_id) if form_image_id != "" else schema.Images()

    image.taken_at = make_date(form_year,form_month)
    image.description = form_descrip
    image.ip_order_idx = ip_idx

    if form_file_obj:
        image.filename = file_writing.make_filename(form_file_obj.filename)
        file_writing.save_image_files(form_file_obj,image.filename)
        image.width,image.height = image_processing.get_dimentions(image.filename)

    return image

def make_ordered_images(ids,files,descrips,years,months):
    '''
    Takes in lists of form objects. Stores the index of the image from the form list into
    schema.Images.ip_order_idx field as it goes
    through so the database remembers the order in the form.
    '''
    form_descrips = zip(ids,files,descrips,years,months)

    return [make_image(ip_idx,*img_args)
                for ip_idx,img_args in enumerate(form_descrips)]

def get_ordered_images(interest_point):
    '''
    Returns a list of images that follow the order they were submitted in.
    '''
    ord_imgs = copy.copy(interest_point.images)
    ord_imgs.sort(key=lambda img: img.ip_order_idx)
    return ord_imgs
