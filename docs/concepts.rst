Concepts
========

Descriptions of implementation concepts which span several files.

Image Management
----------------

When images are added to the database, only one filename is stored, the name of the
saved file in the ``static/uploads`` directory. No matter what filename of the uploaded
file is, it will never overwrite a file in that directory, instead it will generate
a random string which it appends to the filename and then saves it. Even though this file is
never shown in the browser, it is still important as a reference image. If it is there, then the
resized image files can be recreated by running generate_mobile_imgs.py, and everything should be
good.

Image resizing
~~~~~~~~~~~~~~

In order to speed up our website's page load times, there are two different sizes of files which are
automatically generated from the original file. They are generated during upload and when
generate_mobile_imgs.py is run.

The smaller of the two is stored in
``static/thumbnails``, it's maximum dimensions are specified by the ``THUMBNAIL_MAX_SIZE``
configuration property, and they are displayed in the popup's carousel, as well as in the admin
interface.

The larger of the two is stored in
``static/mobile_imgs``, their maximum dimensions are specified by the ``MOBILE_SERV_MAX_SIZE``
configuration property, and they are displayed the photoswipe carousel.
