import os, ast
from contextlib import closing

from flask import request, render_template, redirect, url_for
from werkzeug import secure_filename

from strabo import app
from strabo.database import migrate_db, get_flex, get_column_names, search, \
delete, insert_images, insert_ips, insert_events, get_max_id, edit_image, \
edit_ip, edit_event 
from strabo.image_processing import make_thumbnail, allowed_file, DMS_to_Dec #, getEXIF

# Landing page allows viewer to select amoung tabs to start editing
@app.route("/", methods=["GET"])
def index():
  # If the 'images' table exists, exit this code block. Otherwise, call migrate_db
  # and import 'images' table.
  if not os.path.exists("bbs.sqlite3"):
    migrate_db()
  images = []
  events = []
  interest_points = []
  return render_template("private/base.html")      

###
###
### Views to upload images to db
@app.route("/upload_images/")
def upload_images():
  table_name = 'images'
  images = get_flex(table_name, 10)
  events = get_flex('events')
  interest_points = get_flex('interest_points')
  return render_template("private/upload_images.html", images= images,
    interest_points=interest_points, events=events)

@app.route("/upload_images/exif/", methods=['POST', 'GET'])
def getEXIF():
  tags = request.form.get('key')
  dicty = ast.literal_eval(tags)
  if 'DateTimeOriginal' in dicty:
    dateTimeOriginal = dicty['DateTimeOriginal']
  else: dateTimeOriginal = None
  if 'GPSLatitude' in dicty: 
    latitude = dicty['GPSLatitude']
    latitude = DMS_to_Dec(latitude)
  else: latitude = None
  if 'GPSLongitude' in dicty:
    longitude = dicty['GPSLongitude']
    longitude = DMS_to_Dec(longitude)
  else: longitude = None
  print(dateTimeOriginal)
  print(latitude)
  print(longitude)
  return render_template("private/form_images.html", longitude=longitude,
    latitude=latitude, dateTimeOriginal=dateTimeOriginal)

@app.route("/upload_images/post", methods=["POST"])
def post():
  # get input from user according to field. Save those values under similar variable names.
  title = request.form.get('title', None)
  img_description = request.form['img_description']
  latitude = request.form['latitude']
  longitude = request.form['longitude']
  period = request.form['period']
  notes = request.form['notes']
  file = request.files['file']
  if not request.form['interest_point'] == 'Select One':
    interest_point = request.form['interest_point']
  else: interest_point = ''

  # Get primary key for saving filename and thumbnailname
  max_id = get_max_id()
  this_id = max_id + 1

  # Check if the file is one of the allowed types/extensions
  if file and allowed_file(file.filename):
    # If so, make the filename safe by removing unsupported characters
    filename = secure_filename(file.filename)
    # prepend unique id to ensure an unique filename
    filename = str(this_id) + '_' + filename
    # Move the file from the temporary folder to the upload folder
    file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    # # Call function to extract EXIF data
    # date_created = getEXIF(app.config['UPLOAD_FOLDER'], filename)
    # Make a thumbnail and store it in the thumbnails directory
    thumbnail_name = make_thumbnail(filename, this_id)

  params = (title, img_description, latitude, longitude, period, 
      interest_point, notes, filename, thumbnail_name)
  insert_images(params)
  
  return redirect(url_for('index'))

###
###
### Views to add interest points to the db
@app.route("/upload_ips/")
def upload_ips():
  interest_points = get_flex('interest_points')
  return render_template("private/upload_ips.html", interest_points=interest_points)

@app.route("/interest_points/post", methods=["POST"])
def interest_points_post():
  name = request.form['name']
  latitude = request.form['latitude']
  longitude = request.form['longitude']
  notes = request.form['notes']
  params = (name, latitude, longitude, notes)
  insert_ips(params)
  return redirect(url_for('index'))

###
###
### Views to add events to the db
@app.route("/upload_events/")
def upload_events():
  events = get_flex('events')
  return render_template("private/upload_events.html", events=events)

@app.route("/events/post", methods=["POST"])
def event_post():
  title = request.form['title']
  event_description = request.form['event_description']
  year = request.form['year']
  notes = request.form['notes']
  params = (title, event_description, year, notes)
  insert_events(params)
  return redirect(url_for('index'))

###
###
### Views to search for and delete images ###
@app.route("/delete_images/", methods=["GET"])
def delete_images():
  table_name = 'images'
  categories = get_column_names('images')
  search_term = request.args.get('search')
  if search_term is None:
    images = get_flex(table_name)
  else:
    column = request.args.get('categories')
    images = search(table_name, column, search_term)
  return render_template("private/delete_images.html", categories=categories, images=images)

@app.route("/delete_images/delete/", methods=["POST"])
def delete_images_delete():
  table_name = 'images'
  keys = request.form.getlist('primary_key')
  delete(keys, table_name)
  return redirect(url_for('index'))

