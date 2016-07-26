Javascript
==========


map_info.js
-----------

Helper code required by ``map.js`` and ``drawmap.js``.



map.js
------

Loaded by the main map page.


drawtextmap.js
--------------

Loaded by the upload_ips page.



popup.js
--------

Loaded by the main map page.

Flickty
~~~~~~~

This uses the `flickety library <http://flickity.metafizzy.co/>`_
to render the photo gallery that is displayed in the
main popup.

Photoswipe
~~~~~~~~~~

When flickty carousel items are clicked, it opens a
`Photoswipe photo gallery <http://photoswipe.com/>`_ that allows you to
view larger pictures.



upload_ips.js
-------------

Form Validation
~~~~~~~~~~~~~~~

Strabo does not use any external form validation framework. It does everything itself
for maximum flexibility and simplicity.


Input fields are checked with the builtin form object that is passed into checkForm.
You can access the html field by the attribute of the object that corresponds to
the ``name`` html attribute.

Here is an example which checks if the value of an input is the default value (Recall that the
the string typed into the input box is the value of the input element).

.. code-block:: html

    <input name="icon" value="default-icon"></input>

.. code-block:: javascript

    var is_default_value = form.icon.value == "default-icon"

As you can see, for input fields this is very strait forward. For other types of data entry, like
select and checkbox, are more difficult. `This page <http://www.the-art-of-web.com/javascript/validate/>`_
explains how to work with many of these types in detail.

In order to show the user what is wrong with the form, you can place error messages in the
html where you would want them to display, and mark them as hidden, so that they don't display
when the page first loads.

Here is an example from upload_ips.html

.. code-block:: html

    <p id="map-form-issue" class="form-error" hidden>Must place a new object on the map.</p>

Then you can just add an InputField which knows about that message.

.. js:class:: InputField(message_identifier, is_valid_cond)

    Corresponds with a user input field.

    :param string message_identifier: A jquery selector string (like "#map-form-issue") which points to the error message that is shown
        when the input field is valid.
    :param function(form) is_valid_cond: a function with takes a form object and returns whether the corresponding input field
        is valid.

.. js:data:: validators

    List of InputField objects which together describe all the contents of the form.

.. js:function:: checkForm(form)

    Is called with inline javascript in upload_ips.html.

    Iterates through input fields, and if they are invalid, shows the corresponding
    html error message which explain what all is wrong with the form, or if they are valid, hides the form.

    :param form: Special builtin form object.
    :returns: Whether the form is vaild or not. If it returns false, then the form is not submitted.



Dynamic Image Uploading
~~~~~~~~~~~~~~~~~~~~~~~

Also handles almost everything to do with the the dynamic image loading form.

``templates/private/upload_img_prototype.html'' contains a hidden div which serves as a
prototype for the image upload interface. When divs are added, it clones the div,
removes the prototype class (so that it is differentiable from the actual prototype)
and hidden attribute (so that it shows up on the screen), and adds event handlers for
the buttons.


As the image form divs are added, they form a linked list, which, since it is html,
takes the form of a list of divs::

Each add and delete button has its own event handler, which has knowledge of its parent
div. Pressing the Delete button deletes the current img div and pressing the Add Below
button will insert another image form in between it and the next div.
