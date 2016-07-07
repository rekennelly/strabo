import random
import os

from strabo import schema

from strabo import app

def safe_pos_int_conv(inputstr):
    return  int(inputstr) if not inputstr == '' else 1

def extract_name_extension(filename):
    dot_loc = filename.rfind('.')

    find_not_found_value = -1
    dot_idx = dot_loc if dot_loc != find_not_found_value else len(filename) - 1

    return filename[:dot_idx], filename[dot_idx+1:]

def remove_extension(filename):
    return extract_name_extension(filename)[0]

def get_extension(filename):
    return extract_name_extension(filename)[1]

#generates a filename which does not yet iexist in the folder specified by path
def unique_filename(path,filename):
    def gen_new_name():
        name,ext = extract_name_extension(filename)
        return name+str(random.randint(0,1000000000000000)) + '.' + ext

    uniq_name = filename
    while os.path.isfile(os.path.join(path,uniq_name)):
        uniq_name = gen_new_name()

    return uniq_name
