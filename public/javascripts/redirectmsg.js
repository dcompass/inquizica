// From: http://jquery-howto.blogspot.com/2009/09/get-url-parameters-values-with-jquery.html
// Read a page's GET URL variables and return them as an associative array.
function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

$(document).ready(function () {
  // console.log(getUrlVars()['redirectmsg'] !== undefined, typeof getUrlVars()['redirectmsg']);
  if (getUrlVars()['redirectmsg'] !== undefined) {
    $('#redirect-msg').show();
    $('#redirect-msg .h').html(decodeURIComponent(getUrlVars()['redirectheader']));
    $('#redirect-msg .b').html(decodeURIComponent(getUrlVars()['redirectmsg']));
  } else {
    $('#redirect-msg').hide();
  }

  $('#redirect-msg').on('click', function () {
    $(this).closest('.message').transition('fade');
  });
});


// <div id="redirect-msg" class="ui floating compact warning message" style="display:none; width:400px !important; position:absolute; margin-left: -200px; left: 50%; top: 3em; z-index:10; ">
//   <i class="close icon"></i>
//   <div class="header h"></div>
//   <p class="b"></p>
// </div>
