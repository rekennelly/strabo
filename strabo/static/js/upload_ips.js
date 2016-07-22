var layer_message;
var icon_message;
var map_message;
var title_message;

function feature_drawn(){
    return shape_drawn;
}
function entered_name(form){
    return form.name.value != ""
}
function selected_layer(form){
    return form.layer.selectedIndex != 0
}
function selected_icon(form){
    return form.icon.selectedIndex != 0
}
function checkForm(form){
    var form_valid = true;
    hide_all();
    if(!feature_drawn()){
        map_message.show();
        form_valid = false;
    }
    if(!entered_name(form)) {
        title_message.show();
        form_valid = false;
    }
    if(!selected_layer(form)){
        layer_message.show();
        form_valid = false;
    }
    if(!selected_icon(form)){
        icon_message.show();
        form_valid = false;
    }
    return form_valid;
}
function showUploadImg($div,input) {
    /*
    Reads input and
    */
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $div.children().children('[name="img-preview"]').attr('src', e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
    }
}
function hide_all(){
    layer_message.hide();
    icon_message.hide();
    title_message.hide();
    map_message.hide();
}
function expand_div($rootdiv){
    var $nextdiv = $new_img_div();
    var nextnextdivlist = $rootdiv.children("div.rootimg");
    if(nextnextdivlist.length > 0){
        var $nextnextdiv = nextnextdivlist;
        $nextnextdiv.detach();
        $nextdiv.append($nextnextdiv);
    }
    $rootdiv.append($nextdiv);
    return $nextdiv;
}
function delete_div($rootdiv){
    var $replacediv = $rootdiv.children("div.rootimg")
    $replacediv.detach()
    $rootdiv.parent().append($replacediv)
    $rootdiv.remove()
}
function activate_add_button($div){
    var $next_add_button = $div.children("button.add-button");
    $next_add_button.click(function(){
        expand_div($div)
    })
}
function activate_del_button($div){
    var $next_del_button = $div.children("button.del-button");
    $next_del_button.click(function(){
        delete_div($div)
    })
}
function activate_file_upload_button($div){
    $div.find('.img-input').change(function(){
        showUploadImg($div,this);
    });
}
function activate_buttons($div){
    activate_add_button($div)
    activate_del_button($div)
    activate_file_upload_button($div)
}
function $new_img_div(){
    var $retdiv = $("div.img-prototype").clone(true,true);
    $retdiv.show();
    $retdiv.removeClass("img-prototype");
    $retdiv.addClass("rootimg");
    activate_buttons($retdiv);
    return $retdiv;
}
function make_img_div(img,$last_div){
    var $img_div = expand_div($last_div)
    var date = new Date(img.taken_at);
    $img_div.find('[name="month"]').val(date.getMonth());
    $img_div.find('[name="day"]').val(date.getDate());
    $img_div.find('[name="year"]').val(date.getFullYear());
    $img_div.find('[name="description"]').val(img.description);
    $img_div.find('[name="img_id"]').val(img.id);
    $img_div.find('[name="img-preview"]').attr('src',"/static/thumbnails/"+img.filename);
    return $img_div;
}
function initalize_edit_images(){
    var $last_img_div = $("#img-holder");
    ip_images.forEach(function(img){
        $last_img_div = make_img_div(img,$last_img_div);
    });
}
$(document).ready(function(){
    layer_message = $("#layer-form-issue");
    icon_message = $("#icon-form-issue");
    map_message = $("#map-form-issue");
    title_message = $("#title-form-issue");
    console.log((new Date(ip_images[0].taken_at)).getFullYear());
    $("#root-add-button").click(function(){
        expand_div($("#img-holder"))
    })
    initalize_edit_images();
});
