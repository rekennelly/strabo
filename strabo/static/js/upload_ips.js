var InputField = function(message_identifier,is_valid_cond){
    this.check = function(form){
        return is_valid_cond(form)
    }
    this.hideMessage = function(){
        $(message_identifier).hide();
    }
    this.showMessage = function(){
        $(message_identifier).show();
    }
}
var validators = [
    new InputField("#map-form-issue",function(form){
        return form.geojson.value != "";
    }),
    new InputField("#icon-form-issue",function(form){
        return form.icon.selectedIndex != 0
    }),
    new InputField("#title-form-issue",function(form){
        return form.name.value != ""
    }),
    new InputField("#layer-form-issue",function(form){
        return form.layer.selectedIndex != 0
    })
]

function checkForm(form){
    /*
   :param form: Special builtin form object.
   :returns: Whether the form is vaild or not. If it returns false, then the form is not submitted.
    */
    var is_valid = true;
    validators.forEach(function(validator){
        if(validator.check(form)){
            validator.hideMessage();
        }
        else{
            is_valid = false;
            validator.showMessage();
        }
    })
    return is_valid;
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
    $("#root-add-button").click(function(){
        expand_div($("#img-holder"))
    })
});
