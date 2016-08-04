'''
Overwrites thumbnails and mobile_imgs files with files of size specified in
configuration values THUMBNAIL_MAX_SIZE and MOBILE_SERV_MAX_SIZE, respectively.

Use whenever the dimensions specified by either of those values have been changed.

This might happen if the size of the images turn out to be too large and slow for certain devices,
or if they are too small to see some detail, and some images have already been uploaded to
the server.

Also, if another file size is ever added (like extra tiny thumbnails or
1200x1200px size for phones), then this can be used to generate those new images.
'''

import os

from strabo import utils
import config
from strabo import file_writing
from strabo import image_processing

from strabo import straboconfig

utils.fill_dict_with(straboconfig,config.get_config_info())

for filename in os.listdir(os.path.realpath("./strabo/static/uploads/")):
    if image_processing.allowed_file(filename):
        file_writing.save_shrunken_images_with(filename)
