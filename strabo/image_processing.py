'''
Handles interaction with PIL library, including thumbnail creation, dimention getting, and
image processing capabilities, including allowed file extensions.
'''
import os
from PIL import Image

from strabo import utils

from strabo import app
from strabo import straboconfig

def allowed_file(filename):
    '''checks whether the filename has an extension that is listed in ALLOWED_EXTENSIONS'''
    return utils.get_extension(filename) in straboconfig['ALLOWED_EXTENSIONS']

# This helper function uses PIL to make a new thumbnail of a given image
def save_shrunken_image(image_path,thumbnail_path,max_dim):
    '''
    Uses the Python Imageing Library to save an image
    '''
    # import desired image from /uploads folder
    with Image.open(image_path) as img:
        # create a thumbnail from desired image
        # the thumbnail will have dimentions of the same ratio as before, capped by
        # the limiting dimention of max_dim
        img.thumbnail(max_dim,Image.ANTIALIAS)
        # save the image under a new filename in thumbnails directory
        img.save(thumbnail_path)

#get dimentions of item in uploads folder with the given filename
def get_dimentions(filename):
    '''get dimentions of image uploads/<filename>``'''
    with Image.open(os.path.join(straboconfig['UPLOAD_FOLDER'],filename)) as im:
        return im.size#width, height tuple