###
###
### Views to search for and delete interest points ###
@app.route("/delete_ips/", methods=["GET"])
def delete_ips():
  table_name = 'interest_points'
  categories = get_column_names('interest_points')
  search_term = request.args.get('search')
  if search_term is None:
    interest_points = get_flex(table_name)
  else:
    column = request.args.get('categories')
    interest_points = search(table_name, column, search_term)
  return render_template("private/delete_ips.html", categories=categories, interest_points=interest_points)

@app.route("/delete_ips/delete/", methods=["POST"])
def delete_ips_delete():
  table_name = 'interest_points'
  keys = request.form.getlist('primary_key')
  delete(keys, table_name)
  return redirect(url_for('index'))

###
###
### Views to search for and delete events ###
@app.route("/delete_events/", methods=["GET"])
def delete_events():
  table_name = 'events'
  categories = get_column_names('events')
  search_term = request.args.get('search')
  if search_term is None:
    events = get_flex(table_name)
  else:
    column = request.args.get('categories')
    events = search(table_name, column, search_term)
    print(events)
  return render_template("private/delete_events.html", categories=categories, events=events)

@app.route("/delete_events/delete/", methods=["POST"])
def delete_events_delete():
  table_name = 'events'
  keys = request.form.getlist('primary_key')
  delete(keys, table_name)
  return redirect(url_for('index'))

###
###
### Views to search for and edit images ###
@app.route("/edit_images/", methods=["GET"])
def edit_images():
  table_name = 'images'
  categories = get_column_names('images')
  search_term = request.args.get('search')
  if request.args.get('edit-btn'):
    key = request.args.get('edit-btn')
    column = 'id'
    image = search(table_name, column, key)
    events = get_flex('events')
    interest_points = get_flex('interest_points')
    return render_template("private/complete_form_images.html", image=image,
      events=events, interest_points=interest_points)
  elif search_term is None:
    images = get_flex(table_name)
  else:
    column = request.args.get('categories')
    images = search(table_name, column, search_term)
  return render_template("private/edit_images.html", categories=categories, images=images)

@app.route("/edit_images/edit/", methods=["POST"])
def edit_images_edit():
  title = request.form['title']
  img_description = request.form['img_description']
  latitude = request.form['latitude']
  longitude = request.form['longitude']
  period = request.form['period']
  interest_point = request.form['interest_point']
  notes = request.form['notes']
  key = request.form['edit-btn']
  
  table_name = 'images'
  column = 'id'
  image = search(table_name, column, key)
  
  created_at = image[0]['created_at']
  thumbnail_name = image[0]['thumbnail_name']
  filename = image[0]['filename']  

  params = (key, title, img_description, created_at, latitude, longitude, 
    period, interest_point, notes, filename, thumbnail_name)
  print(params)
  edit_image(params)
  return redirect(url_for('index'))

###
###
### Views to search for and edit interest points ###
@app.route("/edit_ips/", methods=["GET"])
def edit_ips():
  table_name = 'interest_points'
  categories = get_column_names('interest_points')
  search_term = request.args.get('search')
  if request.args.get('edit-btn'):
    key = request.args.get('edit-btn')
    column = 'id'
    interest_point = search(table_name, column, key)
    return render_template("private/form_ips.html", 
      interest_point=interest_point)
  elif search_term is None:
    interest_points = get_flex(table_name)
  else:
    column = request.args.get('categories')
    interest_points = search(table_name, column, search_term)
  return render_template("private/edit_ips.html", categories=categories, 
    interest_points=interest_points)

@app.route("/edit_ips/edit/", methods=["POST"])
def edit_ips_edit():
  name = request.form['name']
  latitude = request.form['latitude']
  longitude = request.form['longitude']
  notes = request.form['notes']
  key = request.form['edit-btn']
  
  table_name = 'interest_points'
  column = 'id'
  ip = search(table_name, column, key)
  
  created_at = ip[0]['created_at']

  params = (key, name, latitude, longitude, created_at, notes)

  edit_ip(params)
  return redirect(url_for('index'))

###
###
### Views to search for and edit events ###
@app.route("/edit_events/", methods=["GET"])
def edit_events():
  table_name = 'events'
  categories = get_column_names('events')
  search_term = request.args.get('search')
  if request.args.get('edit-btn'):
    key = request.args.get('edit-btn')
    column = 'id'
    event = search(table_name, column, key)
    return render_template("private/form_ips.html", 
      event=event)
  elif search_term is None:
    events = get_flex(table_name)
  else:
    column = request.args.get('categories')
    events = search(table_name, column, search_term)
  return render_template("private/edit_events.html", categories=categories, 
    events=events)

@app.route("/edit_events/edit/", methods=["POST"])
def edit_events_edit():
  title = request.form['title']
  event_description = request.form['event_description']
  year = request.form['year']
  notes = request.form['notes']
  key = request.form['edit-btn']
  
  table_name = 'events'
  column = 'id'
  ip = search(table_name, column, key)
  
  created_at = ip[0]['created_at']

  params = (key, title, event_description, year, created_at, notes)

  edit_event(params)
  return redirect(url_for('index'))