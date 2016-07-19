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
        console.log($nextnextdiv);
        $nextnextdiv.detach();
        $nextdiv.append($nextnextdiv);
    }
    $rootdiv.append($nextdiv);
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
function activate_buttons($div){
    activate_add_button($div)
    activate_del_button($div)
}
function $new_img_div(){
    var $retdiv = $("div.img-prototype").clone(true,true);
    $retdiv.show();
    $retdiv.removeClass("img-prototype");
    $retdiv.addClass("rootimg");
    activate_buttons($retdiv);
    return $retdiv;
}
$(document).ready(function(){
    layer_message = $("#layer-form-issue");
    icon_message = $("#icon-form-issue");
    map_message = $("#map-form-issue");
    title_message = $("#title-form-issue");

    $("#root-add-button").click(function(){
        expand_div($("#img-holder"))
    })
});
