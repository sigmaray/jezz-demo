(function() {
  var API_KEY, PER_PAGE;

  API_KEY = '4cc2a6e2419deebfe86eca026cfda157';

  PER_PAGE = 20;

  $(function() {
    var addPics, downloadPics, handleEvents, oldScrollPos, page, scrollPos;
    page = 1;
    window.block = false;
    scrollPos = 0;
    oldScrollPos = 0;
    downloadPics = function(pic, page, per_page) {
      var url;
      if (page == null) {
        page = 1;
      }
      if (per_page == null) {
        per_page = PER_PAGE;
      }
      url = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=' + API_KEY + '&text=' + pic + '&safe_search=1&page=' + page + '&per_page=' + per_page;
      window.block = true;
      $('#preloader').show();
      return $.getJSON(url + '&format=json&jsoncallback=?', function(data) {
        $('#preloader').hide();
        $.each(data.photos.photo, function(i, item) {
          var bigImageSrc, src;
          console.log(JSON.stringify(item));
          src = 'http://farm' + item.farm + '.static.flickr.com/' + item.server + '/' + item.id + '_' + item.secret + '_m.jpg';
          bigImageSrc = 'http://farm' + item.farm + '.static.flickr.com/' + item.server + '/' + item.id + '_' + item.secret + '_c.jpg';
          return $('#images').append($('<a>').attr('href', bigImageSrc).attr('target', '_blank').append($('<img/>').attr('src', src).attr('class', 'flickr_image')));
        });
        return window.block = false;
      });
    };
    addPics = function() {
      downloadPics($('#searchInput').val(), page);
      return page++;
    };
    handleEvents = function() {
      $('#goButton').click(function() {
        $('#images').html('');
        page = 0;
        return addPics();
      });
      return $(window).scroll(function() {
        scrollPos = $(window).scrollTop();
        if (scrollPos > oldScrollPos) {
          if (($(document).height() - $(window).height() - $(window).scrollTop()) < 300) {
            if (!window.block) {
              addPics();
            }
          }
        }
        return oldScrollPos = scrollPos;
      });
    };
    handleEvents();
    return addPics();
  });

}).call(this);
